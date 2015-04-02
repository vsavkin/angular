import {Compiler} from './compiler';
import {ShadowDomStrategy} from './shadow_dom_strategy';
import {EventManager} from 'angular2/src/core/events/event_manager';
import {DirectiveMetadataReader} from 'angular2/src/core/compiler/directive_metadata_reader';
import {Component} from 'angular2/src/core/annotations/annotations';
import {PrivateComponentLocation} from './private_component_location';
import {Type, stringify, BaseException} from 'angular2/src/facade/lang';
import {View, ProtoView} from 'angular2/src/core/compiler/view';
import {ProtoElementInjector, DirectiveRef} from 'angular2/src/core/compiler/element_injector';
import {Injector, Key} from 'angular2/di';
import {appViewToken} from 'angular2/src/core/application';
import {ChangeDetection} from 'angular2/change_detection';
import {DOM} from 'angular2/src/dom/dom_adapter';

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

      var templateElement = DOM.createElement('div');
      templateElement.id = 'dummy-view-element';
      DOM.addClass(templateElement, 'ng-binding');

      var containingProtoView = new ProtoView(templateElement,
          this.changeDetection.createProtoChangeDetector("dummy"),
          this.shadowDomStrategy);

      var binder = containingProtoView.bindElement(null, 0,
          new ProtoElementInjector(null, 0, [type], true));
      binder.componentDirective = metadata;

      binder.componentDirective = metadata;

      binder.nestedProtoView = componentProtoView;

      containingProtoView.instantiateInPlace = true;

      console.log("INSTANTIATING CONTAINER VIEW");
      var containingView = containingProtoView.instantiate(null, this.eventManager);

      console.log("HYDRATING");
      containingView.hydrate(injector, null, null, new Object(), null);

      var componentView = containingView.componentChildViews[0];

      ref.elementInjector.getNgElement().domElement.parentNode.appendChild(
          containingView.elementInjectors[0].getNgElement().domElement);

      containingView.changeDetector.detectChanges();


      return new DirectiveRef(containingView.elementInjectors[0], Key.get(type));

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
