import {Component, Decorator, View, NgElement, For, If, bootstrap, ON_PUSH} from 'angular2/angular2';
import {
  AST,
  EmptyExpr,
  ImplicitReceiver,
  AccessMember,
  LiteralPrimitive,
  Expression,
  Binary,
  PrefixNot,
  Conditional,
  Pipe,
  Assignment,
  Chain,
  KeyedAccess,
  LiteralArray,
  LiteralMap,
  Interpolation,
  MethodCall,
  FunctionCall,
  TemplateBindings,
  TemplateBinding,
  ASTWithSource
  } from 'angular2/src/change_detection/parser/ast';

import {
  AstTransformers
  } from 'angular2/src/change_detection/parser/parser';

import {Injectable, bind} from 'angular2/di';
import {EventEmitter, Observable, ObservableWrapper} from 'angular2/src/facade/async';
import {reflector} from 'angular2/src/reflection/reflection';



@Component({
  selector:'hello-app'
})
@View({
  template: `
    Manually:

    Name {{model.getValue("person.name")|async}}
    Age {{model.getValue("person.age")|async}}

    With AST transformations:

    Name {{f:person.name}}
    Age {{f:person.age}}
  `
})
class TodoApp {
  constructor() {
    var name = new DummyObservable("Jim");
    var age = new DummyObservable(42) ;

    this.model = {
      getValue: path => path === "person.name" ? name : age
    };
  }
}

// This is an example of an AST transformer.
// Currently, it is AST -> AST
// But we can provide more information (e.g, updated source). This can help improving error messages.
// Note that this is an AST macro, not a string macro. This allows to perform safe transformations.
function falkorIntegration(ast:AST):AST {
  var path = [];
  var c = ast;
  while (!(c instanceof ImplicitReceiver)) {
    path.push(c.name);
    c = c.receiver;
  }

  var model = new AccessMember(new ImplicitReceiver(), "model", reflector.getter("model"), reflector.setter("model"));
  var getValue = new MethodCall(model, "getValue", reflector.method("getValue"), new LiteralPrimitive(path.join(".")));
  var pipe = new Pipe(getValue, "async", [], true);

  return pipe;
}

// A dummy observable
class DummyObservable extends Observable {
  value:any;

  constructor(value:any) {
    super();
    this.value = value;
  }

  observer(obs) {
    obs.next(this.value);
    return {dispose: function(){}}
  }
}

export function main() {
  bootstrap(TodoApp, [
    bind(AstTransformers).toValue({
      f: falkorIntegration
    })
  ]);
}