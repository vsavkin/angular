/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {fakeAsync, tick} from '@angular/core/testing';
import {DefaultUrlSerializer, NavigationEnd, NavigationStart, RouterEvent} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {filter, switchMap} from 'rxjs/operators';

import {AnchorScrolling, RouterScroller, ScrollEvent, ScrollPositionRestoration} from '../src/router_scroller';

describe('RouterScroller', () => {
  describe('scroll to top', () => {
    it('should scroll to the top', () => {
      const {events, scrollService} =
          createRouterScroller({scrollPositionRestoration: 'top', anchorScrolling: 'disabled'});

      events.next(new NavigationStart(1, '/a'));
      events.next(new NavigationEnd(1, '/a', '/a'));
      expect(scrollService.scrollToPosition).toHaveBeenCalledWith([0, 0]);

      events.next(new NavigationStart(2, '/a'));
      events.next(new NavigationEnd(2, '/b', '/b'));
      expect(scrollService.scrollToPosition).toHaveBeenCalledWith([0, 0]);

      events.next(new NavigationStart(3, '/a', 'popstate'));
      events.next(new NavigationEnd(3, '/a', '/a'));
      expect(scrollService.scrollToPosition).toHaveBeenCalledWith([0, 0]);
    });
  });

  describe('scroll to the stored position', () => {
    it('should scroll to the stored position on popstate', () => {
      const {events, scrollService} =
          createRouterScroller({scrollPositionRestoration: 'enabled', anchorScrolling: 'disabled'});

      events.next(new NavigationStart(1, '/a'));
      events.next(new NavigationEnd(1, '/a', '/a'));
      setScroll(scrollService, 10, 100);
      expect(scrollService.scrollToPosition).toHaveBeenCalledWith([0, 0]);

      events.next(new NavigationStart(2, '/b'));
      events.next(new NavigationEnd(2, '/b', '/b'));
      setScroll(scrollService, 20, 200);
      expect(scrollService.scrollToPosition).toHaveBeenCalledWith([0, 0]);

      events.next(new NavigationStart(3, '/a', 'popstate', {navigationId: 1}));
      events.next(new NavigationEnd(3, '/a', '/a'));
      expect(scrollService.scrollToPosition).toHaveBeenCalledWith([10, 100]);
    });
  });

  describe('anchor scrolling', () => {
    it('should work (scrollPositionRestoration is disabled)', () => {
      const {events, scrollService} =
          createRouterScroller({scrollPositionRestoration: 'disabled', anchorScrolling: 'enabled'});
      events.next(new NavigationStart(1, '/a#anchor'));
      events.next(new NavigationEnd(1, '/a#anchor', '/a#anchor'));
      expect(scrollService.scrollToAnchor).toHaveBeenCalledWith('anchor');

      events.next(new NavigationStart(2, '/a#anchor2'));
      events.next(new NavigationEnd(2, '/a#anchor2', '/a#anchor2'));
      expect(scrollService.scrollToAnchor).toHaveBeenCalledWith('anchor2');
      scrollService.scrollToAnchor.calls.reset();

      // we never scroll to anchor when navigating back
      events.next(new NavigationStart(3, '/a#anchor', 'popstate'));
      events.next(new NavigationEnd(3, '/a#anchor', '/a#anchor'));
      expect(scrollService.scrollToAnchor).not.toHaveBeenCalled();
      expect(scrollService.scrollToPosition).not.toHaveBeenCalled();
    });

    it('should work (scrollPositionRestoration is enabled)', () => {
      const {events, scrollService} =
          createRouterScroller({scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled'});
      events.next(new NavigationStart(1, '/a#anchor'));
      events.next(new NavigationEnd(1, '/a#anchor', '/a#anchor'));
      expect(scrollService.scrollToAnchor).toHaveBeenCalledWith('anchor');

      events.next(new NavigationStart(2, '/a#anchor2'));
      events.next(new NavigationEnd(2, '/a#anchor2', '/a#anchor2'));
      expect(scrollService.scrollToAnchor).toHaveBeenCalledWith('anchor2');
      scrollService.scrollToAnchor.calls.reset();

      // we never scroll to anchor when navigating back
      events.next(new NavigationStart(3, '/a#anchor', 'popstate', {navigationId: 1}));
      events.next(new NavigationEnd(3, '/a#anchor', '/a#anchor'));
      expect(scrollService.scrollToAnchor).not.toHaveBeenCalled();
      expect(scrollService.scrollToPosition).toHaveBeenCalledWith([0, 0]);
    });
  });

  describe('extending a scroll service', () => {
    it('work', fakeAsync(() => {
         const {events, scrollService, scroller} = createRouterScroller(
             {scrollPositionRestoration: 'disabled', anchorScrolling: 'disabled'});

         scroller.scrollEvents
             .pipe(filter(e => !!e.position), switchMap(p => {
                     // can be any delay (e.g., we can wait for NgRx store to emit an event)
                     const r = new Subject<any>();
                     setTimeout(() => {
                       r.next(p);
                       r.complete();
                     }, 1000);
                     return r;
                   }))
             .subscribe((e: ScrollEvent) => { scrollService.scrollToPosition(e.position); });

         events.next(new NavigationStart(1, '/a'));
         events.next(new NavigationEnd(1, '/a', '/a'));
         setScroll(scrollService, 10, 100);

         events.next(new NavigationStart(2, '/b'));
         events.next(new NavigationEnd(2, '/b', '/b'));
         setScroll(scrollService, 20, 200);

         events.next(new NavigationStart(3, '/c'));
         events.next(new NavigationEnd(3, '/c', '/c'));
         setScroll(scrollService, 30, 300);

         events.next(new NavigationStart(4, '/a', 'popstate', {navigationId: 1}));
         events.next(new NavigationEnd(4, '/a', '/a'));

         tick(500);
         expect(scrollService.scrollToPosition).not.toHaveBeenCalled();

         events.next(new NavigationStart(5, '/a', 'popstate', {navigationId: 1}));
         events.next(new NavigationEnd(5, '/a', '/a'));

         tick(5000);
         expect(scrollService.scrollToPosition).toHaveBeenCalledWith([10, 100]);
       }));
  });


  function createRouterScroller({scrollPositionRestoration, anchorScrolling}: {
    scrollPositionRestoration: ScrollPositionRestoration,
    anchorScrolling: AnchorScrolling
  }) {
    const events = new Subject<RouterEvent>();
    const router = <any>{events, parseUrl: (url: any) => new DefaultUrlSerializer().parse(url)};

    const scrollService = jasmine.createSpyObj('scrollService', [
      'currentScrollPosition', 'scrollToPosition', 'scrollToAnchor',
      'disableAutomaticScrollRestoration'
    ]);
    setScroll(scrollService, 0, 0);

    const scroller =
        new RouterScroller(router, scrollService, {scrollPositionRestoration, anchorScrolling});
    scroller.init();
    return {events, scrollService, scroller};
  }

  function setScroll(scrollService: any, x: number, y: number) {
    scrollService.currentScrollPosition.and.returnValue([x, y]);
  }
});
