/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ScrollService} from '@angular/common';

import {DomAdapter, getDOM} from '../../dom/dom_adapter';

/**
 * @whatItDoes Manages the scroll position.
 * @experimental
 */
export class BrowserScrollService extends ScrollService {
  private dom: DomAdapter = getDOM();
  private offset: () => [number, number] = () => [0, 0];

  /**
   * @whatItDoes Configures the top offset used when scrolling to an anchor.
   *
   * * When given a number, the router will always use the number.
   * * When given a function, the router will invoke the function every time it restores scroll
   * position.
   */
  setOffset(offset: [number, number]|(() => [number, number])): void {
    if (Array.isArray(offset)) {
      this.offset = () => offset;
    } else {
      this.offset = offset;
    }
  }

  /**
   * @whatItDoes Returns the current scroll position.
   */
  getScrollPosition(): [number, number] {
    if (this.supportScrollRestoration()) {
      return [this.dom.getWindow().scrollX, this.dom.getWindow().scrollY];
    } else {
      return [0, 0];
    }
  }

  /**
   * @whatItDoes Sets the scroll position.
   */
  scrollToPosition(position: [number, number]): void {
    if (this.supportScrollRestoration()) {
      this.dom.getWindow().scrollTo(position[0], position[1]);
    }
  }

  /**
   * @whatItDoes Scrolls to the provided anchor.
   */
  scrollToAnchor(anchor: string): void {
    if (this.supportScrollRestoration()) {
      const doc = this.dom.getDefaultDocument();
      const elSelectedById = this.dom.querySelector(doc.body, `#${anchor}`);
      if (elSelectedById) {
        this.scrollToElement(elSelectedById);
        return;
      }

      const elSelectedByName = this.dom.querySelector(doc.body, `[name='${anchor}']`);
      if (elSelectedByName) {
        this.scrollToElement(elSelectedByName);
        return;
      }
    }
  }

  /**
   * @whatItDoes Disables automatic scroll restoration provided by the browser.
   */
  setHistoryScrollRestoration(scrollRestoration: 'auto'|'manual'): void {
    if (this.supportScrollRestoration()) {
      const history = this.dom.getHistory();
      if (history && history.scrollRestoration) {
        history.scrollRestoration = scrollRestoration;
      }
    }
  }

  private scrollToElement(el: any): void {
    const rect = el.getBoundingClientRect();
    const left = rect.left + this.dom.getWindow().pageXOffset;
    const top = rect.top + this.dom.getWindow().pageYOffset;
    const offset = this.offset();
    this.dom.getWindow().scrollTo(left - offset[0], top - offset[1]);
  }

  /**
   * We only support scroll restoration when we can get a hold of window.
   * This means that we do not support this behavior when running in a web worker.
   *
   * Lifting this restriction right now would require more changes in the dom adapter.
   * Since webworkers aren't widely used, we will lift it once RouterScroller is
   * battle-tested.
   */
  private supportScrollRestoration(): boolean {
    try {
      return !!this.dom.getWindow() && !!this.dom.getWindow().scrollTo;
    } catch (e) {
      return false;
    }
  }
}
