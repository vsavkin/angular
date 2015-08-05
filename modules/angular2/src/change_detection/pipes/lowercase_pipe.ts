import {isString, StringWrapper, CONST, isBlank} from 'angular2/src/facade/lang';
import {Pipe, BasePipe, PipeFactory} from './pipe';
import {ChangeDetectorRef} from '../change_detector_ref';

/**
 * Implements lowercase transforms to text.
 *
 * # Example
 *
 * In this example we transform the user text lowercase.
 *
 *  ```
 * @Component({
 *   selector: "username-cmp"
 * })
 * @View({
 *   template: "Username: {{ user | lowercase }}"
 * })
 * class Username {
 *   user:string;
 * }
 *
 * ```
 */
@CONST()
export class LowerCasePipe extends BasePipe implements PipeFactory {
  supports(str: any): boolean { return isString(str); }

  transform(value: string, args: List<any> = null): string {
    if (isBlank(value)) return value;
    return StringWrapper.toLowerCase(value);
  }

  create(cdRef: ChangeDetectorRef): Pipe { return this; }
}
