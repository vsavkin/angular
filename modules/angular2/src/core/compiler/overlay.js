import {Compiler} from './compiler';
import {ShadowDomStrategy} from './shadow_dom_strategy';
import {EventManager} from 'angular2/src/core/events/event_manager';
import {DirectiveMetadataReader} from 'angular2/src/core/compiler/directive_metadata_reader';
import {Component} from 'angular2/src/core/annotations/annotations';
import {PrivateComponentLocation} from './private_component_location';
import {Type, stringify, BaseException} from 'angular2/src/facade/lang';
import {View, ProtoView} from 'angular2/src/core/compiler/view';
import {ProtoElementInjector} from 'angular2/src/core/compiler/element_injector';
import {Injector} from 'angular2/di';
import {appViewToken} from 'angular2/src/core/application';
import {ChangeDetection} from 'angular2/change_detection';

export class Overlay {
  compiler:Compiler;
  shadowDomStrategy:ShadowDomStrategy;
  eventManager:EventManager;
  directiveMetadataReader:DirectiveMetadataReader;
  appView:View;
  changeDetection:ChangeDetection;

  constructor(compiler:Compiler, shadowDomStrategy:ShadowDomStrategy,
              eventManager:EventManager, directiveMetadataReader:DirectiveMetadataReader,
              injector:Injector, changeDetection:ChangeDetection) {
    this.compiler = compiler;
    this.shadowDomStrategy = shadowDomStrategy;
    this.eventManager = eventManager;
    this.directiveMetadataReader = directiveMetadataReader;
    this.changeDetection = changeDetection;
    this.appView = injector.get(appViewToken);

    //ListWrapper.push(this.appView.viewContainers,
  }

  open(type, injector, ref) {
    var metadata = this.directiveMetadataReader.read(type);
    return this.compiler.compile(type).then((componentProtoView) => {

      var containingProtoView = new ProtoView(null,
        changeDetection.createProtoChangeDetector("dummy"),
        this.shadowDomStrategy);

      var binder = containingProtoView.bindElement(null, 0,
        new ProtoElementInjector(null, 0, [type], true));

      binder.componentDirective = metadata;
      binder.nestedProtoView = componentProtoView;

      //var containingView = containingProtoView.instantiate(null, this.eventManager);
      //containingView.hydrate(injector, null, null, new Object(), null);


      //location.createComponent(
      //  type, annotation,
      //  componentProtoView,
      //  this.eventManager,
      //  this.shadowDomStrategy);
    });
  }
}

// Add a view container to the root view
// add our overlay view to the view container
// display the overlay