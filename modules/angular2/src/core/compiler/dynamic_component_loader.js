import {Key, Injector, Injectable, ResolvedBinding} from 'angular2/di'
import {Compiler} from './compiler';
import {DirectiveMetadataReader} from './directive_metadata_reader';
import {Type, BaseException, stringify, isPresent} from 'angular2/src/facade/lang';
import {Promise} from 'angular2/src/facade/async';
import {Component} from 'angular2/src/core/annotations/annotations';
import {ViewFactory} from 'angular2/src/core/compiler/view_factory';
import {AppViewHydrator} from 'angular2/src/core/compiler/view_hydrator';
import {ElementRef, DirectiveBinding} from './element_injector';
import {AppView} from './view';

/**
 * @exportedAs angular2/view
 */
export class ComponentRef {
  location:ElementRef;
  instance:any;
  componentView:AppView;
  _dispose:Function;

  constructor(location:ElementRef, instance:any, componentView:AppView){
    this.location = location;
    this.instance = instance;
    this.componentView = componentView;
  }

  get injector() {
    return this.location.injector;
  }

  get hostView() {
    return this.location.hostView;
  }

  dispose() {
    this._dispose();
  }
}

/**
 * Service for dynamically loading a Component into an arbitrary position in the internal Angular
 * application tree.
 *
 * @exportedAs angular2/view
 */
@Injectable()
export class DynamicComponentLoader {
  _compiler:Compiler;
  _viewFactory:ViewFactory;
  _viewHydrator:AppViewHydrator;
  _directiveMetadataReader:DirectiveMetadataReader;

  constructor(compiler:Compiler, directiveMetadataReader:DirectiveMetadataReader,
              viewFactory:ViewFactory, viewHydrator:AppViewHydrator) {
    this._compiler = compiler;
    this._directiveMetadataReader = directiveMetadataReader;
    this._viewFactory = viewFactory;
    this._viewHydrator = viewHydrator;
  }

  /**
   * Loads a component into the location given by the provided ElementRef. The loaded component
   * receives injection as if it in the place of the provided ElementRef.
   */
  loadIntoExistingLocation(type:Type, location:ElementRef, injector:Injector = null):Promise<ComponentRef> {
    this._assertTypeIsComponent(type);
    var annotation = this._directiveMetadataReader.read(type).annotation;
    var componentBinding = DirectiveBinding.createFromType(type, annotation);

    return this._compiler.compile(type).then(componentProtoView => {
      var componentView = this._viewFactory.getView(componentProtoView);
      var hostView = location.hostView;
      this._viewHydrator.hydrateDynamicComponentView(
        hostView, location.boundElementIndex, componentView, componentBinding, injector);

      // TODO(vsavkin): return a component ref that dehydrates the component view and removes it
      // from the component child views
      // See ViewFactory.returnView
      // See AppViewHydrator.dehydrateDynamicComponentView
      return new ComponentRef(location, location.elementInjector.getDynamicallyLoadedComponent(), componentView);
    });
  }

  /**
   * Loads a component as a child of the View given by the provided ElementRef. The loaded
   * component receives injection normally as a hosted view.
   */
  loadIntoNewLocation(elementOrSelector:any, type:Type, injector:Injector = null):Promise<ComponentRef> {
    this._assertTypeIsComponent(type);

    return  this._compiler.compileInHost(type).then(hostProtoView => {
      var hostView = this._viewFactory.getView(hostProtoView);
      this._viewHydrator.hydrateInPlaceHostView(null, elementOrSelector, hostView, injector);

      // TODO(vsavkin): return a component ref that dehydrates the host view
      // See ViewFactory.returnView
      // See AppViewHydrator.dehydrateInPlaceHostView
      var newLocation = new ElementRef(hostView.elementInjectors[0]);
      var component = hostView.elementInjectors[0].getComponent();
      return new ComponentRef(newLocation, component, hostView.componentChildViews[0]);
    });
  }


  loadNextToExistingLocation(type:Type, location:ElementRef, injector:Injector = null):Promise<ComponentRef> {
    this._assertTypeIsComponent(type);

    return this._compiler.compileInHost(type).then(hostProtoView => {
      var hostView = location.viewContainer.create(-1, hostProtoView);

      var newLocation = new ElementRef(hostView.elementInjectors[0]);
      var component = hostView.elementInjectors[0].getComponent();
      var c = new ComponentRef(newLocation, component, hostView.componentChildViews[0]);

      c._dispose = () => {
        location.viewContainer.remove(0);
      };
      return c;
    });
  }

  /** Asserts that the type being dynamically instantiated is a Component. */
  _assertTypeIsComponent(type:Type) {
    var annotation = this._directiveMetadataReader.read(type).annotation;
    if (!(annotation instanceof Component)) {
      throw new BaseException(`Could not load '${stringify(type)}' because it is not a component.`);
    }
  }
}
