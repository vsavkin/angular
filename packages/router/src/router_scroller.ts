/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ScrollService} from '@angular/common';
import {OnDestroy} from '@angular/core';
import {Observable, Subject, Unsubscribable} from 'rxjs';

import {NavigationEnd, NavigationStart} from './events';
import {Router} from './router';

/**
 * @whatItDoes Represents a scrolling event.
 *
 * @experimental
 */
export interface ScrollEvent {
  /** @docsNotRequired */
  readonly routerEvent: NavigationEnd;

  /** @docsNotRequired */
  readonly position: [number, number]|null;

  /** @docsNotRequired */
  readonly anchor: string|null;
}

/**
 * @whatItDoes Manages the scroll position by the router.
 *
 * This is the default scroll position manager for the Angular router. It manages anchor scrolling
 * and scroll position restoration.
 *
 * ## Anchor Scrolling
 *
 * * When enabled, the manager will scroll the anchor element into the view. Anchor scrolling
 * does not happen on 'popstate'. Instead, we restore the position that we stored or scroll to the
 * top.
 * * When disabled, anchor scrolling will do nothing.
 *
 * ## Scroll Position Restoration
 *
 * * When enabled, the manager will store store scroll positions when navigating forward, and will
 * restore the stored positions whe navigating back (popstate). When navigating forward,
 * the scroll position will be set to [0, 0], or to the anchor if one is provided.
 * * When set to 'top', the manager will set the scroll position to [0,0].
 *
 * ## Extending RouterScroller
 *
 * RouterScroller provides the scrollEvents observable, which you can use to implement you
 * custom scrolling behavior.
 *
 * ```typescript
 * class AppModule {
 *  constructor(r: RouterScroller, store: Store<AppState>) {
 *    m.scrollEvents.pipe(switchMap(e => {
 *      return store.pipe(first(), timeout(200), map(() => e));
 *    }).subscribe(e => {
 *      if (e.position) {
 *        r.scrollService.scrollToPosition(e.position);
 *      } else if (e.anchor) {
 *        r.scrollService.scrollToAnchor(e.anchor);
 *      } else {
 *        r.scrollService.scrollToPosition([0, 0]);
 *      }
 *    });
 *  }
 * }
 * ```
 *
 * You can also implement component-specific scrolling like this:
 *
 * ```typescript
 * class ListComponent {
 *   list: any[];
 *   constructor(m: RouterScroller, fetcher: ListFetcher) {
 *     listFetcher.fetch().pipe(withLatestFrom(m.scrollEvents)).subscribe(([list, e]) => {
 *       this.list = list;
 *       if (e.position) {
 *         r.scrollService.scrollToPosition(e.position);
 *       } else {
 *         r.scrollService.scrollToPosition([0, 0]);
 *       }
 *     });
 *   }
 * }
 * ```
 *
 * @experimental
 */
export class RouterScroller implements OnDestroy {
  /** @docsNotRequired */
  public scrollEvents: Observable<ScrollEvent> = new Subject();

  private routerEventsSubscription: Unsubscribable;
  private scrollEventsSubscription: Unsubscribable;

  private lastId = 0;
  private lastSource: 'imperative'|'popstate'|'hashchange'|undefined = 'imperative';
  private restoredId = 0;
  private store: {[key: string]: [number, number]} = {};

  constructor(
      private router: Router, /** @docsNotRequired */ public readonly scrollService: ScrollService,
      private options: {
        scrollPositionRestoration?: 'disabled' | 'enabled' | 'top',
        anchorScrolling?: 'disabled'|'enabled'
      } = {}) {}

  init(): void {
    // we want to disable the automatic scrolling because having two places
    // responsible for scrolling results race conditions, especially given
    // that browser don't implement this behavior consistently
    if (this.options.scrollPositionRestoration !== 'disabled') {
      this.scrollService.setHistoryScrollRestoration('manual');
    }
    this.routerEventsSubscription = this.createScrollEvents();
    this.scrollEventsSubscription = this.consumeScrollEvents();
  }

  private createScrollEvents() {
    return this.router.events.subscribe(e => {
      if (e instanceof NavigationStart) {
        // store the scroll position of the current stable navigations.
        this.store[this.lastId] = this.scrollService.getScrollPosition();
        this.lastSource = e.navigationTrigger;
        this.restoredId = e.restoredState ? e.restoredState.navigationId : 0;
      } else if (e instanceof NavigationEnd) {
        this.lastId = e.id;
        this.scheduleScrollEvent(e, this.router.parseUrl(e.urlAfterRedirects).fragment);
      }
    });
  }

  private consumeScrollEvents() {
    return this.scrollEvents.subscribe(e => {
      // a popstate event. The pop state event will always ignore anchor scrolling.
      if (e.position) {
        if (this.options.scrollPositionRestoration === 'top') {
          this.scrollService.scrollToPosition([0, 0]);
        } else if (this.options.scrollPositionRestoration === 'enabled') {
          this.scrollService.scrollToPosition(e.position);
        }
        // imperative navigation "forward"
      } else {
        if (e.anchor && this.options.anchorScrolling === 'enabled') {
          this.scrollService.scrollToAnchor(e.anchor);
        } else if (this.options.scrollPositionRestoration !== 'disabled') {
          this.scrollService.scrollToPosition([0, 0]);
        }
      }
    });
  }

  private scheduleScrollEvent(routerEvent: NavigationEnd, anchor: string|null): void {
    (this.scrollEvents as Subject<ScrollEvent>).next({
      position: this.lastSource === 'popstate' ? this.store[this.restoredId] : null,
      routerEvent,
      anchor
    });
  }

  ngOnDestroy() {
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
    if (this.scrollEventsSubscription) {
      this.scrollEventsSubscription.unsubscribe();
    }
  }
}
