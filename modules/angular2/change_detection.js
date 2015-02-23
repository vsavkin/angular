export {AST} from './src/change_detection/parser/ast';
export {Lexer} from './src/change_detection/parser/lexer';
export {Parser} from './src/change_detection/parser/parser';
export {ContextWithVariableBindings}
    from './src/change_detection/parser/context_with_variable_bindings';
export {ExpressionChangedAfterItHasBeenChecked, ChangeDetectionError}
    from './src/change_detection/exceptions';
export {ChangeRecord, ChangeDispatcher, ChangeDetector,
    CHECK_ONCE, CHECK_ALWAYS, DETACHED, CHECKED} from './src/change_detection/interfaces';
export {ProtoChangeDetector, DynamicProtoChangeDetector, JitProtoChangeDetector}
    from './src/change_detection/proto_change_detector';
export {DynamicChangeDetector}
    from './src/change_detection/dynamic_change_detector';
export * from './src/change_detection/pipes/pipe_registry';
export * from './src/change_detection/pipes/pipe';


import {ProtoChangeDetector, DynamicProtoChangeDetector, JitProtoChangeDetector}
    from './src/change_detection/proto_change_detector';
import {Pipe, NO_CHANGE} from './src/change_detection/pipes/pipe';
import {PipeRegistry} from './src/change_detection/pipes/pipe_registry';
import {ArrayChangesFactory} from './src/change_detection/pipes/array_changes';
import {NullPipeFactory} from './src/change_detection/pipes/null_pipe';

export class ChangeDetection {
  createProtoChangeDetector(name:string):ProtoChangeDetector{
    // TODO: this should be abstract, once supported in AtScript
    return null;
  }
}

/**
 * This should be configured via the repository.
 * It is here just for convenience.
 */
class RxPipe extends Pipe {
  observable;
  subscription;
  latestValue;
  latestReturnedValue;

  constructor() {
    this.observable = null;
    this.latestValue = null;
  }

  supports(obj) {
    return this.observable === obj;
  }

  onDestroy() {
    this.subscription.dispose();
  }

  transform(value) {
    // we need to change the API to move it into the constructor
    if (! this.subscription) {
      this.observable = value;
      this.subscription = value.subscribe(
        (x) => {this.latestValue = x;},
        (e) => {throw e;} // zones will create a long stack trace
      );
    }

    if (this.latestReturnedValue !== this.latestValue) {
      this.latestReturnedValue = this.latestValue;
      return this.latestValue;

    } else {
      return NO_CHANGE;
    }
  }
}

export var defaultPipes = {
  "iterableDiff" : [
    new ArrayChangesFactory(),
    new NullPipeFactory()
  ],
  "rx":  [
    {
      supports: (obj) => obj.subscribe !== undefined,
      create: () => new RxPipe()
    }
  ]
};

export class DynamicChangeDetection extends ChangeDetection {
  registry:PipeRegistry;

  constructor(registry:PipeRegistry) {
    super();
    this.registry = registry;
  }

  createProtoChangeDetector(name:string):ProtoChangeDetector{
    return new DynamicProtoChangeDetector(this.registry);
  }
}

export class JitChangeDetection extends ChangeDetection {
  registry:PipeRegistry;

  constructor(registry:PipeRegistry) {
    super();
    this.registry = registry;
  }

  createProtoChangeDetector(name:string):ProtoChangeDetector{
    return new JitProtoChangeDetector(this.registry);
  }
}

var _registry = new PipeRegistry(defaultPipes);

export var dynamicChangeDetection = new DynamicChangeDetection(_registry);
export var jitChangeDetection = new JitChangeDetection(_registry);