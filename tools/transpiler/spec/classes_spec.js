import {ddescribe, describe, it, expect} from 'test_lib/test_lib';

// Constructor
// Define fields
class Foo {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }

  sum() {
    return this.a + this.b;
  }
}

class SubFoo extends Foo {
  constructor(a, b) {
    super(a,b);
  }
}

export function main() {
  describe('classes', function() {
    it('should work', function() {
      var foo = new Foo(2, 3);

      expect(foo.a).toBe(2);
      expect(foo.b).toBe(3);
      expect(foo.sum()).toBe(5);
    });

    describe("inheritance", function () {
      it('should support super', function() {
        var subFoo = new SubFoo(2, 3);
        expect(subFoo.a).toBe(2);
      });
    });
  });
}
