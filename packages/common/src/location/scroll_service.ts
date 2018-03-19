/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @whatItDoes Manages the scroll position.
 * @experimental
 */
export abstract class ScrollService {
  /**
   * @whatItDoes Configures the top offset used when scrolling to an anchor.
   *
   * * When given a number, the router will always use the number.
   * * When given a function, the router will invoke the function every time it restores scroll
   * position.
   */
  abstract setOffset(offset: number|(() => number)): void;

  /**
   * @whatItDoes Returns the current scroll position.
   */
  abstract currentScrollPosition(): [number, number];

  /**
   * @whatItDoes Sets the scroll position.
   */
  abstract scrollToPosition(position: [number, number]): void;

  /**
   * @whatItDoes Scrolls to the provided anchor.
   */
  abstract scrollToAnchor(anchor: string): void;

  /**
   * @whatItDoes Disables automatic scroll restoration provided by the browser.
   */
  abstract disableAutomaticScrollRestoration(): void;
}
