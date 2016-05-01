import { NgClass } from './ng_class';
import { NgFor } from './ng_for';
import { NgIf } from './ng_if';
import { NgTemplateOutlet } from './ng_template_outlet';
import { NgStyle } from './ng_style';
import { NgSwitch, NgSwitchWhen, NgSwitchDefault } from './ng_switch';
import { NgPlural, NgPluralCase } from './ng_plural';
/**
 * A collection of Angular core directives that are likely to be used in each and every Angular
 * application.
 *
 * This collection can be used to quickly enumerate all the built-in directives in the `directives`
 * property of the `@Component` annotation.
 *
 * ### Example ([live demo](http://plnkr.co/edit/yakGwpCdUkg0qfzX5m8g?p=preview))
 *
 * Instead of writing:
 *
 * ```typescript
 * import {NgClass, NgIf, NgFor, NgSwitch, NgSwitchWhen, NgSwitchDefault} from 'angular2/common';
 * import {OtherDirective} from './myDirectives';
 *
 * @Component({
 *   selector: 'my-component',
 *   templateUrl: 'myComponent.html',
 *   directives: [NgClass, NgIf, NgFor, NgSwitch, NgSwitchWhen, NgSwitchDefault, OtherDirective]
 * })
 * export class MyComponent {
 *   ...
 * }
 * ```
 * one could import all the core directives at once:
 *
 * ```typescript
 * import {CORE_DIRECTIVES} from 'angular2/common';
 * import {OtherDirective} from './myDirectives';
 *
 * @Component({
 *   selector: 'my-component',
 *   templateUrl: 'myComponent.html',
 *   directives: [CORE_DIRECTIVES, OtherDirective]
 * })
 * export class MyComponent {
 *   ...
 * }
 * ```
 */
export const CORE_DIRECTIVES = [
    NgClass,
    NgFor,
    NgIf,
    NgTemplateOutlet,
    NgStyle,
    NgSwitch,
    NgSwitchWhen,
    NgSwitchDefault,
    NgPlural,
    NgPluralCase
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZV9kaXJlY3RpdmVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1ndE03UWhFbi50bXAvYW5ndWxhcjIvc3JjL2NvbW1vbi9kaXJlY3RpdmVzL2NvcmVfZGlyZWN0aXZlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FDTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFlBQVk7T0FDM0IsRUFBQyxLQUFLLEVBQUMsTUFBTSxVQUFVO09BQ3ZCLEVBQUMsSUFBSSxFQUFDLE1BQU0sU0FBUztPQUNyQixFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCO09BQzlDLEVBQUMsT0FBTyxFQUFDLE1BQU0sWUFBWTtPQUMzQixFQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFDLE1BQU0sYUFBYTtPQUM1RCxFQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUMsTUFBTSxhQUFhO0FBRWxEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Q0c7QUFDSCxPQUFPLE1BQU0sZUFBZSxHQUE2QjtJQUN2RCxPQUFPO0lBQ1AsS0FBSztJQUNMLElBQUk7SUFDSixnQkFBZ0I7SUFDaEIsT0FBTztJQUNQLFFBQVE7SUFDUixZQUFZO0lBQ1osZUFBZTtJQUNmLFFBQVE7SUFDUixZQUFZO0NBQ2IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7VHlwZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7TmdDbGFzc30gZnJvbSAnLi9uZ19jbGFzcyc7XG5pbXBvcnQge05nRm9yfSBmcm9tICcuL25nX2Zvcic7XG5pbXBvcnQge05nSWZ9IGZyb20gJy4vbmdfaWYnO1xuaW1wb3J0IHtOZ1RlbXBsYXRlT3V0bGV0fSBmcm9tICcuL25nX3RlbXBsYXRlX291dGxldCc7XG5pbXBvcnQge05nU3R5bGV9IGZyb20gJy4vbmdfc3R5bGUnO1xuaW1wb3J0IHtOZ1N3aXRjaCwgTmdTd2l0Y2hXaGVuLCBOZ1N3aXRjaERlZmF1bHR9IGZyb20gJy4vbmdfc3dpdGNoJztcbmltcG9ydCB7TmdQbHVyYWwsIE5nUGx1cmFsQ2FzZX0gZnJvbSAnLi9uZ19wbHVyYWwnO1xuXG4vKipcbiAqIEEgY29sbGVjdGlvbiBvZiBBbmd1bGFyIGNvcmUgZGlyZWN0aXZlcyB0aGF0IGFyZSBsaWtlbHkgdG8gYmUgdXNlZCBpbiBlYWNoIGFuZCBldmVyeSBBbmd1bGFyXG4gKiBhcHBsaWNhdGlvbi5cbiAqXG4gKiBUaGlzIGNvbGxlY3Rpb24gY2FuIGJlIHVzZWQgdG8gcXVpY2tseSBlbnVtZXJhdGUgYWxsIHRoZSBidWlsdC1pbiBkaXJlY3RpdmVzIGluIHRoZSBgZGlyZWN0aXZlc2BcbiAqIHByb3BlcnR5IG9mIHRoZSBgQENvbXBvbmVudGAgYW5ub3RhdGlvbi5cbiAqXG4gKiAjIyMgRXhhbXBsZSAoW2xpdmUgZGVtb10oaHR0cDovL3BsbmtyLmNvL2VkaXQveWFrR3dwQ2RVa2cwcWZ6WDVtOGc/cD1wcmV2aWV3KSlcbiAqXG4gKiBJbnN0ZWFkIG9mIHdyaXRpbmc6XG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogaW1wb3J0IHtOZ0NsYXNzLCBOZ0lmLCBOZ0ZvciwgTmdTd2l0Y2gsIE5nU3dpdGNoV2hlbiwgTmdTd2l0Y2hEZWZhdWx0fSBmcm9tICdhbmd1bGFyMi9jb21tb24nO1xuICogaW1wb3J0IHtPdGhlckRpcmVjdGl2ZX0gZnJvbSAnLi9teURpcmVjdGl2ZXMnO1xuICpcbiAqIEBDb21wb25lbnQoe1xuICogICBzZWxlY3RvcjogJ215LWNvbXBvbmVudCcsXG4gKiAgIHRlbXBsYXRlVXJsOiAnbXlDb21wb25lbnQuaHRtbCcsXG4gKiAgIGRpcmVjdGl2ZXM6IFtOZ0NsYXNzLCBOZ0lmLCBOZ0ZvciwgTmdTd2l0Y2gsIE5nU3dpdGNoV2hlbiwgTmdTd2l0Y2hEZWZhdWx0LCBPdGhlckRpcmVjdGl2ZV1cbiAqIH0pXG4gKiBleHBvcnQgY2xhc3MgTXlDb21wb25lbnQge1xuICogICAuLi5cbiAqIH1cbiAqIGBgYFxuICogb25lIGNvdWxkIGltcG9ydCBhbGwgdGhlIGNvcmUgZGlyZWN0aXZlcyBhdCBvbmNlOlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCB7Q09SRV9ESVJFQ1RJVkVTfSBmcm9tICdhbmd1bGFyMi9jb21tb24nO1xuICogaW1wb3J0IHtPdGhlckRpcmVjdGl2ZX0gZnJvbSAnLi9teURpcmVjdGl2ZXMnO1xuICpcbiAqIEBDb21wb25lbnQoe1xuICogICBzZWxlY3RvcjogJ215LWNvbXBvbmVudCcsXG4gKiAgIHRlbXBsYXRlVXJsOiAnbXlDb21wb25lbnQuaHRtbCcsXG4gKiAgIGRpcmVjdGl2ZXM6IFtDT1JFX0RJUkVDVElWRVMsIE90aGVyRGlyZWN0aXZlXVxuICogfSlcbiAqIGV4cG9ydCBjbGFzcyBNeUNvbXBvbmVudCB7XG4gKiAgIC4uLlxuICogfVxuICogYGBgXG4gKi9cbmV4cG9ydCBjb25zdCBDT1JFX0RJUkVDVElWRVM6IFR5cGVbXSA9IC8qQHRzMmRhcnRfY29uc3QqL1tcbiAgTmdDbGFzcyxcbiAgTmdGb3IsXG4gIE5nSWYsXG4gIE5nVGVtcGxhdGVPdXRsZXQsXG4gIE5nU3R5bGUsXG4gIE5nU3dpdGNoLFxuICBOZ1N3aXRjaFdoZW4sXG4gIE5nU3dpdGNoRGVmYXVsdCxcbiAgTmdQbHVyYWwsXG4gIE5nUGx1cmFsQ2FzZVxuXTtcbiJdfQ==