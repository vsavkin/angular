library angular2.transform.common.type_metadata_reader;

import 'dart:async';

import 'package:analyzer/analyzer.dart';

import 'package:angular2/src/compiler/directive_metadata.dart';
import 'package:angular2/src/compiler/template_compiler.dart';

import 'package:angular2/src/core/change_detection/change_detection.dart';
import 'package:angular2/src/core/linker/interfaces.dart' show LifecycleHooks;
import 'package:angular2/src/core/metadata/view.dart' show ViewEncapsulation;
import 'package:angular2/src/transform/common/annotation_matcher.dart';
import 'package:angular2/src/transform/common/interface_matcher.dart';
import 'package:angular2/src/transform/common/logging.dart';
import 'package:barback/barback.dart' show AssetId;

import 'naive_eval.dart';
import 'url_resolver.dart';

class TypeMetadataReader {
  final _DirectiveMetadataVisitor _directiveVisitor;
  final _PipeMetadataVisitor _pipeVisitor;
  final _CompileTypeMetadataVisitor _typeVisitor;
  final TemplateCompiler _templateCompiler;

  TypeMetadataReader._(
      this._directiveVisitor, this._pipeVisitor, this._templateCompiler, this._typeVisitor);

  /// Accepts an [AnnotationMatcher] which tests that an [Annotation]
  /// is a [Directive], [Component], or [View].
  factory TypeMetadataReader(AnnotationMatcher annotationMatcher,
      InterfaceMatcher interfaceMatcher, TemplateCompiler templateCompiler) {
    var lifecycleVisitor = new _LifecycleHookVisitor(interfaceMatcher);
    var typeVisitor = new _CompileTypeMetadataVisitor(annotationMatcher);
    var directiveVisitor =
        new _DirectiveMetadataVisitor(annotationMatcher, lifecycleVisitor, typeVisitor);
    var pipeVisitor = new _PipeMetadataVisitor(annotationMatcher);

    return new TypeMetadataReader._(
        directiveVisitor, pipeVisitor, templateCompiler, typeVisitor);
  }

  /// Reads *un-normalized* [CompileDirectiveMetadata]/[CompilePipeMetadata] from the
  /// [ClassDeclaration] `node`.
  ///
  /// `node` is expected to be a class which may have a [Directive] or [Component]
  /// annotation. If `node` does not have one of these annotations, this function
  /// returns `null`.
  ///
  /// `assetId` is the [AssetId] from which `node` was read, unless `node` was
  /// read from a part file, in which case `assetId` should be the [AssetId] of
  /// the parent file.
  Future<dynamic> readTypeMetadata(ClassDeclaration node, AssetId assetId) {
    _directiveVisitor.reset(assetId);
    _pipeVisitor.reset(assetId);
    _typeVisitor.reset(assetId);

    node.accept(_directiveVisitor);
    node.accept(_pipeVisitor);
    node.accept(_typeVisitor);

    if (_directiveVisitor.hasMetadata) {
      final metadata = _directiveVisitor.createMetadata();
      return _templateCompiler.normalizeDirectiveMetadata(metadata);
    } else if (_pipeVisitor.hasMetadata) {
      return new Future.value(_pipeVisitor.createMetadata());
    } else if (_typeVisitor.isInjectable) {
      return new Future.value(_typeVisitor.type);
    } else {
      return new Future.value(null);
    }
  }
}

/// Evaluates the [Map] represented by `expression` and adds all `key`,
/// `value` pairs to `map`. If `expression` does not evaluate to a [Map],
/// throws a descriptive [FormatException].
void _populateMap(Expression expression, Map map, String propertyName) {
  var evaluated = naiveEval(expression);
  if (evaluated is! Map) {
    throw new FormatException(
        'Angular 2 expects a Map but could not understand the value for '
        '$propertyName.',
        '$expression' /* source */);
  }
  evaluated.forEach((key, value) {
    if (value != null) {
      map[key] = '$value';
    }
  });
}

/// Evaluates the [List] represented by `expression` and adds all values,
/// to `list`. If `expression` does not evaluate to a [List], throws a
/// descriptive [FormatException].
void _populateList(
    Expression expression, List<String> list, String propertyName) {
  var evaluated = naiveEval(expression);
  if (evaluated is! List) {
    throw new FormatException(
        'Angular 2 expects a List but could not understand the value for '
        '$propertyName.',
        '$expression' /* source */);
  }
  list.addAll(evaluated.map((e) => e.toString()));
}

/// Evaluates `node` and expects that the result will be a string. If not,
/// throws a [FormatException].
String _expressionToString(Expression node, String nodeDescription) {
  var value = naiveEval(node);
  if (value is! String) {
    throw new FormatException(
        'Angular 2 could not understand the value '
        'in $nodeDescription.',
        '$node' /* source */);
  }
  return value;
}

/// Evaluates `node` and expects that the result will be a bool. If not,
/// throws a [FormatException].
bool _expressionToBool(Expression node, String nodeDescription) {
  var value = naiveEval(node);
  if (value is! bool) {
    throw new FormatException(
        'Angular 2 could not understand the value '
        'in $nodeDescription.',
        '$node' /* source */);
  }
  return value;
}

class _CompileTypeMetadataVisitor extends Object
    with RecursiveAstVisitor<CompileTypeMetadata> {

  bool _isInjectable = false;
  CompileTypeMetadata _type;
  AssetId _assetId;
  final AnnotationMatcher _annotationMatcher;

  _CompileTypeMetadataVisitor(this._annotationMatcher);

  bool get isInjectable => _isInjectable;

  CompileTypeMetadata get type => _type;

  void reset(AssetId assetId) {
    this._assetId = assetId;
    this._isInjectable = false;
    this._type = null;
  }

  @override
  Object visitAnnotation(Annotation node) {
    final isComponent = _annotationMatcher.isComponent(node, _assetId);
    final isDirective = _annotationMatcher.isDirective(node, _assetId);
    final isInjectable = _annotationMatcher.isInjectable(node, _assetId);

    _isInjectable = _isInjectable || isComponent || isDirective || isInjectable;

    return null;
  }

  @override
  Object visitClassDeclaration(ClassDeclaration node) {
    node.metadata.accept(this);
    if (this._isInjectable) {
      _type = new CompileTypeMetadata(
          moduleUrl: toAssetUri(_assetId),
          name: node.name.toString(),
          diDeps: _getCompileDiDependencyMetadata(node),
          runtime: null // Intentionally `null`, cannot be provided here.
      );
    }
    return null;
  }

  List<CompileDiDependencyMetadata> _getCompileDiDependencyMetadata(ClassDeclaration node) {
    final constructor = node.getConstructor(null);
    if (constructor == null) return [];

    return constructor.parameters.parameters.map((p) {
      final typeToken = p.type != null ? _readIdentifier(p.type.name) : null;
      final injectTokens = p.metadata.where((m) => m.name.toString() == "Inject").map((m) => _readIdentifier(m.arguments.arguments[0]));
      final token = injectTokens.isNotEmpty ? injectTokens.first : typeToken;
      final query = _hasAnnotation(p, "Query") ? _createQueryMetadata(_getAnnotation(p, "Query")) : null;
      final viewQuery = _hasAnnotation(p, "ViewQuery") ? _createQueryMetadata(_getAnnotation(p, "ViewQuery")) : null;

      return new CompileDiDependencyMetadata(
          token: token,
          isAttribute: _hasAnnotation(p, "Attribute"),
          isSelf: _hasAnnotation(p, "Self"),
          isHost: _hasAnnotation(p, "Host"),
          isSkipSelf: _hasAnnotation(p, "SkipSelf"),
          isOptional: _hasAnnotation(p, "Optional"),
          query: query,
          viewQuery: viewQuery);
    }).toList();
  }

  _getAnnotation(p, String attrName) => p.metadata.where((m) => m.name.toString() == attrName).first;
  _hasAnnotation(p, String attrName) => p.metadata.where((m) => m.name.toString() == attrName).isNotEmpty;
  _createQueryMetadata(Annotation a) {
    final selector = _readIdentifier(a.arguments.arguments.first);
    var descendants = false;
    a.arguments.arguments.skip(0).forEach((arg) {
      if (arg is NamedExpression && arg.name.toString() == "descendants:")
        descendants = naiveEval(arg.expression);
    });

    final selectors = selector is String ? selector.split(",") : [selector];
    return new CompileQueryMetadata(selectors: selectors, descendants: descendants);
  }
}




/// Visitor responsible for processing a [Directive] annotated
/// [ClassDeclaration] and creating a [CompileDirectiveMetadata] object.
class _DirectiveMetadataVisitor extends Object
    with RecursiveAstVisitor<Object> {
  /// Tests [Annotation]s to determine if they deifne a [Directive],
  /// [Component], [View], or none of these.
  final AnnotationMatcher _annotationMatcher;

  final _LifecycleHookVisitor _lifecycleVisitor;

  final _CompileTypeMetadataVisitor _typeVisitor;

  /// The [AssetId] we are currently processing.
  AssetId _assetId;

  _DirectiveMetadataVisitor(this._annotationMatcher, this._lifecycleVisitor, this._typeVisitor) {
    reset(null);
  }

  /// Whether the visitor has found a [Component] or [Directive] annotation
  /// since the last call to `reset`.
  bool _hasMetadata = false;

  // Annotation fields
  CompileTypeMetadata _type;
  bool _isComponent;
  String _selector;
  String _exportAs;
  ChangeDetectionStrategy _changeDetection;
  List<String> _inputs;
  List<String> _outputs;
  Map<String, String> _host;
  List<CompileProviderMetadata> _providers;
  List<LifecycleHooks> _lifecycleHooks;
  CompileTemplateMetadata _cmpTemplate;
  CompileTemplateMetadata _viewTemplate;

  void reset(AssetId assetId) {
    _lifecycleVisitor.reset(assetId);
    _typeVisitor.reset(assetId);
    _assetId = assetId;

    _type = null;
    _isComponent = false;
    _hasMetadata = false;
    _selector = '';
    _exportAs = null;
    _changeDetection = ChangeDetectionStrategy.Default;
    _inputs = <String>[];
    _outputs = <String>[];
    _host = <String, String>{};
    _providers = <CompileProviderMetadata>[];
    _lifecycleHooks = null;
    _cmpTemplate = null;
    _viewTemplate = null;
  }

  bool get hasMetadata => _hasMetadata;

  get _template => _viewTemplate != null ? _viewTemplate : _cmpTemplate;

  CompileDirectiveMetadata createMetadata() {
    return CompileDirectiveMetadata.create(
        type: _type,
        isComponent: _isComponent,
        dynamicLoadable: true,
        // NOTE(kegluneq): For future optimization.
        selector: _selector,
        exportAs: _exportAs,
        changeDetection: _changeDetection,
        inputs: _inputs,
        outputs: _outputs,
        host: _host,
        providers: _providers,
        lifecycleHooks: _lifecycleHooks,
        template: _template);
  }

  /// Ensures that we do not specify View values on an `@Component` annotation
  /// when there is a @View annotation present.
  void _validateTemplates() {
    if (_cmpTemplate != null && _viewTemplate != null) {
      var name = '(Unknown)';
      if (_type != null && _type.name != null && _type.name.isNotEmpty) {
        name = _type.name;
      }
      log.warning(
          'Cannot specify view parameters on @Component when a @View '
          'is present. Component name: ${name}',
          asset: _assetId);
    }
  }

  @override
  Object visitAnnotation(Annotation node) {
    var isComponent = _annotationMatcher.isComponent(node, _assetId);
    var isDirective = _annotationMatcher.isDirective(node, _assetId);
    if (isDirective) {
      if (_hasMetadata) {
        throw new FormatException(
            'Only one Directive is allowed per class. '
            'Found unexpected "$node".',
            '$node' /* source */);
      }
      _isComponent = isComponent;
      _hasMetadata = true;
      if (isComponent) {
        _cmpTemplate =
            new _CompileTemplateMetadataVisitor().visitAnnotation(node);
        _validateTemplates();
      }
      super.visitAnnotation(node);
    } else if (_annotationMatcher.isView(node, _assetId)) {
      if (_viewTemplate != null) {
        // TODO(kegluneq): Support multiple views on a single class.
        throw new FormatException(
            'Only one View is allowed per class. '
            'Found unexpected "$node".',
            '$node' /* source */);
      }
      _viewTemplate =
          new _CompileTemplateMetadataVisitor().visitAnnotation(node);
      _validateTemplates();
    }

    // Annotation we do not recognize - no need to visit.
    return null;
  }

  @override
  Object visitFieldDeclaration(FieldDeclaration node) {
    for (var variable in node.fields.variables) {
      for (var meta in node.metadata) {
        if (_isAnnotation(meta, 'Output')) {
          _addPropertyToType(_outputs, variable.name.toString(), meta);
        }

        if (_isAnnotation(meta, 'Input')) {
          _addPropertyToType(_inputs, variable.name.toString(), meta);
        }

        if (_isAnnotation(meta, 'HostBinding')) {
          final renamed = _getRenamedValue(meta);
          if (renamed != null) {
            _host['[${renamed}]'] = '${variable.name}';
          } else {
            _host['[${variable.name}]'] = '${variable.name}';
          }
        }
      }
    }
    return null;
  }

  @override
  Object visitMethodDeclaration(MethodDeclaration node) {
    for (var meta in node.metadata) {
      if (_isAnnotation(meta, 'Output') && node.isGetter) {
        _addPropertyToType(_outputs, node.name.toString(), meta);
      }

      if (_isAnnotation(meta, 'Input') && node.isSetter) {
        _addPropertyToType(_inputs, node.name.toString(), meta);
      }

      if (_isAnnotation(meta, 'HostListener')) {
        if (meta.arguments.arguments.length == 0 ||
            meta.arguments.arguments.length > 2) {
          throw new ArgumentError(
              'Incorrect value passed to HostListener. Expected 1 or 2.');
        }

        final eventName = _getHostListenerEventName(meta);
        final params = _getHostListenerParams(meta);
        _host['(${eventName})'] = '${node.name}($params)';
      }

      if (_isAnnotation(meta, 'HostBinding') && node.isGetter) {
        final renamed = _getRenamedValue(meta);
        if (renamed != null) {
          _host['[${renamed}]'] = '${node.name}';
        } else {
          _host['[${node.name}]'] = '${node.name}';
        }
      }
    }
    return null;
  }

  void _addPropertyToType(List type, String name, Annotation meta) {
    final renamed = _getRenamedValue(meta);
    if (renamed != null) {
      type.add('${name}: ${renamed}');
    } else {
      type.add('${name}');
    }
  }

  void _populateProviders(Expression providerValues) {
    _checkMeta();

    final providers = (providerValues as ListLiteral).elements.map((el) {
      if (el is PrefixedIdentifier || el is SimpleIdentifier) {
        return new CompileProviderMetadata(token: _readIdentifier(el));

      } else if (el is InstanceCreationExpression && el.constructorName.toString() == "Provider") {
        final token = el.argumentList.arguments.first;

        var useClass;
        var useExisting;
        var useValue;
        var deps;
        var factoryId;
        var multi;
        el.argumentList.arguments.skip(1).forEach((arg) {
          if (arg.name.toString() == "useClass:") {
            final id = _readIdentifier(arg.expression);
            useClass = new CompileTypeMetadata(prefix: id.prefix, name: id.name);
          }
          if (arg.name.toString() == "useExisting:") {
            useExisting = _readIdentifier(arg.expression);
          }
          if (arg.name.toString() == "useFactory:") {
            factoryId = _readIdentifier(arg.expression);
          }
          if (arg.name.toString() == "deps:") {
            deps = _readDeps(arg.expression);
          }
          if (arg.name.toString() == "multi:") {
            multi = naiveEval(arg.expression);
          }
          if (arg.name.toString() == "useValue:") {
            useValue = _readIdentifier(arg.expression);
          }
        });

        final useFactory = factoryId != null ? new CompileFactoryMetadata(name: factoryId.name, prefix: factoryId.prefix, diDeps: deps) : null;
        return new CompileProviderMetadata(token: _readIdentifier(token), useClass: useClass, useExisting: useExisting, useFactory: useFactory, multi: multi, useValue: useValue);

      } else {
        throw new ArgumentError(
            'Incorrect value. Expected a Provider or a String, but got "${el}".');
      }
    });

    _providers.addAll(providers);
  }

  List<CompileDiDependencyMetadata> _readDeps(Expression exp) {
    if (exp is! ListLiteral) {
      throw new ArgumentError(
          'Incorrect value. Expected a list of tokens or null, but got "${el}".');
    }
    return (exp as ListLiteral).elements.map((el) {
      if (el is ListLiteral) {
        return _createDiDependencyMetadata(el.elements);
      } else {
        return _createDiDependencyMetadata([el]);
      }
    }).toList();
  }

  CompileDiDependencyMetadata _createDiDependencyMetadata(List<Expression> exps) {
    var token;
    var isOptional;
    var isSelf;
    var isHost;
    var isSkipSelf;

    exps.forEach((el){
      if (el is InstanceCreationExpression && el.constructorName.toString() == "Inject") {
        token = _readIdentifier(el.argumentList.arguments.first);

      } else if (el is InstanceCreationExpression && el.constructorName.toString() == "Optional") {
        isOptional = true;

      } else if (el is InstanceCreationExpression && el.constructorName.toString() == "Self") {
        isSelf = true;

      } else if (el is InstanceCreationExpression && el.constructorName.toString() == "Host") {
        isHost = true;

      } else if (el is InstanceCreationExpression && el.constructorName.toString() == "SkipSelf") {
        isSkipSelf = true;

      } else {
        token = _readIdentifier(el);
      }
    });

    return new CompileDiDependencyMetadata(token: token, isOptional: isOptional, isSelf: isSelf, isHost: isHost, isSkipSelf: isSkipSelf);
  }

  //TODO Use AnnotationMatcher instead of string matching
  bool _isAnnotation(Annotation node, String annotationName) {
    var id = node.name;
    final name = id is PrefixedIdentifier ? '${id.identifier}' : '$id';
    return name == annotationName;
  }

  String _getRenamedValue(Annotation node) {
    if (node.arguments.arguments.length == 1) {
      final renamed = naiveEval(node.arguments.arguments.single);
      if (renamed is! String) {
        throw new ArgumentError(
            'Incorrect value. Expected a String, but got "${renamed}".');
      }
      return renamed;
    } else {
      return null;
    }
  }

  String _getHostListenerEventName(Annotation node) {
    final name = naiveEval(node.arguments.arguments.first);
    if (name is! String) {
      throw new ArgumentError(
          'Incorrect event name. Expected a String, but got "${name}".');
    }
    return name;
  }

  String _getHostListenerParams(Annotation node) {
    if (node.arguments.arguments.length == 2) {
      return naiveEval(node.arguments.arguments[1]).join(',');
    } else {
      return "";
    }
  }

  @override
  Object visitClassDeclaration(ClassDeclaration node) {
    node.metadata.accept(this);
    node.accept(_typeVisitor);
    _type = _typeVisitor.type;

    if (this._hasMetadata) {
      _lifecycleHooks = node.implementsClause != null
          ? node.implementsClause.accept(_lifecycleVisitor)
          : const [];

      node.members.accept(this);
    }
    return null;
  }

  @override
  Object visitNamedExpression(NamedExpression node) {
    // TODO(kegluneq): Remove this limitation.
    if (node.name is! Label || node.name.label is! SimpleIdentifier) {
      throw new FormatException(
          'Angular 2 currently only supports simple identifiers in directives.',
          '$node' /* source */);
    }
    var keyString = '${node.name.label}';
    switch (keyString) {
      case 'selector':
        _populateSelector(node.expression);
        break;
      case 'inputs':
        _populateProperties(node.expression);
        break;
      case 'properties':
        _populateProperties(node.expression);
        break;
      case 'host':
        _populateHost(node.expression);
        break;
      case 'exportAs':
        _populateExportAs(node.expression);
        break;
      case 'changeDetection':
        _populateChangeDetection(node.expression);
        break;
      case 'outputs':
        _populateEvents(node.expression);
        break;
      case 'events':
        _populateEvents(node.expression);
        break;
      case 'providers':
        _populateProviders(node.expression);
        break;
    }
    return null;
  }

  void _populateSelector(Expression selectorValue) {
    _checkMeta();
    _selector = _expressionToString(selectorValue, 'Directive#selector');
  }

  void _checkMeta() {
    if (!_hasMetadata) {
      throw new ArgumentError('Incorrect value passed to readTypeMetadata. '
          'Expected type is ClassDeclaration');
    }
  }

  void _populateProperties(Expression inputsValue) {
    _checkMeta();
    _populateList(inputsValue, _inputs, 'Directive#inputs');
  }

  void _populateHost(Expression hostValue) {
    _checkMeta();
    _populateMap(hostValue, _host, 'Directive#host');
  }

  void _populateExportAs(Expression exportAsValue) {
    _checkMeta();
    _exportAs = _expressionToString(exportAsValue, 'Directive#exportAs');
  }

  void _populateEvents(Expression outputsValue) {
    _checkMeta();
    _populateList(outputsValue, _outputs, 'Directive#outputs');
  }

  void _populateChangeDetection(Expression value) {
    _checkMeta();
    _changeDetection = _changeDetectionStrategies[value.toSource()];
  }

  static final Map<String, ChangeDetectionStrategy> _changeDetectionStrategies =
      new Map.fromIterable(ChangeDetectionStrategy.values,
          key: (v) => v.toString());
}

/// Visitor responsible for parsing an [ImplementsClause] and returning a
/// [List<LifecycleHooks>] that the [Directive] subscribes to.
class _LifecycleHookVisitor extends SimpleAstVisitor<List<LifecycleHooks>> {
  /// Tests [Identifier]s of implemented interfaces to determine if they
  /// correspond to [LifecycleHooks] values.
  final InterfaceMatcher _ifaceMatcher;

  /// The [AssetId] we are currently processing.
  AssetId _assetId;

  _LifecycleHookVisitor(this._ifaceMatcher);

  void reset(AssetId assetId) {
    _assetId = assetId;
  }

  @override
  List<LifecycleHooks> visitImplementsClause(ImplementsClause node) {
    if (node == null || node.interfaces == null) return const [];

    return node.interfaces.map((TypeName ifaceTypeName) {
      var id = ifaceTypeName.name;
      if (_ifaceMatcher.isAfterContentChecked(id, _assetId)) {
        return LifecycleHooks.AfterContentChecked;
      } else if (_ifaceMatcher.isAfterContentInit(id, _assetId)) {
        return LifecycleHooks.AfterContentInit;
      } else if (_ifaceMatcher.isAfterViewChecked(id, _assetId)) {
        return LifecycleHooks.AfterViewChecked;
      } else if (_ifaceMatcher.isAfterViewInit(id, _assetId)) {
        return LifecycleHooks.AfterViewInit;
      } else if (_ifaceMatcher.isDoCheck(id, _assetId)) {
        return LifecycleHooks.DoCheck;
      } else if (_ifaceMatcher.isOnChange(id, _assetId)) {
        return LifecycleHooks.OnChanges;
      } else if (_ifaceMatcher.isOnDestroy(id, _assetId)) {
        return LifecycleHooks.OnDestroy;
      } else if (_ifaceMatcher.isOnInit(id, _assetId)) {
        return LifecycleHooks.OnInit;
      }
      return null;
    }).where((e) => e != null).toList(growable: false);
  }
}

/// Visitor responsible for parsing a @View [Annotation] and producing a
/// [CompileTemplateMetadata].
class _CompileTemplateMetadataVisitor
    extends RecursiveAstVisitor<CompileTemplateMetadata> {
  ViewEncapsulation _encapsulation;
  String _template;
  String _templateUrl;
  List<String> _styles;
  List<String> _styleUrls;

  @override
  CompileTemplateMetadata visitAnnotation(Annotation node) {
    super.visitAnnotation(node);

    if (_encapsulation == null &&
        _template == null &&
        _templateUrl == null &&
        _styles == null &&
        _styleUrls == null) {
      return null;
    }

    return new CompileTemplateMetadata(
        encapsulation: _encapsulation,
        template: _template,
        templateUrl: _templateUrl,
        styles: _styles,
        styleUrls: _styleUrls);
  }

  @override
  CompileTemplateMetadata visitNamedExpression(NamedExpression node) {
    // TODO(kegluneq): Remove this limitation.
    if (node.name is! Label || node.name.label is! SimpleIdentifier) {
      throw new FormatException(
          'Angular 2 currently only supports simple identifiers in directives.',
          '$node' /* source */);
    }
    var keyString = '${node.name.label}';
    switch (keyString) {
      case 'encapsulation':
        _populateEncapsulation(node.expression);
        break;
      case 'template':
        _populateTemplate(node.expression);
        break;
      case 'templateUrl':
        _populateTemplateUrl(node.expression);
        break;
      case 'styles':
        _populateStyles(node.expression);
        break;
      case 'styleUrls':
        _populateStyleUrls(node.expression);
        break;
    }
    return null;
  }

  void _populateTemplate(Expression value) {
    _template = _expressionToString(value, 'View#template');
  }

  void _populateTemplateUrl(Expression value) {
    _templateUrl = _expressionToString(value, 'View#templateUrl');
  }

  void _populateStyles(Expression value) {
    _styles = <String>[];
    _populateList(value, _styles, 'View#styles');
  }

  void _populateStyleUrls(Expression value) {
    _styleUrls = <String>[];
    _populateList(value, _styleUrls, 'View#styleUrls');
  }

  void _populateEncapsulation(Expression value) {
    _encapsulation = _viewEncapsulationMap[value.toSource()];
  }

  static final _viewEncapsulationMap =
      new Map.fromIterable(ViewEncapsulation.values, key: (v) => v.toString());
}

/// Visitor responsible for processing a [Pipe] annotated
/// [ClassDeclaration] and creating a [CompilePipeMetadata] object.
class _PipeMetadataVisitor extends Object with RecursiveAstVisitor<Object> {
  /// Tests [Annotation]s to determine if they deifne a [Directive],
  /// [Component], [View], or none of these.
  final AnnotationMatcher _annotationMatcher;

  /// The [AssetId] we are currently processing.
  AssetId _assetId;

  _PipeMetadataVisitor(this._annotationMatcher) {
    reset(null);
  }

  /// Whether the visitor has found a [Pipe] annotation
  /// since the last call to `reset`.
  bool _hasMetadata = false;

  // Annotation fields
  CompileTypeMetadata _type;
  String _name;
  bool _pure;

  void reset(AssetId assetId) {
    _assetId = assetId;

    _hasMetadata = false;
    _type = null;
    _name = null;
    _pure = null;
  }

  bool get hasMetadata => _hasMetadata;

  CompilePipeMetadata createMetadata() {
    return new CompilePipeMetadata(type: _type, name: _name, pure: _pure);
  }

  @override
  Object visitAnnotation(Annotation node) {
    var isPipe = _annotationMatcher.isPipe(node, _assetId);
    if (isPipe) {
      if (_hasMetadata) {
        throw new FormatException(
            'Only one Pipe is allowed per class. '
            'Found unexpected "$node".',
            '$node' /* source */);
      }
      _hasMetadata = true;
      super.visitAnnotation(node);
    }

    // Annotation we do not recognize - no need to visit.
    return null;
  }

  @override
  Object visitClassDeclaration(ClassDeclaration node) {
    node.metadata.accept(this);
    if (this._hasMetadata) {
      _type = new CompileTypeMetadata(
          moduleUrl: toAssetUri(_assetId),
          name: node.name.toString(),
          runtime: null // Intentionally `null`, cannot be provided here.
          );
      node.members.accept(this);
    }
    return null;
  }

  @override
  Object visitNamedExpression(NamedExpression node) {
    // TODO(kegluneq): Remove this limitation.
    if (node.name is! Label || node.name.label is! SimpleIdentifier) {
      throw new FormatException(
          'Angular 2 currently only supports simple identifiers in pipes.',
          '$node' /* source */);
    }
    var keyString = '${node.name.label}';
    switch (keyString) {
      case 'name':
        _popuplateName(node.expression);
        break;
      case 'pure':
        _populatePure(node.expression);
        break;
    }
    return null;
  }

  void _checkMeta() {
    if (!_hasMetadata) {
      throw new ArgumentError('Incorrect value passed to readTypeMetadata. '
          'Expected type is ClassDeclaration');
    }
  }

  void _popuplateName(Expression nameValue) {
    _checkMeta();
    _name = _expressionToString(nameValue, 'Pipe#name');
  }

  void _populatePure(Expression pureValue) {
    _checkMeta();
    _pure = _expressionToBool(pureValue, 'Pipe#pure');
  }
}


dynamic _readIdentifier(dynamic el) {
  if (el is PrefixedIdentifier) {
    return new CompileIdentifierMetadata(name: '${el.identifier}', prefix: '${el.prefix}');

  } else if (el is SimpleIdentifier) {
    return new CompileIdentifierMetadata(name: '$el');

  } else if (el is SimpleStringLiteral){
    return el.value;

  } else {
    throw new ArgumentError('Incorrect identifier "${el}".');
  }
}