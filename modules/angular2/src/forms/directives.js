import {Template, Component, Decorator, NgElement, Ancestor, onChange} from 'angular2/core';
import {DOM} from 'angular2/src/facade/dom';
import {isBlank, isPresent, CONST} from 'angular2/src/facade/lang';
import {StringMapWrapper, ListWrapper} from 'angular2/src/facade/collection';
import {ControlGroup, Control} from './model';
import * as validators from './validators';

@CONST()
export class ControlValueAccessor {
  readValue(el){}
  writeValue(el, value):void {}
}

@CONST()
class DefaultControlValueAccessor extends ControlValueAccessor {
  constructor() {
    super();
  }

  readValue(el) {
    return DOM.getValue(el);
  }

  writeValue(el, value):void {
    DOM.setValue(el,value);
  }
}

@CONST()
class CheckboxControlValueAccessor extends ControlValueAccessor {
  constructor() {
    super();
  }

  readValue(el):boolean {
    return DOM.getChecked(el);
  }

  writeValue(el, value:boolean):void {
    DOM.setChecked(el, value);
  }
}

var controlValueAccessors = {
  "checkbox" : new CheckboxControlValueAccessor(),
  "text" : new DefaultControlValueAccessor()
};

function controlValueAccessorFor(controlType:string):ControlValueAccessor {
  var accessor = StringMapWrapper.get(controlValueAccessors, controlType);
  if (isPresent(accessor)) {
    return accessor;
  } else {
    return StringMapWrapper.get(controlValueAccessors, "text");
  }
}

@Decorator({
  lifecycle: [onChange],
  selector: '[control]',
  bind: {
    'controlName' : 'control',
    'type' : 'type'
  }
})
export class ControlDirective {
  _groupDecorator:ControlGroupDirective;
  _el:NgElement;

  controlName:string;
  type:string;
  valueAccessor:ControlValueAccessor;

  validator:Function;

  constructor(@Ancestor() groupDecorator:ControlGroupDirective, el:NgElement)  {
    this._groupDecorator = groupDecorator;
    this._el = el;
    this.validator = validators.nullValidator;
  }

  // TODO: vsavkin this should be moved into the constructor once static bindings
  // are implemented
  onChange(_) {
    this._initialize();
  }

  _initialize() {
    this._groupDecorator.addDirective(this);

    var c = this._control();
    c.validator = validators.compose([c.validator, this.validator]);

    if (isBlank(this.valueAccessor)) {
      this.valueAccessor = controlValueAccessorFor(this.type);
    }

    this._updateDomValue();
    DOM.on(this._el.domElement, "change", (_) => this._updateControlValue());
  }

  _updateDomValue() {
    this.valueAccessor.writeValue(this._el.domElement, this._control().value);
  }

  _updateControlValue() {
    this._control().updateValue(this.valueAccessor.readValue(this._el.domElement));
  }

  _control() {
    return this._groupDecorator.findControl(this.controlName);
  }
}

@Decorator({
  selector: '[control-group]',
  bind: {
    'controlGroup' : 'control-group'
  }
})
export class ControlGroupDirective {
  _controlGroup:ControlGroup;
  _directives:List<ControlDirective>;

  constructor() {
    super();
    this._directives = ListWrapper.create();
  }

  set controlGroup(controlGroup:ControlGroup) {
    this._controlGroup = controlGroup;
    ListWrapper.forEach(this._directives, (cd) => cd._updateDomValue());
  }

  addDirective(c:ControlDirective) {
    ListWrapper.push(this._directives, c);
  }

  findControl(name:string):Control {
    return this._controlGroup.controls[name];
  }
}

export var FormDirectives = [
  ControlGroupDirective, ControlDirective
];
