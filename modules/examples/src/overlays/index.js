import {Component, Decorator, View, NgElement, bootstrap, DynamicComponentLoader, ElementRef, ComponentRef} from 'angular2/angular2';
import {Injectable} from 'angular2/di';
import {reflector} from 'angular2/src/reflection/reflection';
import {ReflectionCapabilities} from 'angular2/src/reflection/reflection_capabilities';
import {ListWrapper, List} from 'angular2/src/facade/collection';
import {Type, isPresent} from 'angular2/src/facade/lang';
import {EventEmitter, ObservableWrapper} from 'angular2/src/facade/async';


/**
 * The application demonstrates how to create dialogs and tooltips.
 *
 * A tooltip is added next to the element where the TooltipDecorator is placed.
 * A dialog is added next to the element where the right DialogLocation is placed.
 *
 * There are many ways to implement dialogs and tooltips. This app just shows one of them.
 */
@Component({
  selector: 'overlay-app',
  injectables: [Dialogs]
})
@View({
  template: `
    <use-dialog></use-dialog>
    <div dialog-location="main"></div>
  `,
  directives: [DialogLocation, UseDialog]
})
export class OverlayCmp {
}
@Component({
  selector: 'use-dialog'
})
@View({
  template: `
    <button (click)="showDialog()" tooltip="click to show dialog">Show Dialog</button>
  `,
  directives: [TooltipDecorator]
})
export class UseDialog {
  dialogRef:ComponentRef;

  constructor(dialogs:Dialogs) {
    this.dialogs = dialogs;
  }

  showDialog() {
    this.dialogRef = this.dialogs.showDialog('main', HelloDialog);
  }
}






// this is a generic component that should be provided by a library
@Decorator({
  selector: '[dialog-location]',
  lifecycle: ['onDestroy'],
  properties: {
    name: 'dialog-location'
  }
})
class DialogLocation {
  name:string;
  dialogs:Dialogs;
  location:ElementRef;

  constructor(dialogs:Dialogs, location:ElementRef) {
    this.dialogs = dialogs;
    this.location = location;
    this.dialogs.add(this);
  }

  onDestroy() {
    this.dialogs.remove(this);
  }
}

// this is a generic service that should be provided by a library
@Injectable()
class Dialogs {
  loader:DynamicComponentLoader;
  locations:List<DialogLocation>;

  constructor(loader:DynamicComponentLoader) {
    this.loader = loader;
    this.locations = [];
  }

  add(location:DialogLocation) {
    ListWrapper.push(this.locations, location);
  }

  remove(location:DialogLocation) {
    ListWrapper.remove(this.locations, location);
  }

  showDialog(locationName:string, type:Type) {
    var loc = ListWrapper.find(this.locations, loc => loc.name == locationName);
    if (isPresent(loc)) {
      // We can pass an Injector here as an optional third parameter.
      return this.loader.loadNextToExistingLocation(type, loc.location).then(ref => {
        // We assume that the dialog class has the close event emitter.
        // When it emits an event, we dispose of the dialog.
        // Since we have access to the instance, we can set any data we want to the instance.
        ObservableWrapper.subscribe(ref.instance.close, (_) => ref.dispose());
        return ref;
      });
    }
    throw "Cannot find the location";
  }
}

// this is how you can implement a dialog
@Component({
  selector:'hello',
  events: ['close'],
  properties: {
    message: 'message'
  }
})
@View({
  template: `
    <div class="overlay">
      <div class="dialog">

        Hello from a dialog
        <button (click)="onClose()">Close</button>

      </div>
    </div>
  `
})
class HelloDialog {
  close:EventEmitter;

  constructor() {
    this.close = new EventEmitter();
  }

  onClose() {
    ObservableWrapper.callNext(this.close, null);
  }
}









// this is a generic decorator that should be provided by a library
@Decorator({
  selector:'[tooltip]',
  properties: {
    tooltip: 'tooltip'
  },
  hostListeners: {
    mouseover:'onOver()',
    mouseout:'onOut()'
  }
})
class TooltipDecorator {
  tooltip:string;
  loader:DynamicComponentLoader;
  element:ElementRef;
  ref:ComponentRef;

  constructor(loader:DynamicComponentLoader, element:ElementRef) {
    this.loader = loader;
    this.element = element;
  }

  onOver() {
    // We can pass an Injector here as an optional third parameter.
    this.loader.loadNextToExistingLocation(TooltipComponent, this.element).then(ref => {
      ref.instance.message = this.tooltip;
      this.ref = ref;
    });
  }

  onOut() {
    this.ref.dispose();
  }
}

// this is how you implement a tooltip
@Component({
  selector: 'tooltip',
  properties: {
    message: 'message'
  }
})
@View({
  template: `<div>[{{message}}]</div>`
})
class TooltipComponent {
  message:string;
}






export function main() {
  reflector.reflectionCapabilities = new ReflectionCapabilities();
  bootstrap(OverlayCmp);
}
