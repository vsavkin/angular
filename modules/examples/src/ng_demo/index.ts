import {bootstrap} from 'angular2/bootstrap';
import {ElementRef, Component, Directive, View, Injectable, NgModel, CORE_DIRECTIVES,FORM_DIRECTIVES, Input, ViewChild, QueryList, ContentChildren} from 'angular2/core';
import {Renderer} from 'angular2/render';

import * as ss from '@reactivex/rxjs/dist/cjs/Rx';
console.log(ss)

export function main() {
  bootstrap(App);
}

@Component({
  selector: 'talk'
})
@View({
  template: `
    {{}}
    <a href="/talks/{{id}}">
      <ng-content select="short-title"></ng-content> by {{speaker}}
    </a>
    <p><ng-content select="description"></ng-content></p>
  `
})
class Talk {
  @Input() id:string;
  @Input() speaker:string;
}

@Component({selector: 'conf-talks'})
@View({
  directives: [FORM_DIRECTIVES],
  template: `
    Title filter: <input #title="form" ng-model required></input>

    <ul>
      <ng-content></ng-content>
    </ul>
  `
})
class ConfTalks {
  @ContentChildren(Talk) talks;
  @ViewChild("title") title;

  afterViewInit() {
    var titleChanges = this.title.control.valueChanges._subject;
    titleChanges.subscribe(s => {
      console.log("aaa", s)
    });

    // var subscription = titleChanges.
    //   filter(s => this.title.valid).
    //   throttle(500).
    //   distinctUntilChanged().
    //   subscribe(value => {
    //     console.log("value", value);
    //   });

    console.log(titleChanges);
  }
}


@Component({selector:'ng-demo'})
@View({
  directives: [ConfTalks, Talk, CORE_DIRECTIVES],
  template: `
    <conf-talks>
      <talk id="1" speaker="Igor Minar">
        <short-title>Meditation</short-title>
        <description>Meditation <b>Description</b></description>
      </talk>

      <talk id="2" speaker="Jeff Cross">
        <short-title>Data</short-title>
        <description>Super Http</description>
      </talk>
    </conf-talks>
  `
})
class App {
}

// notes
// change message No View annotation found on component Talk


