import {Observable, ObservableWrapper} from 'angular2/src/facade/async';
import {isBlank, isPresent} from 'angular2/src/facade/lang';
import {Pipe, NO_CHANGE} from './pipe';
import {ChangeDetectorRef} from '../change_detector_ref';

export class AsyncPipe extends Pipe {
  _ref:ChangeDetectorRef;

  _latestValue:Object;
  _latestReturnedValue:Object;

  _subscription:Object;
  _observable:Observable;

  constructor(ref:ChangeDetectorRef) {
    super();
    this._ref = ref;
    this._latestValue = null;
    this._latestReturnedValue = null;
    this._subscription = null;
    this._observable = null;
  }

  supports(obs):boolean {
    return ObservableWrapper.isObservable(obs);
  }

  onDestroy() {
    if (isPresent(this._subscription)) {
      this._dispose();
    };
  }

  transform(obs:Observable):any {
    if (isBlank(this._subscription)) {
      this._subscribe(obs);
      return null;
    }

    if (obs !== this._observable) {
      this._dispose();
      return this.transform(obs);
    }

    if (this._latestValue === this._latestReturnedValue) {
      return NO_CHANGE;
    } else {
      this._latestReturnedValue = this._latestValue;
      return this._latestValue;
    }
  }

  _subscribe(obs:Observable) {
    this._observable = obs;
    this._subscription = ObservableWrapper.subscribe(obs,
        value => this._updateLatestValue(value),
        e => {throw e;}
    );
  }

  _dispose() {
    ObservableWrapper.dispose(this._subscription);
    this._subscription = null;
    this._observable = null;
  }

  _updateLatestValue(value:Object) {
    this._latestValue = value;
    this._ref.requestCheck();
  }
}


export class AsyncPipeFactory {
  supports(obs):boolean {
    return ObservableWrapper.isObservable(obs);
  }

  create(cdRef):Pipe {
    return new AsyncPipe(cdRef);
  }
}