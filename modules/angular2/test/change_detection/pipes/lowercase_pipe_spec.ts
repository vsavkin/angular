import {ddescribe, describe, it, iit, xit, expect, beforeEach, afterEach} from 'angular2/test_lib';

import {LowerCasePipe} from 'angular2/src/change_detection/pipes/lowercase_pipe';

export function main() {
  describe("LowerCasePipe", () => {
    var str;
    var upper;
    var lower;
    var pipe;

    beforeEach(() => {
      str = 'something';
      lower = 'something';
      upper = 'SOMETHING';
      pipe = new LowerCasePipe();
    });

    describe("transform", () => {
      it("should return lowercase", () => {
        var val = pipe.transform(upper);
        expect(val).toEqual(lower);
      });

      it("should lowercase when there is a new value", () => {
        var val = pipe.transform(upper);
        expect(val).toEqual(lower);
        var val2 = pipe.transform('WAT');
        expect(val2).toEqual('wat');
      });

      it("should not support other objects", () => {
        expect(() => pipe.transform(new Object())).toThrowError();
      });
    });

  });
}
