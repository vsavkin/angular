import {isPresent, isBlank, BaseException, StringWrapper} from 'angular2/src/facade/lang';
import {List, ListWrapper} from 'angular2/src/facade/collection';
import {ChangeDetectionUtil} from './change_detection_util';
import {ChangeDetectorRef} from './change_detector_ref';
import {DirectiveIndex} from './directive_record';
import {ChangeDetector, ChangeDispatcher} from './interfaces';
import {Pipes} from './pipes';
import {
  ChangeDetectionError,
  ExpressionChangedAfterItHasBeenCheckedException,
  DehydratedException
} from './exceptions';
import {BindingTarget} from './binding_record';
import {Locals} from './parser/locals';
import {CHECK_ALWAYS, CHECK_ONCE, CHECKED, DETACHED} from './constants';
import {wtfCreateScope, wtfLeave, WtfScopeFn} from '../profile/profile';
import {isObservable} from './observable_facade';

var _scope_check: WtfScopeFn = wtfCreateScope(`ChangeDetector#check(ascii id, bool throwOnChange)`);

class _Context {
  constructor(public element: any, public componentElement: any, public context: any,
              public locals: any, public injector: any, public expression: any) {}
}

export class AbstractChangeDetector<T> implements ChangeDetector {
  lightDomChildren: List<any> = [];
  shadowDomChildren: List<any> = [];
  parent: ChangeDetector;
  ref: ChangeDetectorRef;

  // The names of the below fields must be kept in sync with codegen_name_util.ts or
  // change detection will fail.
  alreadyChecked: any = false;
  context: T;
  locals: Locals = null;
  mode: string = null;
  pipes: Pipes = null;
  propertyBindingIndex: number;

  // This is an experimental feature. Works only in Dart.
  subscriptions: any[];
  streams: any[];

  constructor(public id: string, public dispatcher: ChangeDispatcher,
              public numberOfPropertyProtoRecords: number, public bindingTargets: BindingTarget[],
              public directiveIndices: DirectiveIndex[], public modeOnHydrate: string) {
    this.ref = new ChangeDetectorRef(this);
  }

  addChild(cd: ChangeDetector): void {
    this.lightDomChildren.push(cd);
    cd.parent = this;
  }

  removeChild(cd: ChangeDetector): void { ListWrapper.remove(this.lightDomChildren, cd); }

  addShadowDomChild(cd: ChangeDetector): void {
    this.shadowDomChildren.push(cd);
    cd.parent = this;
  }

  removeShadowDomChild(cd: ChangeDetector): void { ListWrapper.remove(this.shadowDomChildren, cd); }

  remove(): void { this.parent.removeChild(this); }

  handleEvent(eventName: string, elIndex: number, locals: Locals): boolean {
    var res = this.handleEventInternal(eventName, elIndex, locals);
    this.markPathToRootAsCheckOnce();
    return res;
  }

  handleEventInternal(eventName: string, elIndex: number, locals: Locals): boolean { return false; }

  detectChanges(): void { this.runDetectChanges(false); }

  checkNoChanges(): void { throw new BaseException("Not implemented"); }

  runDetectChanges(throwOnChange: boolean): void {
    if (StringWrapper.equals(this.mode, DETACHED) || StringWrapper.equals(this.mode, CHECKED))
      return;
    var s = _scope_check(this.id, throwOnChange);
    this.detectChangesInRecords(throwOnChange);
    this._detectChangesInLightDomChildren(throwOnChange);
    if (throwOnChange === false) this.callOnAllChangesDone();
    this._detectChangesInShadowDomChildren(throwOnChange);
    if (StringWrapper.equals(this.mode, CHECK_ONCE)) this.mode = CHECKED;
    wtfLeave(s);
  }

  // This method is not intended to be overridden. Subclasses should instead provide an
  // implementation of `detectChangesInRecordsInternal` which does the work of detecting changes
  // and which this method will call.
  // This method expects that `detectChangesInRecordsInternal` will set the property
  // `this.propertyBindingIndex` to the propertyBindingIndex of the first proto record. This is to
  // facilitate error reporting.
  detectChangesInRecords(throwOnChange: boolean): void {
    if (!this.hydrated()) {
      this.throwDehydratedError();
    }
    try {
      this.detectChangesInRecordsInternal(throwOnChange);
    } catch (e) {
      this._throwError(e, e.stack);
    }
  }

  // Subclasses should override this method to perform any work necessary to detect and report
  // changes. For example, changes should be reported via `ChangeDetectionUtil.addChange`, lifecycle
  // methods should be called, etc.
  // This implementation should also set `this.propertyBindingIndex` to the propertyBindingIndex of
  // the
  // first proto record to facilitate error reporting. See {@link #detectChangesInRecords}.
  detectChangesInRecordsInternal(throwOnChange: boolean): void {}

  // This method is not intended to be overridden. Subclasses should instead provide an
  // implementation of `hydrateDirectives`.
  hydrate(context: T, locals: Locals, directives: any, pipes: any): void {
    this.mode = this.modeOnHydrate;
    this.context = context;
    this.locals = locals;
    this.pipes = pipes;
    this.hydrateDirectives(directives);
    this.alreadyChecked = false;
  }

  // Subclasses should override this method to hydrate any directives.
  hydrateDirectives(directives: any): void {}

  // This method is not intended to be overridden. Subclasses should instead provide an
  // implementation of `dehydrateDirectives`.
  dehydrate(): void {
    this.dehydrateDirectives(true);

    // This is an experimental feature. Works only in Dart.
    this.unsubsribeFromObservables();

    this.context = null;
    this.locals = null;
    this.pipes = null;
  }

  // Subclasses should override this method to dehydrate any directives. This method should reverse
  // any work done in `hydrateDirectives`.
  dehydrateDirectives(destroyPipes: boolean): void {}

  hydrated(): boolean { return this.context !== null; }

  callOnAllChangesDone(): void { this.dispatcher.notifyOnAllChangesDone(); }

  _detectChangesInLightDomChildren(throwOnChange: boolean): void {
    var c = this.lightDomChildren;
    for (var i = 0; i < c.length; ++i) {
      c[i].runDetectChanges(throwOnChange);
    }
  }

  _detectChangesInShadowDomChildren(throwOnChange: boolean): void {
    var c = this.shadowDomChildren;
    for (var i = 0; i < c.length; ++i) {
      c[i].runDetectChanges(throwOnChange);
    }
  }

  markAsCheckOnce(): void { this.mode = CHECK_ONCE; }

  markPathToRootAsCheckOnce(): void {
    var c: ChangeDetector = this;
    while (isPresent(c) && !StringWrapper.equals(c.mode, DETACHED)) {
      if (StringWrapper.equals(c.mode, CHECKED)) c.mode = CHECK_ONCE;
      c = c.parent;
    }
  }

  private unsubsribeFromObservables(): void {
    if (isPresent(this.subscriptions)) {
      for (var i = 0; i < this.subscriptions.length; ++i) {
        var s = this.subscriptions[i];
        if (isPresent(this.subscriptions[i])) {
          s.cancel();
          this.subscriptions[i] = null;
        }
      }
    }
  }

  // This is an experimental feature. Works only in Dart.
  protected observe(value: any, index: number): any {
    if (isObservable(value)) {
      if (isBlank(this.subscriptions)) {
        this.subscriptions = ListWrapper.createFixedSize(this.numberOfPropertyProtoRecords + 1);
        this.streams = ListWrapper.createFixedSize(this.numberOfPropertyProtoRecords + 1);
      }
      if (isBlank(this.subscriptions[index])) {
        this.streams[index] = value.changes;
        this.subscriptions[index] = value.changes.listen((_) => this.ref.requestCheck());
      } else if (this.streams[index] !== value.changes) {
        this.subscriptions[index].cancel();
        this.streams[index] = value.changes;
        this.subscriptions[index] = value.changes.listen((_) => this.ref.requestCheck());
      }
    }
    return value;
  }

  protected notifyDispatcher(value: any): void {
    this.dispatcher.notifyOnBinding(this._currentBinding(), value);
  }

  protected notifyDispatcherDebug(value: any): void {
    this.dispatcher.notifyOnBindingDebug(this._currentBinding(), value);
  }

  protected addChange(changes: StringMap<string, any>, oldValue: any,
                      newValue: any): StringMap<string, any> {
    if (isBlank(changes)) {
      changes = {};
    }
    changes[this._currentBinding().name] = ChangeDetectionUtil.simpleChange(oldValue, newValue);
    return changes;
  }

  private _throwError(exception: any, stack: any): void {
    var c = this.dispatcher.getDebugContext(this._currentBinding().elementIndex, null);
    var context = isPresent(c) ? new _Context(c.element, c.componentElement, c.context, c.locals,
                                              c.injector, this._currentBinding().debug) :
                                 null;
    throw new ChangeDetectionError(this._currentBinding().debug, exception, stack, context);
  }

  protected throwOnChangeError(oldValue: any, newValue: any): void {
    throw new ExpressionChangedAfterItHasBeenCheckedException(this._currentBinding().debug,
                                                              oldValue, newValue, null);
  }

  protected throwDehydratedError(): void { throw new DehydratedException(); }

  private _currentBinding(): BindingTarget {
    return this.bindingTargets[this.propertyBindingIndex];
  }
}
