import {FIELD, isPresent, isBlank, Type, int} from 'facade/lang';
import {Math} from 'facade/math';
import {List, ListWrapper} from 'facade/collection';
import {Injector, Key, Dependency, bind, Binding, NoProviderError, ProviderError} from 'di/di';
import {Parent, Ancestor} from 'core/annotations/visibility';
import {StaticKeys} from './static_keys';

var MAX_DEPTH = Math.pow(2, 30) - 1;
var _undefined = new Object();

class TreeNode {
  @FIELD('_parent:TreeNode')
  @FIELD('_head:TreeNode')
  @FIELD('_tail:TreeNode')
  @FIELD('_next:TreeNode')
  @FIELD('_prev:TreeNode')
  constructor(parent:TreeNode) {
    this._parent = parent;
    this._head = null;
    this._tail = null;
    this._next = null;
    this._prev = null;
    if (isPresent(parent)) parent._addChild(this);
  }

  /**
   * Adds a child to the parent node. The child MUST NOT be a part of a tree.
   */
  _addChild(child:TreeNode) {
    if (isPresent(this._tail)) {
      this._tail._next = child;
      child._prev = this._tail;
      this._tail = child;
    } else {
      this._tail = this._head = child;
    }
  }

  get parent() {
    return this._parent;
  }

  get children() {
    var res = [];
    var child = this._head;
    while (child != null) {
      ListWrapper.push(res, child);
      child = child._next;
    }
    return res;
  }
}

class DirectiveDependency extends Dependency {
  constructor(key:Key, asPromise:boolean, lazy:boolean, properties:List, depth:int) {
    super(key, asPromise, lazy, properties);
    this.depth = depth;
  }

  static createFrom(d:Dependency):Dependency {
    return new DirectiveDependency(d.key, d.asPromise, d.lazy,
      d.properties, DirectiveDependency._depth(d.properties));
  }

  static _depth(properties):int {
    if (properties.length == 0) return 0;
    if (ListWrapper.any(properties, p => p instanceof Parent)) return 1;
    if (ListWrapper.any(properties, p => p instanceof Ancestor)) return MAX_DEPTH;
    return 0;
  }
}

/**

Difference between di.Injector and ElementInjector

di.Injector (di.Module):
 - imperative based (can create child injectors imperativly)
 - Lazy loading of code
 - Component/App Level services which are usually not DOM Related.


ElementInjector (ElementModule):
  - ProtoBased (Injector structure fixed at compile time)
  - understands @Ancestor, @Parent, @Child, @Descendent
  - Fast
  - Query mechanism for children
  - 1:1 to DOM structure.

 PERF BENCHMARK: http://www.williambrownstreet.net/blog/2014/04/faster-angularjs-rendering-angularjs-and-reactjs/
 */

export class ProtoElementInjector extends TreeNode {
  /**
  parent:ProtoDirectiveInjector;
  next:ProtoDirectiveInjector;
  prev:ProtoDirectiveInjector;
  head:ProtoDirectiveInjector;
  tail:ProtoDirectiveInjector;
  DirectiveInjector cloningInstance;
  KeyMap keyMap;
  /// Because DI tree is sparse, this shows how far away is the Parent DI
  parentDistance:int = 1; /// 1 for non-sparse/normal depth.

  cKey:int; cFactory:Function; cParams:List<int>;
  _keyId0:int; factory0:Function; params0:List<int>;
  _keyId1:int; factory1:Function; params1:List<int>;
  _keyId2:int; factory2:Function; params2:List<int>;
  _keyId3:int; factory3:Function; params3:List<int>;
  _keyId4:int; factory4:Function; params4:List<int>;
  _keyId5:int; factory5:Function; params5:List<int>;
  _keyId6:int; factory6:Function; params6:List<int>;
  _keyId7:int; factory7:Function; params7:List<int>;
  _keyId8:int; factory8:Function; params8:List<int>;
  _keyId9:int; factory9:Function; params9:List<int>;

  query_keyId0:int;
  query_keyId1:int;

  textNodes:List<int>;
  hasProperties:boolean;
  events:Map<string, Expression>;

  elementInjector:ElementInjector;
  */
  @FIELD('_elementInjector:ElementInjector')
  @FIELD('_binding0:Binding')
  @FIELD('_binding1:Binding')
  @FIELD('_binding2:Binding')
  @FIELD('_binding3:Binding')
  @FIELD('_binding4:Binding')
  @FIELD('_binding5:Binding')
  @FIELD('_binding6:Binding')
  @FIELD('_binding7:Binding')
  @FIELD('_binding8:Binding')
  @FIELD('_binding9:Binding')
  @FIELD('_key0:int')
  @FIELD('_key1:int')
  @FIELD('_key2:int')
  @FIELD('_key3:int')
  @FIELD('_key4:int')
  @FIELD('_key5:int')
  @FIELD('_key6:int')
  @FIELD('_key7:int')
  @FIELD('_key8:int')
  @FIELD('_key9:int')
  @FIELD('textNodes:List<int>')
  constructor(parent:ProtoElementInjector, directiveTypes:List, textNodes:List) {
    super(parent);

    this._elementInjector = null;

    this._binding0 = null; this._keyId0 = null;
    this._binding1 = null; this._keyId1 = null;
    this._binding2 = null; this._keyId2 = null;
    this._binding3 = null; this._keyId3 = null;
    this._binding4 = null; this._keyId4 = null;
    this._binding5 = null; this._keyId5 = null;
    this._binding6 = null; this._keyId6 = null;
    this._binding7 = null; this._keyId7 = null;
    this._binding8 = null; this._keyId8 = null;
    this._binding9 = null; this._keyId9 = null;

    var length = directiveTypes.length;

    if (length > 0) {this._binding0 = this._createBinding(directiveTypes[0]); this._keyId0 = this._binding0.key.id;}
    if (length > 1) {this._binding1 = this._createBinding(directiveTypes[1]); this._keyId1 = this._binding1.key.id;}
    if (length > 2) {this._binding2 = this._createBinding(directiveTypes[2]); this._keyId2 = this._binding2.key.id;}
    if (length > 3) {this._binding3 = this._createBinding(directiveTypes[3]); this._keyId3 = this._binding3.key.id;}
    if (length > 4) {this._binding4 = this._createBinding(directiveTypes[4]); this._keyId4 = this._binding4.key.id;}
    if (length > 5) {this._binding5 = this._createBinding(directiveTypes[5]); this._keyId5 = this._binding5.key.id;}
    if (length > 6) {this._binding6 = this._createBinding(directiveTypes[6]); this._keyId6 = this._binding6.key.id;}
    if (length > 7) {this._binding7 = this._createBinding(directiveTypes[7]); this._keyId7 = this._binding7.key.id;}
    if (length > 8) {this._binding8 = this._createBinding(directiveTypes[8]); this._keyId8 = this._binding8.key.id;}
    if (length > 9) {this._binding9 = this._createBinding(directiveTypes[9]); this._keyId9 = this._binding9.key.id;}
    if (length > 10) {
      throw 'Maximum number of directives per element has been reached.';
    }

    // dummy fields to make analyzer happy
    this.textNodes = [];
    this.hasProperties = false;
  }

  instantiate({view}):ElementInjector {
    var p = this._parent;
    var parentElementInjector = p === null ? null : p._elementInjector;
    this._elementInjector = new ElementInjector({
      proto: this,
      parent: parentElementInjector,
      view: view
    });
    return this._elementInjector;
  }

  _createBinding(directiveType:Type) {
    var b = bind(directiveType).toClass(directiveType);
    var deps = ListWrapper.map(b.dependencies, DirectiveDependency.createFrom);
    return new Binding(b.key, b.factory, deps, b.providedAsPromise);
  }

  clearElementInjector() {
    this._elementInjector = null;
  }

  get hasBindings():boolean {
    return isPresent(this._binding0);
  }
}

export class ElementInjector extends TreeNode {
  /*
   _protoInjector:ProtoElementInjector;
   injector:Injector;
   _parent:ElementInjector;
   _next:ElementInjector;
   _prev:ElementInjector;
   _head:ElementInjector;
   _tail:ElementInjector;


  // For performance reasons the Injector only supports 10 directives per element.
  // NOTE: linear search over fields is faster than HashMap lookup.
  _cObj; // Component only
  _obj0;
  _obj1;
  _obj2;
  _obj3;
  _obj4;
  _obj5;
  _obj6;
  _obj7;
  _obj8;
  _obj9;

  element:Element;
  ngElement:NgElement;
  shadowRoot:ShadowRoot;
  elementProbe:ElementProbe;
  view:View;
  viewPort:ViewPort;
  viewFactory:ViewFactory;
  animate:Animate;
  destinationLightDom:DestinationLightDom;
  sourceLightDom:SourceLightDom;


  // For performance reasons the Injector only supports 2 [Query] per element.
  // NOTE: linear search over fields is faster than HashMap lookup.
  _query0:Query;
  _query1:Query;

   */

  @FIELD('_proto:ProtoElementInjector')
  @FIELD('_appInjector:Injector')
  @FIELD('_obj0:Object')
  @FIELD('_obj1:Object')
  @FIELD('_obj2:Object')
  @FIELD('_obj3:Object')
  @FIELD('_obj4:Object')
  @FIELD('_obj5:Object')
  @FIELD('_obj6:Object')
  @FIELD('_obj7:Object')
  @FIELD('_obj8:Object')
  @FIELD('_obj9:Object')
  @FIELD('_view:View')
  constructor({proto, parent, view}) {
    super(parent);
    this._proto = proto;
    this._view = view;

    //we cannot call clearDirectives because fields won't be detected
    this._appInjector = null;
    this._obj0 = null;
    this._obj1 = null;
    this._obj2 = null;
    this._obj3 = null;
    this._obj4 = null;
    this._obj5 = null;
    this._obj6 = null;
    this._obj7 = null;
    this._obj8 = null;
    this._obj9 = null;
  }

  clearDirectives() {
    this._appInjector = null;
    this._obj0 = null;
    this._obj1 = null;
    this._obj2 = null;
    this._obj3 = null;
    this._obj4 = null;
    this._obj5 = null;
    this._obj6 = null;
    this._obj7 = null;
    this._obj8 = null;
    this._obj9 = null;
  }

  instantiateDirectives(appInjector:Injector) {
    this._appInjector = appInjector;

    var p = this._proto;
    if (isPresent(p._keyId0)) this._obj0 = this._new(p._binding0);
    if (isPresent(p._keyId1)) this._obj1 = this._new(p._binding1);
    if (isPresent(p._keyId2)) this._obj2 = this._new(p._binding2);
    if (isPresent(p._keyId3)) this._obj3 = this._new(p._binding3);
    if (isPresent(p._keyId4)) this._obj4 = this._new(p._binding4);
    if (isPresent(p._keyId5)) this._obj5 = this._new(p._binding5);
    if (isPresent(p._keyId6)) this._obj6 = this._new(p._binding6);
    if (isPresent(p._keyId7)) this._obj7 = this._new(p._binding7);
    if (isPresent(p._keyId8)) this._obj8 = this._new(p._binding8);
    if (isPresent(p._keyId9)) this._obj9 = this._new(p._binding9);
  }

  get(token) {
    return this._getByKey(Key.get(token), 0);
  }

  _new(binding:Binding) {
    var factory = binding.factory;
    var deps = binding.dependencies;
    var length = deps.length;

    var d0,d1,d2,d3,d4,d5,d6,d7,d8,d9;
    try {
      d0 = length > 0 ? this._getByDependency(deps[0]) : null;
      d1 = length > 1 ? this._getByDependency(deps[1]) : null;
      d2 = length > 2 ? this._getByDependency(deps[2]) : null;
      d3 = length > 3 ? this._getByDependency(deps[3]) : null;
      d4 = length > 4 ? this._getByDependency(deps[4]) : null;
      d5 = length > 5 ? this._getByDependency(deps[5]) : null;
      d6 = length > 6 ? this._getByDependency(deps[6]) : null;
      d7 = length > 7 ? this._getByDependency(deps[7]) : null;
      d8 = length > 8 ? this._getByDependency(deps[8]) : null;
      d9 = length > 9 ? this._getByDependency(deps[9]) : null;
    } catch(e) {
      if (e instanceof ProviderError) e.addKey(binding.key);
      throw e;
    }

    var obj;
    switch(length) {
      case 0: obj = factory(); break;
      case 1: obj = factory(d0); break;
      case 2: obj = factory(d0, d1); break;
      case 3: obj = factory(d0, d1, d2); break;
      case 4: obj = factory(d0, d1, d2, d3); break;
      case 5: obj = factory(d0, d1, d2, d3, d4); break;
      case 6: obj = factory(d0, d1, d2, d3, d4, d5); break;
      case 7: obj = factory(d0, d1, d2, d3, d4, d5, d6); break;
      case 8: obj = factory(d0, d1, d2, d3, d4, d5, d6, d7); break;
      case 9: obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8); break;
      case 10: obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9); break;
      default: throw `Directive ${binding.key.token} can only have up to 10 dependencies.`;
    }

    return obj;
  }

  _getByDependency(dep:DirectiveDependency) {
    return this._getByKey(dep.key, dep.depth);
  }


  /*
   * It is fairly easy to annotate keys with metadata.
   * For example, key.metadata = 'directive'.
   *
   * This would allows to do the lookup more efficiently.
   *
   * for example
   * we would lookup special objects only when metadata = 'special'
   * we would lookup directives only when metadata = 'directive'
   *
   * Write benchmarks before doing this optimization.
   */
  _getByKey(key:Key, depth:int) {
    var ei = this;
    while (ei != null && depth >= 0) {
      var specObj = ei._getSpecialObjectByKey(key);
      if (specObj !== _undefined) return specObj;

      var dir = ei._getDirectiveByKey(key);
      if (dir !== _undefined) return dir;

      ei = ei._parent;
      depth -= 1;
    }
    return this._appInjector.get(key);
  }

  _getSpecialObjectByKey(key:Key) {
    var staticKeys = StaticKeys.instance();
    var keyId = key.id;

    if (keyId === staticKeys.viewId) return this._view;
    //TODO add other objects as needed
    return _undefined;
  }

  _getDirectiveByKey(key:Key) {
    var p = this._proto;
    var keyId = key.id;
    if (p._keyId0 === keyId) return this._obj0;
    if (p._keyId1 === keyId) return this._obj1;
    if (p._keyId2 === keyId) return this._obj2;
    if (p._keyId3 === keyId) return this._obj3;
    if (p._keyId4 === keyId) return this._obj4;
    if (p._keyId5 === keyId) return this._obj5;
    if (p._keyId6 === keyId) return this._obj6;
    if (p._keyId7 === keyId) return this._obj7;
    if (p._keyId8 === keyId) return this._obj8;
    if (p._keyId9 === keyId) return this._obj9;
    return _undefined;
  }
}

