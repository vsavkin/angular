import {OnInit, provide, ReflectiveInjector, ComponentResolver} from '@angular/core';
import {RouterOutlet} from './directives/router_outlet';
import {Type, isBlank, isPresent} from './facade/lang';
import {ListWrapper} from './facade/collection';
import {EventEmitter, Observable, PromiseWrapper, ObservableWrapper} from './facade/async';
import {StringMapWrapper} from './facade/collection';
import {BaseException} from '@angular/core';
import {RouterUrlSerializer} from './router_url_serializer';
import {CanDeactivate} from './interfaces';
import {recognize} from './recognize';
import {Location} from '@angular/common';
import {link} from './link';

import {
  routeSegmentComponentFactory,
  RouteSegment,
  UrlTree,
  RouteTree,
  rootNode,
  TreeNode,
  UrlSegment,
  serializeRouteSegmentTree,
  createEmptyRouteTree
} from './segments';
import {hasLifecycleHook} from './lifecycle_reflector';
import {DEFAULT_OUTLET_NAME} from './constants';

/**
 * @internal
 */
export class RouterOutletMap {
  /** @internal */
  _outlets: {[name: string]: RouterOutlet} = {};
  registerOutlet(name: string, outlet: RouterOutlet): void { this._outlets[name] = outlet; }
}

export abstract class RouteSegmentContainer { abstract get routeSegment(): RouteSegment; }

/**
 * The `Router` is responsible for mapping URLs to components.
 *
 * You can see the state of the router by inspecting the read-only fields `router.urlTree`
 * and `router.routeTree`.
 */
export class Router {
  private _routeTree: RouteTree;
  private _urlTree: UrlTree;
  private _locationSubscription: any;
  private _changes: EventEmitter<void> = new EventEmitter<void>();

  /**
   * @internal
   */
  constructor(private _rootComponent: Object, private _rootComponentType: Type,
              private _componentResolver: ComponentResolver,
              private _urlSerializer: RouterUrlSerializer,
              private _routerOutletMap: RouterOutletMap, private _location: Location) {
    this._routeTree = createEmptyRouteTree(this._rootComponentType);
    this._setUpLocationChangeListener();
    this.navigateByUrl(this._location.path());
  }

  /**
   * Returns the current url tree.
   */
  get urlTree(): UrlTree { return this._urlTree; }

  /**
   * Returns the current route tree.
   */
  get routeTree(): RouteTree { return this._routeTree; }

  /**
   * An observable or url changes from the router.
   */
  get changes(): Observable<void> { return this._changes; }

  /**
   * Navigate based on the provided url. This navigation is always absolute.
   *
   * ### Usage
   *
   * ```
   * router.navigateByUrl("/team/33/user/11");
   * ```
   */
  navigateByUrl(url: string): Promise<void> {
    return this._navigate(this._urlSerializer.parse(url));
  }

  /**
   * Navigate based on the provided array of commands and a starting point.
   * If no segment is provided, the navigation is absolute.
   *
   * ### Usage
   *
   * ```
   * router.navigate(['team', 33, 'team', '11], segment);
   * ```
   */
  navigate(commands: any[], segment?: RouteSegment): Promise<void> {
    return this._navigate(this.createUrlTree(commands, segment));
  }

  /**
   * @internal
   */
  dispose(): void { ObservableWrapper.dispose(this._locationSubscription); }

  /**
   * Applies an array of commands to the current url tree and creates
   * a new url tree.
   *
   * When given a segment, applies the given commands starting from the segment.
   * When not given a segment, applies the given command starting from the root.
   *
   * ### Usage
   *
   * ```
   * // create /team/33/user/11
   * router.createUrlTree(['/team', 33, 'user', 11]);
   *
   * // create /team/33;expand=true/user/11
   * router.createUrlTree(['/team', 33, {expand: true}, 'user', 11]);
   *
   * // you can collapse static fragments like this
   * router.createUrlTree(['/team/33/user', userId]);
   *
   * // assuming the current url is `/team/33/user/11` and the segment points to `user/11`
   *
   * // navigate to /team/33/user/11/details
   * router.createUrlTree(['details'], segment);
   *
   * // navigate to /team/33/user/22
   * router.createUrlTree(['../22'], segment);
   *
   * // navigate to /team/44/user/22
   * router.createUrlTree(['../../team/44/user/22'], segment);
   * ```
   */
  createUrlTree(commands: any[], segment?: RouteSegment): UrlTree {
    let s = isPresent(segment) ? segment : this._routeTree.root;
    return link(s, this._routeTree, this.urlTree, commands);
  }

  /**
   * Serializes a {@link UrlTree} into a string.
   */
  serializeUrl(url: UrlTree): string { return this._urlSerializer.serialize(url); }

  private _setUpLocationChangeListener(): void {
    this._locationSubscription = this._location.subscribe(
        (change) => { this._navigate(this._urlSerializer.parse(change['url'])); });
  }

  private _navigate(url: UrlTree): Promise<void> {
    this._urlTree = url;
    return recognize(this._componentResolver, this._rootComponentType, url, this._routeTree)
        .then(currTree => {
          return new _ActivateSegments(currTree, this._routeTree)
              .activate(this._routerOutletMap, this._rootComponent)
              .then(updated => {
                if (updated) {
                  this._routeTree = currTree;
                  this._location.go(this._urlSerializer.serialize(this._urlTree));
                  this._changes.emit(null);
                }
              });
        });
  }
}


class _ActivateSegments {
  private deactivations: Object[][] = [];
  private performMutation: boolean = true;

  constructor(private currTree: RouteTree, private prevTree: RouteTree) {}

  activate(parentOutletMap: RouterOutletMap, rootComponent: Object): Promise<boolean> {
    let prevRoot = isPresent(this.prevTree) ? rootNode(this.prevTree) : null;
    let currRoot = rootNode(this.currTree);

    let l = new _LifecycleCollector(this.currTree, this.prevTree);
    return l.canDeactivate(currRoot, prevRoot, parentOutletMap, rootComponent)
        .then(res => {
          this.performMutation = true;
          if (res) {
            this.activateChildSegments(currRoot, prevRoot, parentOutletMap);
          }
          return res;
        });
  }

  private activateChildSegments(currNode: TreeNode<RouteSegment>, prevNode: TreeNode<RouteSegment>,
                                outletMap: RouterOutletMap): void {
    var prevChildren = _childrenToMap(prevNode);
    currNode.children.forEach(c => {
      this.activateSegments(c, prevChildren[c.value.outlet], outletMap);
      StringMapWrapper.delete(prevChildren, c.value.outlet);
    });
    StringMapWrapper.forEach(
        prevChildren, (v, k) => this.deactivateOutletAndItChildren(outletMap._outlets[k], v));
  }

  activateSegments(currNode: TreeNode<RouteSegment>, prevNode: TreeNode<RouteSegment>,
                   parentOutletMap: RouterOutletMap): void {
    let curr = currNode.value;
    let prev = isPresent(prevNode) ? prevNode.value : null;
    let outlet = _getOutlet(parentOutletMap, currNode.value);

    if (curr === prev) {
      this.activateChildSegments(currNode, prevNode, outlet.outletMap);
    } else {
      if (this.routerCanReuse(outlet, curr, prev)) {
        this.invokeOnDeactivateIfNeeded(outlet, prev);
        this.invokeOnActivateIfNeeded(outlet, curr, prev);
        this.activateChildSegments(currNode, prevNode, outlet.outletMap);

      } else {
        this.deactivateOutletAndItChildren(outlet, prev);
        let outletMap = new RouterOutletMap();
        let component = this.activateNewSegments(outletMap, curr, prev, outlet);
        this.activateChildSegments(currNode, prevNode, outletMap);
      }
    }
  }

  private activateNewSegments(outletMap: RouterOutletMap, curr: RouteSegment, prev: RouteSegment,
                              outlet: RouterOutlet): Object {
    let resolved = ReflectiveInjector.resolve([
      provide(RouterOutletMap, {useValue: outletMap}),
      provide(RouteSegmentContainer, {useValue: outlet})
    ]);
    let ref = outlet.activate(routeSegmentComponentFactory(curr), curr, resolved, outletMap);
    this.invokeOnActivateIfNeeded(outlet, curr, prev);
    return ref.instance;
  }

  private deactivateOutletAndItChildren(outlet: RouterOutlet, prev: RouteSegment): void {
    if (isPresent(outlet) && outlet.isActivated) {
      StringMapWrapper.forEach(outlet.outletMap._outlets,
                               (v, k) => this.deactivateOutletAndItChildren(v, prev));
      this.invokeOnDeactivateIfNeeded(outlet, prev);
      outlet.deactivate();
    }
  }

  private invokeOnActivateIfNeeded(outlet: RouterOutlet, curr: RouteSegment,
                                   prev: RouteSegment): void {
    if (hasLifecycleHook("routerOnActivate", outlet.component)) {
      outlet.component.routerOnActivate(curr, prev, this.currTree, this.prevTree);
    }
  }

  private invokeOnDeactivateIfNeeded(outlet: RouterOutlet, curr: RouteSegment): void {
    if (hasLifecycleHook("routerOnDeactivate", outlet.component)) {
      outlet.component.routerOnDeactivate(curr, this.prevTree, this.currTree);
    }
  }

  private routerCanReuse(outlet: RouterOutlet, curr: RouteSegment, prev: RouteSegment): boolean {
    return isPresent(prev) && curr.type === prev.type && outlet.isActivated &&
           hasLifecycleHook("routerCanReuse", outlet.component) &&
           outlet.component.routerCanReuse(curr, prev, this.currTree, this.prevTree);
  }
}


class _LifecycleCollector {
  private deactivations: Object[][] = [];

  constructor(private currTree: RouteTree, private prevTree: RouteTree) {}

  canDeactivate(currRoot: TreeNode<RouteSegment>, prevRoot: TreeNode<RouteSegment>,
                outletMap: RouterOutletMap, rootComponent: Object): Promise<boolean> {
    this.walkChildSegments(currRoot, prevRoot, outletMap, [rootComponent]);
    let allPaths = PromiseWrapper.all(this.deactivations.map(r => this.checkCanDeactivatePath(r)));
    return allPaths.then((values: boolean[]) => values.filter(v => v).length === values.length);
  }

  private checkCanDeactivatePath(path: Object[]): Promise<boolean> {
    let curr = PromiseWrapper.resolve(true);
    for (let p of ListWrapper.reversed(path)) {
      curr = curr.then(_ => {
        if (hasLifecycleHook("routerCanDeactivate", p)) {
          return (<CanDeactivate>p).routerCanDeactivate(this.prevTree, this.currTree);
        } else {
          return _;
        }
      });
    }
    return curr;
  }

  private walkChildSegments(currNode: TreeNode<RouteSegment>, prevNode: TreeNode<RouteSegment>,
                            outletMap: RouterOutletMap, components: Object[]): void {
    var prevChildren = _childrenToMap(prevNode);
    currNode.children.forEach(c => {
      this.walkSegment(c, prevChildren[c.value.outlet], outletMap, components);
      StringMapWrapper.delete(prevChildren, c.value.outlet);
    });

    StringMapWrapper.forEach(prevChildren,
                             (v, k) => this.walkDeactivation(outletMap._outlets[k], components));
  }

  walkSegment(currNode: TreeNode<RouteSegment>, prevNode: TreeNode<RouteSegment>,
              parentOutletMap: RouterOutletMap, components: Object[]): void {
    let curr = currNode.value;
    let prev = isPresent(prevNode) ? prevNode.value : null;
    let outlet = _getOutlet(parentOutletMap, currNode.value);
    if (curr === prev) {
      this.walkChildSegments(currNode, prevNode, outlet.outletMap,
                             components.concat([outlet.component]));
    } else {
      this.walkDeactivation(outlet, components);
    }
  }

  private walkDeactivation(outlet: RouterOutlet, components: Object[]): void {
    if (isPresent(outlet) && outlet.isActivated) {
      StringMapWrapper.forEach(outlet.outletMap._outlets,
                               (v, k) => this.walkDeactivation(v, components));
      this.deactivations.push(components.concat([outlet.component]));
    }
  }
}

function _childrenToMap(node: TreeNode<RouteSegment>) {
  return isPresent(node) ?
             node.children.reduce(
                 (m, c) => {
                   m[c.value.outlet] = c;
                   return m;
                 },
                 {}) :
             {};
};

function _getOutlet(outletMap: RouterOutletMap, segment: RouteSegment): RouterOutlet {
  let outlet = outletMap._outlets[segment.outlet];
  if (isBlank(outlet)) {
    if (segment.outlet == DEFAULT_OUTLET_NAME) {
      throw new BaseException(`Cannot find default outlet`);
    } else {
      throw new BaseException(`Cannot find the outlet ${segment.outlet}`);
    }
  }
  return outlet;
}
