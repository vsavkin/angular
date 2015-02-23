import {bootstrap, Component, Decorator, Template, NgElement, PipeRegistry} from 'angular2/angular2';
import {Foreach} from 'angular2/directives';

import {LifeCycle} from 'angular2/src/core/life_cycle/life_cycle';
import {bind} from 'angular2/di';

@Component({
  selector: 'hello-app'
})
@Template({
  inline: `<timers-cmp [timers]="timers">`, //Observable<List<Observable>>
  directives: [TimersCmp]
})
class HelloCmp {
  timers:any;

  constructor(lc:LifeCycle) {
    var x = [
      Rx.Observable.timer(100, 1000).timeInterval().map((v) => v.value),
      Rx.Observable.timer(100, 2000).timeInterval().map((v) => v.value),
      Rx.Observable.timer(100, 3000).timeInterval().map((v) => v.value)
    ];
    this.timers = new Rx.BehaviorSubject(x);

    // this is here because we need to patch Zones.js to support Rx
    Rx.Observable.timer(100, 1000).timeInterval().map((v) => v.value).subscribe(
      (x) => {
        lc.tick();
      }
    );
  }
}


/**
 * Note that I am using the rx pipe in the binding position.
 * I could have changed it and instead "dereference" it in the bind as follows `timers: 'timers | rx'`
 */
@Component({
  selector: 'timers-cmp',
  bind: {
    timers: 'timers'
  }
})
@Template({
  inline: `
    <timer-cmp *foreach="var t in timers|rx" [timer]="t"></timer-cmp>
  `,
  directives: [TimerCmp, Foreach]
})
class TimersCmp {
  timers:any; //Observable<List<Observable>>
}

/**
 * Note that I am using the rx pipe in the bind config.
 * I could have changed it and instead "dereference" it in the binding as follows {{timer | rx}}
 */
@Component({
  selector: 'timer-cmp',
  bind: {
    timer: 'timer | rx'
  }
})
@Template({
  inline: `<div>Time {{timer}}</div>`,
  directives: []
})
class TimerCmp {
  timer:number;
}

export function main() {
  bootstrap(HelloCmp);
}