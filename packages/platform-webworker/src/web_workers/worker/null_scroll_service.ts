/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ScrollService} from '@angular/common';

/**
 * @whatItDoes Provides an empty implementation of the scroll service.
 * @experimental
 */
export class NullScrollService extends ScrollService {
  /**
   * @whatItDoes empty implementation
   */
  setOffset(offset: number|(() => number)): void {}

  /**
   * @whatItDoes empty implementation
   */
  currentScrollPosition(): [number, number] { return [0, 0]; }

  /**
   * @whatItDoes empty implementation
   */
  scrollToPosition(position: [number, number]): void {}

  /**
   * @whatItDoes empty implementation
   */
  scrollToAnchor(anchor: string): void {}

  /**
   * @whatItDoes empty implementation
   */
  disableAutomaticScrollRestoration() {}
}
