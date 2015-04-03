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


class DynamicComponentLoader {
  compiler:Compiler;
  eventManager:EventManager;

  constructor(compiler:Compiler, eventManager:EventManager) {
    this.compiler = compiler;
    this.eventManager = eventManager;
  }

  load(type:Type, injector:Injector, hostElementInjector, selfElementInjector) {
    return this.compiler.compile(type).then((componentProtoView) => {
      if (isBlank(selfElementInjector)) {
        var protoElementInjector = new ProtoElementInjector(null, 0, [type], true);
        var elementInjector = protoElementInjector.instantiate(null, hostElementInjector);
        elementInjector.instantiateDirectives(null, injector, null);  // we need to construct PreBuiltObjects

        var componentView = componentProtoView.instantiate(elementInjector, this.eventManager);
        componentView.hydrate(injector, hostElementInjector, elementInjector.getComponent(), null);

        return new DirectiveRef(elementInjector, Key.get(type));
      }
    });
  }
}


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

    // TODO:
    // - How much of this can be shared with bootstrap?
    // - Can we take advantage of ViewContainers to make this simpler?
    // - How does this change when the render layer is in?
    // - How does the core use DirecitveRef without exposing too much to the user?


    var metadata = this.directiveMetadataReader.read(type);
    return this.compiler.compile(type).then((componentProtoView) => {

      // Create a dummy View to hold the Component we're going to add.
      var dummyViewElement = DOM.createElement('div');
      DOM.addClass(dummyViewElement, 'dummy-overlay-view-element');
      DOM.addClass(dummyViewElement, 'ng-binding');

      var containingProtoView = new ProtoView(
          dummyViewElement,
          this.changeDetection.createProtoChangeDetector('overlay-change-detector'),
          this.shadowDomStrategy);
      containingProtoView.instantiateInPlace = true;

      var binder = containingProtoView.bindElement(
          null, 0, new ProtoElementInjector(null, 0, [type], true));
      binder.componentDirective = metadata;

      // Add the protoview for the component we want to create to the dummy view.
      binder.nestedProtoView = componentProtoView;

      console.log("INSTANTIATING CONTAINER VIEW");
      var containingView = containingProtoView.instantiate(null, this.eventManager);

      console.log("HYDRATING");
      containingView.hydrate(injector, null, null, new Object(), null);

      ref.elementInjector.getNgElement().domElement.parentNode.appendChild(
          containingView.elementInjectors[0].getNgElement().domElement);

      // we should also add a view here
      this.appView.changeDetector.addChild(containingView.changeDetector);

      containingView.changeDetector.detectChanges();


      return new DirectiveRef(containingView.elementInjectors[0], Key.get(type));
    });
  }
}

// Add a view container to the root view
// add our overlay view to the view container
// display the overlay
