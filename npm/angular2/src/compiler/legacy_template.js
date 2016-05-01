'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var di_1 = require('angular2/src/core/di');
var lang_1 = require('angular2/src/facade/lang');
var html_ast_1 = require('./html_ast');
var html_parser_1 = require('./html_parser');
var util_1 = require('./util');
var LONG_SYNTAX_REGEXP = /^(?:on-(.*)|bindon-(.*)|bind-(.*)|var-(.*))$/ig;
var SHORT_SYNTAX_REGEXP = /^(?:\((.*)\)|\[\((.*)\)\]|\[(.*)\]|#(.*))$/ig;
var VARIABLE_TPL_BINDING_REGEXP = /(\bvar\s+|#)(\S+)/ig;
var TEMPLATE_SELECTOR_REGEXP = /^(\S+)/g;
var SPECIAL_PREFIXES_REGEXP = /^(class|style|attr)\./ig;
var INTERPOLATION_REGEXP = /\{\{.*?\}\}/g;
var SPECIAL_CASES = [
    'ng-non-bindable',
    'ng-default-control',
    'ng-no-form',
];
/**
 * Convert templates to the case sensitive syntax
 *
 * @internal
 */
var LegacyHtmlAstTransformer = (function () {
    function LegacyHtmlAstTransformer(dashCaseSelectors) {
        this.dashCaseSelectors = dashCaseSelectors;
        this.rewrittenAst = [];
        this.visitingTemplateEl = false;
    }
    LegacyHtmlAstTransformer.prototype.visitComment = function (ast, context) { return ast; };
    LegacyHtmlAstTransformer.prototype.visitElement = function (ast, context) {
        var _this = this;
        this.visitingTemplateEl = ast.name.toLowerCase() == 'template';
        var attrs = ast.attrs.map(function (attr) { return attr.visit(_this, null); });
        var children = ast.children.map(function (child) { return child.visit(_this, null); });
        return new html_ast_1.HtmlElementAst(ast.name, attrs, children, ast.sourceSpan, ast.startSourceSpan, ast.endSourceSpan);
    };
    LegacyHtmlAstTransformer.prototype.visitAttr = function (originalAst, context) {
        var ast = originalAst;
        if (this.visitingTemplateEl) {
            if (lang_1.isPresent(lang_1.RegExpWrapper.firstMatch(LONG_SYNTAX_REGEXP, ast.name))) {
                // preserve the "-" in the prefix for the long syntax
                ast = this._rewriteLongSyntax(ast);
            }
            else {
                // rewrite any other attribute
                var name_1 = util_1.dashCaseToCamelCase(ast.name);
                ast = name_1 == ast.name ? ast : new html_ast_1.HtmlAttrAst(name_1, ast.value, ast.sourceSpan);
            }
        }
        else {
            ast = this._rewriteTemplateAttribute(ast);
            ast = this._rewriteLongSyntax(ast);
            ast = this._rewriteShortSyntax(ast);
            ast = this._rewriteStar(ast);
            ast = this._rewriteInterpolation(ast);
            ast = this._rewriteSpecialCases(ast);
        }
        if (ast !== originalAst) {
            this.rewrittenAst.push(ast);
        }
        return ast;
    };
    LegacyHtmlAstTransformer.prototype.visitText = function (ast, context) { return ast; };
    LegacyHtmlAstTransformer.prototype.visitExpansion = function (ast, context) {
        var _this = this;
        var cases = ast.cases.map(function (c) { return c.visit(_this, null); });
        return new html_ast_1.HtmlExpansionAst(ast.switchValue, ast.type, cases, ast.sourceSpan, ast.switchValueSourceSpan);
    };
    LegacyHtmlAstTransformer.prototype.visitExpansionCase = function (ast, context) { return ast; };
    LegacyHtmlAstTransformer.prototype._rewriteLongSyntax = function (ast) {
        var m = lang_1.RegExpWrapper.firstMatch(LONG_SYNTAX_REGEXP, ast.name);
        var attrName = ast.name;
        var attrValue = ast.value;
        if (lang_1.isPresent(m)) {
            if (lang_1.isPresent(m[1])) {
                attrName = "on-" + util_1.dashCaseToCamelCase(m[1]);
            }
            else if (lang_1.isPresent(m[2])) {
                attrName = "bindon-" + util_1.dashCaseToCamelCase(m[2]);
            }
            else if (lang_1.isPresent(m[3])) {
                attrName = "bind-" + util_1.dashCaseToCamelCase(m[3]);
            }
            else if (lang_1.isPresent(m[4])) {
                attrName = "var-" + util_1.dashCaseToCamelCase(m[4]);
                attrValue = util_1.dashCaseToCamelCase(attrValue);
            }
        }
        return attrName == ast.name && attrValue == ast.value ?
            ast :
            new html_ast_1.HtmlAttrAst(attrName, attrValue, ast.sourceSpan);
    };
    LegacyHtmlAstTransformer.prototype._rewriteTemplateAttribute = function (ast) {
        var name = ast.name;
        var value = ast.value;
        if (name.toLowerCase() == 'template') {
            name = 'template';
            // rewrite the directive selector
            value = lang_1.StringWrapper.replaceAllMapped(value, TEMPLATE_SELECTOR_REGEXP, function (m) { return util_1.dashCaseToCamelCase(m[1]); });
            // rewrite the var declarations
            value = lang_1.StringWrapper.replaceAllMapped(value, VARIABLE_TPL_BINDING_REGEXP, function (m) {
                return "" + m[1].toLowerCase() + util_1.dashCaseToCamelCase(m[2]);
            });
        }
        if (name == ast.name && value == ast.value) {
            return ast;
        }
        return new html_ast_1.HtmlAttrAst(name, value, ast.sourceSpan);
    };
    LegacyHtmlAstTransformer.prototype._rewriteShortSyntax = function (ast) {
        var m = lang_1.RegExpWrapper.firstMatch(SHORT_SYNTAX_REGEXP, ast.name);
        var attrName = ast.name;
        var attrValue = ast.value;
        if (lang_1.isPresent(m)) {
            if (lang_1.isPresent(m[1])) {
                attrName = "(" + util_1.dashCaseToCamelCase(m[1]) + ")";
            }
            else if (lang_1.isPresent(m[2])) {
                attrName = "[(" + util_1.dashCaseToCamelCase(m[2]) + ")]";
            }
            else if (lang_1.isPresent(m[3])) {
                var prop = lang_1.StringWrapper.replaceAllMapped(m[3], SPECIAL_PREFIXES_REGEXP, function (m) { return m[1].toLowerCase() + '.'; });
                if (prop.startsWith('class.') || prop.startsWith('attr.') || prop.startsWith('style.')) {
                    attrName = "[" + prop + "]";
                }
                else {
                    attrName = "[" + util_1.dashCaseToCamelCase(prop) + "]";
                }
            }
            else if (lang_1.isPresent(m[4])) {
                attrName = "#" + util_1.dashCaseToCamelCase(m[4]);
                attrValue = util_1.dashCaseToCamelCase(attrValue);
            }
        }
        return attrName == ast.name && attrValue == ast.value ?
            ast :
            new html_ast_1.HtmlAttrAst(attrName, attrValue, ast.sourceSpan);
    };
    LegacyHtmlAstTransformer.prototype._rewriteStar = function (ast) {
        var attrName = ast.name;
        var attrValue = ast.value;
        if (attrName[0] == '*') {
            attrName = util_1.dashCaseToCamelCase(attrName);
            // rewrite the var declarations
            attrValue = lang_1.StringWrapper.replaceAllMapped(attrValue, VARIABLE_TPL_BINDING_REGEXP, function (m) {
                return "" + m[1].toLowerCase() + util_1.dashCaseToCamelCase(m[2]);
            });
        }
        return attrName == ast.name && attrValue == ast.value ?
            ast :
            new html_ast_1.HtmlAttrAst(attrName, attrValue, ast.sourceSpan);
    };
    LegacyHtmlAstTransformer.prototype._rewriteInterpolation = function (ast) {
        var hasInterpolation = lang_1.RegExpWrapper.test(INTERPOLATION_REGEXP, ast.value);
        if (!hasInterpolation) {
            return ast;
        }
        var name = ast.name;
        if (!(name.startsWith('attr.') || name.startsWith('class.') || name.startsWith('style.'))) {
            name = util_1.dashCaseToCamelCase(ast.name);
        }
        return name == ast.name ? ast : new html_ast_1.HtmlAttrAst(name, ast.value, ast.sourceSpan);
    };
    LegacyHtmlAstTransformer.prototype._rewriteSpecialCases = function (ast) {
        var attrName = ast.name;
        if (SPECIAL_CASES.indexOf(attrName) > -1) {
            return new html_ast_1.HtmlAttrAst(util_1.dashCaseToCamelCase(attrName), ast.value, ast.sourceSpan);
        }
        if (lang_1.isPresent(this.dashCaseSelectors) && this.dashCaseSelectors.indexOf(attrName) > -1) {
            return new html_ast_1.HtmlAttrAst(util_1.dashCaseToCamelCase(attrName), ast.value, ast.sourceSpan);
        }
        return ast;
    };
    return LegacyHtmlAstTransformer;
}());
exports.LegacyHtmlAstTransformer = LegacyHtmlAstTransformer;
var LegacyHtmlParser = (function (_super) {
    __extends(LegacyHtmlParser, _super);
    function LegacyHtmlParser() {
        _super.apply(this, arguments);
    }
    LegacyHtmlParser.prototype.parse = function (sourceContent, sourceUrl, parseExpansionForms) {
        if (parseExpansionForms === void 0) { parseExpansionForms = false; }
        var transformer = new LegacyHtmlAstTransformer();
        var htmlParseTreeResult = _super.prototype.parse.call(this, sourceContent, sourceUrl, parseExpansionForms);
        var rootNodes = htmlParseTreeResult.rootNodes.map(function (node) { return node.visit(transformer, null); });
        return transformer.rewrittenAst.length > 0 ?
            new html_parser_1.HtmlParseTreeResult(rootNodes, htmlParseTreeResult.errors) :
            htmlParseTreeResult;
    };
    LegacyHtmlParser = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], LegacyHtmlParser);
    return LegacyHtmlParser;
}(html_parser_1.HtmlParser));
exports.LegacyHtmlParser = LegacyHtmlParser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVnYWN5X3RlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1yNVBySks5aC50bXAvYW5ndWxhcjIvc3JjL2NvbXBpbGVyL2xlZ2FjeV90ZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSxtQkFBNEMsc0JBQXNCLENBQUMsQ0FBQTtBQUVuRSxxQkFBK0QsMEJBQTBCLENBQUMsQ0FBQTtBQUUxRix5QkFTTyxZQUFZLENBQUMsQ0FBQTtBQUNwQiw0QkFBOEMsZUFBZSxDQUFDLENBQUE7QUFFOUQscUJBQXVELFFBQVEsQ0FBQyxDQUFBO0FBRWhFLElBQUksa0JBQWtCLEdBQUcsZ0RBQWdELENBQUM7QUFDMUUsSUFBSSxtQkFBbUIsR0FBRyw4Q0FBOEMsQ0FBQztBQUN6RSxJQUFJLDJCQUEyQixHQUFHLHFCQUFxQixDQUFDO0FBQ3hELElBQUksd0JBQXdCLEdBQUcsU0FBUyxDQUFDO0FBQ3pDLElBQUksdUJBQXVCLEdBQUcseUJBQXlCLENBQUM7QUFDeEQsSUFBSSxvQkFBb0IsR0FBRyxjQUFjLENBQUM7QUFFMUMsSUFBTSxhQUFhLEdBQXFCO0lBQ3RDLGlCQUFpQjtJQUNqQixvQkFBb0I7SUFDcEIsWUFBWTtDQUNiLENBQUM7QUFFRjs7OztHQUlHO0FBQ0g7SUFJRSxrQ0FBb0IsaUJBQTRCO1FBQTVCLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBVztRQUhoRCxpQkFBWSxHQUFjLEVBQUUsQ0FBQztRQUM3Qix1QkFBa0IsR0FBWSxLQUFLLENBQUM7SUFFZSxDQUFDO0lBRXBELCtDQUFZLEdBQVosVUFBYSxHQUFtQixFQUFFLE9BQVksSUFBUyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUVwRSwrQ0FBWSxHQUFaLFVBQWEsR0FBbUIsRUFBRSxPQUFZO1FBQTlDLGlCQU1DO1FBTEMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEdB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UUFBcEMsbUNBQW9DLEdBQXBDLDJCQUFvQztRQUN4QyxJQUFJLFdBQVcsR0FBRyxJQUFJLHdCQUF3QixFQUFFLENBQUM7UUFDakQsSUFBSSxtQkFBbUIsR0FBRyxnQkFBSyxDQUFDLEtBQUssWUFBQyxhQUFhLEVBQUUsU0FBUyxFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFFckYsSUFBSSxTQUFTLEdBQUcsbUJBQW1CLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxFQUE3QixDQUE2QixDQUFDLENBQUM7UUFFekYsTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUM7WUFDL0IsSUFBSSxpQ0FBbUIsQ0FBQyxTQUFTLEVBQUUsbUJBQW1CLENBQUMsTUFBTSxDQUFDO1lBQzlELG1CQUFtQixDQUFDO0lBQ2pDLENBQUM7SUFaSDtRQUFDLGVBQVUsRUFBRTs7d0JBQUE7SUFhYix1QkFBQztBQUFELENBQUMsQUFaRCxDQUFzQyx3QkFBVSxHQVkvQztBQVpZLHdCQUFnQixtQkFZNUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZSwgUHJvdmlkZXIsIHByb3ZpZGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcblxuaW1wb3J0IHtTdHJpbmdXcmFwcGVyLCBSZWdFeHBXcmFwcGVyLCBpc0JsYW5rLCBpc1ByZXNlbnR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5cbmltcG9ydCB7XG4gIEh0bWxBc3RWaXNpdG9yLFxuICBIdG1sQXR0ckFzdCxcbiAgSHRtbEVsZW1lbnRBc3QsXG4gIEh0bWxUZXh0QXN0LFxuICBIdG1sQ29tbWVudEFzdCxcbiAgSHRtbEV4cGFuc2lvbkFzdCxcbiAgSHRtbEV4cGFuc2lvbkNhc2VBc3QsXG4gIEh0bWxBc3Rcbn0gZnJvbSAnLi9odG1sX2FzdCc7XG5pbXBvcnQge0h0bWxQYXJzZXIsIEh0bWxQYXJzZVRyZWVSZXN1bHR9IGZyb20gJy4vaHRtbF9wYXJzZXInO1xuXG5pbXBvcnQge2Rhc2hDYXNlVG9DYW1lbENhc2UsIGNhbWVsQ2FzZVRvRGFzaENhc2V9IGZyb20gJy4vdXRpbCc7XG5cbnZhciBMT05HX1NZTlRBWF9SRUdFWFAgPSAvXig/Om9uLSguKil8YmluZG9uLSguKil8YmluZC0oLiopfHZhci0oLiopKSQvaWc7XG52YXIgU0hPUlRfU1lOVEFYX1JFR0VYUCA9IC9eKD86XFwoKC4qKVxcKXxcXFtcXCgoLiopXFwpXFxdfFxcWyguKilcXF18IyguKikpJC9pZztcbnZhciBWQVJJQUJMRV9UUExfQklORElOR19SRUdFWFAgPSAvKFxcYnZhclxccyt8IykoXFxTKykvaWc7XG52YXIgVEVNUExBVEVfU0VMRUNUT1JfUkVHRVhQID0gL14oXFxTKykvZztcbnZhciBTUEVDSUFMX1BSRUZJWEVTX1JFR0VYUCA9IC9eKGNsYXNzfHN0eWxlfGF0dHIpXFwuL2lnO1xudmFyIElOVEVSUE9MQVRJT05fUkVHRVhQID0gL1xce1xcey4qP1xcfVxcfS9nO1xuXG5jb25zdCBTUEVDSUFMX0NBU0VTID0gLypAdHMyZGFydF9jb25zdCovW1xuICAnbmctbm9uLWJpbmRhYmxlJyxcbiAgJ25nLWRlZmF1bHQtY29udHJvbCcsXG4gICduZy1uby1mb3JtJyxcbl07XG5cbi8qKlxuICogQ29udmVydCB0ZW1wbGF0ZXMgdG8gdGhlIGNhc2Ugc2Vuc2l0aXZlIHN5bnRheFxuICpcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgY2xhc3MgTGVnYWN5SHRtbEFzdFRyYW5zZm9ybWVyIGltcGxlbWVudHMgSHRtbEFzdFZpc2l0b3Ige1xuICByZXdyaXR0ZW5Bc3Q6IEh0bWxBc3RbXSA9IFtdO1xuICB2aXNpdGluZ1RlbXBsYXRlRWw6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGRhc2hDYXNlU2VsZWN0b3JzPzogc3RyaW5nW10pIHt9XG5cbiAgdmlzaXRDb21tZW50KGFzdDogSHRtbENvbW1lbnRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBhc3Q7IH1cblxuICB2aXNpdEVsZW1lbnQoYXN0OiBIdG1sRWxlbWVudEFzdCwgY29udGV4dDogYW55KTogSHRtbEVsZW1lbnRBc3Qge1xuICAgIHRoaXMudmlzaXRpbmdUZW1wbGF0ZUVsID0gYXN0Lm5hbWUudG9Mb3dlckNhc2UoKSA9PSAndGVtcGxhdGUnO1xuICAgIGxldCBhdHRycyA9IGFzdC5hdHRycy5tYXAoYXR0ciA9PiBhdHRyLnZpc2l0KHRoaXMsIG51bGwpKTtcbiAgICBsZXQgY2hpbGRyZW4gPSBhc3QuY2hpbGRyZW4ubWFwKGNoaWxkID0+IGNoaWxkLnZpc2l0KHRoaXMsIG51bGwpKTtcbiAgICByZXR1cm4gbmV3IEh0bWxFbGVtZW50QXN0KGFzdC5uYW1lLCBhdHRycywgY2hpbGRyZW4sIGFzdC5zb3VyY2VTcGFuLCBhc3Quc3RhcnRTb3VyY2VTcGFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN0LmVuZFNvdXJjZVNwYW4pO1xuICB9XG5cbiAgdmlzaXRBdHRyKG9yaWdpbmFsQXN0OiBIdG1sQXR0ckFzdCwgY29udGV4dDogYW55KTogSHRtbEF0dHJBc3Qge1xuICAgIGxldCBhc3QgPSBvcmlnaW5hbEFzdDtcblxuICAgIGlmICh0aGlzLnZpc2l0aW5nVGVtcGxhdGVFbCkge1xuICAgICAgaWYgKGlzUHJlc2VudChSZWdFeHBXcmFwcGVyLmZpcnN0TWF0Y2goTE9OR19TWU5UQVhfUkVHRVhQLCBhc3QubmFtZSkpKSB7XG4gICAgICAgIC8vIHByZXNlcnZlIHRoZSBcIi1cIiBpbiB0aGUgcHJlZml4IGZvciB0aGUgbG9uZyBzeW50YXhcbiAgICAgICAgYXN0ID0gdGhpcy5fcmV3cml0ZUxvbmdTeW50YXgoYXN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHJld3JpdGUgYW55IG90aGVyIGF0dHJpYnV0ZVxuICAgICAgICBsZXQgbmFtZSA9IGRhc2hDYXNlVG9DYW1lbENhc2UoYXN0Lm5hbWUpO1xuICAgICAgICBhc3QgPSBuYW1lID09IGFzdC5uYW1lID8gYXN0IDogbmV3IEh0bWxBdHRyQXN0KG5hbWUsIGFzdC52YWx1ZSwgYXN0LnNvdXJjZVNwYW4pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBhc3QgPSB0aGlzLl9yZXdyaXRlVGVtcGxhdGVBdHRyaWJ1dGUoYXN0KTtcbiAgICAgIGFzdCA9IHRoaXMuX3Jld3JpdGVMb25nU3ludGF4KGFzdCk7XG4gICAgICBhc3QgPSB0aGlzLl9yZXdyaXRlU2hvcnRTeW50YXgoYXN0KTtcbiAgICAgIGFzdCA9IHRoaXMuX3Jld3JpdGVTdGFyKGFzdCk7XG4gICAgICBhc3QgPSB0aGlzLl9yZXdyaXRlSW50ZXJwb2xhdGlvbihhc3QpO1xuICAgICAgYXN0ID0gdGhpcy5fcmV3cml0ZVNwZWNpYWxDYXNlcyhhc3QpO1xuICAgIH1cblxuICAgIGlmIChhc3QgIT09IG9yaWdpbmFsQXN0KSB7XG4gICAgICB0aGlzLnJld3JpdHRlbkFzdC5wdXNoKGFzdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFzdDtcbiAgfVxuXG4gIHZpc2l0VGV4dChhc3Q6IEh0bWxUZXh0QXN0LCBjb250ZXh0OiBhbnkpOiBIdG1sVGV4dEFzdCB7IHJldHVybiBhc3Q7IH1cblxuICB2aXNpdEV4cGFuc2lvbihhc3Q6IEh0bWxFeHBhbnNpb25Bc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgbGV0IGNhc2VzID0gYXN0LmNhc2VzLm1hcChjID0+IGMudmlzaXQodGhpcywgbnVsbCkpO1xuICAgIHJldHVybiBuZXcgSHRtbEV4cGFuc2lvbkFzdChhc3Quc3dpdGNoVmFsdWUsIGFzdC50eXBlLCBjYXNlcywgYXN0LnNvdXJjZVNwYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzdC5zd2l0Y2hWYWx1ZVNvdXJjZVNwYW4pO1xuICB9XG5cbiAgdmlzaXRFeHBhbnNpb25DYXNlKGFzdDogSHRtbEV4cGFuc2lvbkNhc2VBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBhc3Q7IH1cblxuICBwcml2YXRlIF9yZXdyaXRlTG9uZ1N5bnRheChhc3Q6IEh0bWxBdHRyQXN0KTogSHRtbEF0dHJBc3Qge1xuICAgIGxldCBtID0gUmVnRXhwV3JhcHBlci5maXJzdE1hdGNoKExPTkdfU1lOVEFYX1JFR0VYUCwgYXN0Lm5hbWUpO1xuICAgIGxldCBhdHRyTmFtZSA9IGFzdC5uYW1lO1xuICAgIGxldCBhdHRyVmFsdWUgPSBhc3QudmFsdWU7XG5cbiAgICBpZiAoaXNQcmVzZW50KG0pKSB7XG4gICAgICBpZiAoaXNQcmVzZW50KG1bMV0pKSB7XG4gICAgICAgIGF0dHJOYW1lID0gYG9uLSR7ZGFzaENhc2VUb0NhbWVsQ2FzZShtWzFdKX1gO1xuICAgICAgfSBlbHNlIGlmIChpc1ByZXNlbnQobVsyXSkpIHtcbiAgICAgICAgYXR0ck5hbWUgPSBgYmluZG9uLSR7ZGFzaENhc2VUb0NhbWVsQ2FzZShtWzJdKX1gO1xuICAgICAgfSBlbHNlIGlmIChpc1ByZXNlbnQobVszXSkpIHtcbiAgICAgICAgYXR0ck5hbWUgPSBgYmluZC0ke2Rhc2hDYXNlVG9DYW1lbENhc2UobVszXSl9YDtcbiAgICAgIH0gZWxzZSBpZiAoaXNQcmVzZW50KG1bNF0pKSB7XG4gICAgICAgIGF0dHJOYW1lID0gYHZhci0ke2Rhc2hDYXNlVG9DYW1lbENhc2UobVs0XSl9YDtcbiAgICAgICAgYXR0clZhbHVlID0gZGFzaENhc2VUb0NhbWVsQ2FzZShhdHRyVmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhdHRyTmFtZSA9PSBhc3QubmFtZSAmJiBhdHRyVmFsdWUgPT0gYXN0LnZhbHVlID9cbiAgICAgICAgICAgICAgIGFzdCA6XG4gICAgICAgICAgICAgICBuZXcgSHRtbEF0dHJBc3QoYXR0ck5hbWUsIGF0dHJWYWx1ZSwgYXN0LnNvdXJjZVNwYW4pO1xuICB9XG5cbiAgcHJpdmF0ZSBfcmV3cml0ZVRlbXBsYXRlQXR0cmlidXRlKGFzdDogSHRtbEF0dHJBc3QpOiBIdG1sQXR0ckFzdCB7XG4gICAgbGV0IG5hbWUgPSBhc3QubmFtZTtcbiAgICBsZXQgdmFsdWUgPSBhc3QudmFsdWU7XG5cbiAgICBpZiAobmFtZS50b0xvd2VyQ2FzZSgpID09ICd0ZW1wbGF0ZScpIHtcbiAgICAgIG5hbWUgPSAndGVtcGxhdGUnO1xuXG4gICAgICAvLyByZXdyaXRlIHRoZSBkaXJlY3RpdmUgc2VsZWN0b3JcbiAgICAgIHZhbHVlID0gU3RyaW5nV3JhcHBlci5yZXBsYWNlQWxsTWFwcGVkKHZhbHVlLCBURU1QTEFURV9TRUxFQ1RPUl9SRUdFWFAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobSkgPT4geyByZXR1cm4gZGFzaENhc2VUb0NhbWVsQ2FzZShtWzFdKTsgfSk7XG5cbiAgICAgIC8vIHJld3JpdGUgdGhlIHZhciBkZWNsYXJhdGlvbnNcbiAgICAgIHZhbHVlID0gU3RyaW5nV3JhcHBlci5yZXBsYWNlQWxsTWFwcGVkKHZhbHVlLCBWQVJJQUJMRV9UUExfQklORElOR19SRUdFWFAsIG0gPT4ge1xuICAgICAgICByZXR1cm4gYCR7bVsxXS50b0xvd2VyQ2FzZSgpfSR7ZGFzaENhc2VUb0NhbWVsQ2FzZShtWzJdKX1gO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKG5hbWUgPT0gYXN0Lm5hbWUgJiYgdmFsdWUgPT0gYXN0LnZhbHVlKSB7XG4gICAgICByZXR1cm4gYXN0O1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSHRtbEF0dHJBc3QobmFtZSwgdmFsdWUsIGFzdC5zb3VyY2VTcGFuKTtcbiAgfVxuXG4gIHByaXZhdGUgX3Jld3JpdGVTaG9ydFN5bnRheChhc3Q6IEh0bWxBdHRyQXN0KTogSHRtbEF0dHJBc3Qge1xuICAgIGxldCBtID0gUmVnRXhwV3JhcHBlci5maXJzdE1hdGNoKFNIT1JUX1NZTlRBWF9SRUdFWFAsIGFzdC5uYW1lKTtcbiAgICBsZXQgYXR0ck5hbWUgPSBhc3QubmFtZTtcbiAgICBsZXQgYXR0clZhbHVlID0gYXN0LnZhbHVlO1xuXG4gICAgaWYgKGlzUHJlc2VudChtKSkge1xuICAgICAgaWYgKGlzUHJlc2VudChtWzFdKSkge1xuICAgICAgICBhdHRyTmFtZSA9IGAoJHtkYXNoQ2FzZVRvQ2FtZWxDYXNlKG1bMV0pfSlgO1xuICAgICAgfSBlbHNlIGlmIChpc1ByZXNlbnQobVsyXSkpIHtcbiAgICAgICAgYXR0ck5hbWUgPSBgWygke2Rhc2hDYXNlVG9DYW1lbENhc2UobVsyXSl9KV1gO1xuICAgICAgfSBlbHNlIGlmIChpc1ByZXNlbnQobVszXSkpIHtcbiAgICAgICAgbGV0IHByb3AgPSBTdHJpbmdXcmFwcGVyLnJlcGxhY2VBbGxNYXBwZWQobVszXSwgU1BFQ0lBTF9QUkVGSVhFU19SRUdFWFAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtKSA9PiB7IHJldHVybiBtWzFdLnRvTG93ZXJDYXNlKCkgKyAnLic7IH0pO1xuXG4gICAgICAgIGlmIChwcm9wLnN0YXJ0c1dpdGgoJ2NsYXNzLicpIHx8IHByb3Auc3RhcnRzV2l0aCgnYXR0ci4nKSB8fCBwcm9wLnN0YXJ0c1dpdGgoJ3N0eWxlLicpKSB7XG4gICAgICAgICAgYXR0ck5hbWUgPSBgWyR7cHJvcH1dYDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhdHRyTmFtZSA9IGBbJHtkYXNoQ2FzZVRvQ2FtZWxDYXNlKHByb3ApfV1gO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGlzUHJlc2VudChtWzRdKSkge1xuICAgICAgICBhdHRyTmFtZSA9IGAjJHtkYXNoQ2FzZVRvQ2FtZWxDYXNlKG1bNF0pfWA7XG4gICAgICAgIGF0dHJWYWx1ZSA9IGRhc2hDYXNlVG9DYW1lbENhc2UoYXR0clZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXR0ck5hbWUgPT0gYXN0Lm5hbWUgJiYgYXR0clZhbHVlID09IGFzdC52YWx1ZSA/XG4gICAgICAgICAgICAgICBhc3QgOlxuICAgICAgICAgICAgICAgbmV3IEh0bWxBdHRyQXN0KGF0dHJOYW1lLCBhdHRyVmFsdWUsIGFzdC5zb3VyY2VTcGFuKTtcbiAgfVxuXG4gIHByaXZhdGUgX3Jld3JpdGVTdGFyKGFzdDogSHRtbEF0dHJBc3QpOiBIdG1sQXR0ckFzdCB7XG4gICAgbGV0IGF0dHJOYW1lID0gYXN0Lm5hbWU7XG4gICAgbGV0IGF0dHJWYWx1ZSA9IGFzdC52YWx1ZTtcblxuICAgIGlmIChhdHRyTmFtZVswXSA9PSAnKicpIHtcbiAgICAgIGF0dHJOYW1lID0gZGFzaENhc2VUb0NhbWVsQ2FzZShhdHRyTmFtZSk7XG4gICAgICAvLyByZXdyaXRlIHRoZSB2YXIgZGVjbGFyYXRpb25zXG4gICAgICBhdHRyVmFsdWUgPSBTdHJpbmdXcmFwcGVyLnJlcGxhY2VBbGxNYXBwZWQoYXR0clZhbHVlLCBWQVJJQUJMRV9UUExfQklORElOR19SRUdFWFAsIG0gPT4ge1xuICAgICAgICByZXR1cm4gYCR7bVsxXS50b0xvd2VyQ2FzZSgpfSR7ZGFzaENhc2VUb0NhbWVsQ2FzZShtWzJdKX1gO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF0dHJOYW1lID09IGFzdC5uYW1lICYmIGF0dHJWYWx1ZSA9PSBhc3QudmFsdWUgP1xuICAgICAgICAgICAgICAgYXN0IDpcbiAgICAgICAgICAgICAgIG5ldyBIdG1sQXR0ckFzdChhdHRyTmFtZSwgYXR0clZhbHVlLCBhc3Quc291cmNlU3Bhbik7XG4gIH1cblxuICBwcml2YXRlIF9yZXdyaXRlSW50ZXJwb2xhdGlvbihhc3Q6IEh0bWxBdHRyQXN0KTogSHRtbEF0dHJBc3Qge1xuICAgIGxldCBoYXNJbnRlcnBvbGF0aW9uID0gUmVnRXhwV3JhcHBlci50ZXN0KElOVEVSUE9MQVRJT05fUkVHRVhQLCBhc3QudmFsdWUpO1xuXG4gICAgaWYgKCFoYXNJbnRlcnBvbGF0aW9uKSB7XG4gICAgICByZXR1cm4gYXN0O1xuICAgIH1cblxuICAgIGxldCBuYW1lID0gYXN0Lm5hbWU7XG5cbiAgICBpZiAoIShuYW1lLnN0YXJ0c1dpdGgoJ2F0dHIuJykgfHwgbmFtZS5zdGFydHNXaXRoKCdjbGFzcy4nKSB8fCBuYW1lLnN0YXJ0c1dpdGgoJ3N0eWxlLicpKSkge1xuICAgICAgbmFtZSA9IGRhc2hDYXNlVG9DYW1lbENhc2UoYXN0Lm5hbWUpO1xuICAgIH1cblxuICAgIHJldHVybiBuYW1lID09IGFzdC5uYW1lID8gYXN0IDogbmV3IEh0bWxBdHRyQXN0KG5hbWUsIGFzdC52YWx1ZSwgYXN0LnNvdXJjZVNwYW4pO1xuICB9XG5cbiAgcHJpdmF0ZSBfcmV3cml0ZVNwZWNpYWxDYXNlcyhhc3Q6IEh0bWxBdHRyQXN0KTogSHRtbEF0dHJBc3Qge1xuICAgIGxldCBhdHRyTmFtZSA9IGFzdC5uYW1lO1xuXG4gICAgaWYgKFNQRUNJQUxfQ0FTRVMuaW5kZXhPZihhdHRyTmFtZSkgPiAtMSkge1xuICAgICAgcmV0dXJuIG5ldyBIdG1sQXR0ckFzdChkYXNoQ2FzZVRvQ2FtZWxDYXNlKGF0dHJOYW1lKSwgYXN0LnZhbHVlLCBhc3Quc291cmNlU3Bhbik7XG4gICAgfVxuXG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLmRhc2hDYXNlU2VsZWN0b3JzKSAmJiB0aGlzLmRhc2hDYXNlU2VsZWN0b3JzLmluZGV4T2YoYXR0ck5hbWUpID4gLTEpIHtcbiAgICAgIHJldHVybiBuZXcgSHRtbEF0dHJBc3QoZGFzaENhc2VUb0NhbWVsQ2FzZShhdHRyTmFtZSksIGFzdC52YWx1ZSwgYXN0LnNvdXJjZVNwYW4pO1xuICAgIH1cblxuICAgIHJldHVybiBhc3Q7XG4gIH1cbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIExlZ2FjeUh0bWxQYXJzZXIgZXh0ZW5kcyBIdG1sUGFyc2VyIHtcbiAgcGFyc2Uoc291cmNlQ29udGVudDogc3RyaW5nLCBzb3VyY2VVcmw6IHN0cmluZyxcbiAgICAgICAgcGFyc2VFeHBhbnNpb25Gb3JtczogYm9vbGVhbiA9IGZhbHNlKTogSHRtbFBhcnNlVHJlZVJlc3VsdCB7XG4gICAgbGV0IHRyYW5zZm9ybWVyID0gbmV3IExlZ2FjeUh0bWxBc3RUcmFuc2Zvcm1lcigpO1xuICAgIGxldCBodG1sUGFyc2VUcmVlUmVzdWx0ID0gc3VwZXIucGFyc2Uoc291cmNlQ29udGVudCwgc291cmNlVXJsLCBwYXJzZUV4cGFuc2lvbkZvcm1zKTtcblxuICAgIGxldCByb290Tm9kZXMgPSBodG1sUGFyc2VUcmVlUmVzdWx0LnJvb3ROb2Rlcy5tYXAobm9kZSA9PiBub2RlLnZpc2l0KHRyYW5zZm9ybWVyLCBudWxsKSk7XG5cbiAgICByZXR1cm4gdHJhbnNmb3JtZXIucmV3cml0dGVuQXN0Lmxlbmd0aCA+IDAgP1xuICAgICAgICAgICAgICAgbmV3IEh0bWxQYXJzZVRyZWVSZXN1bHQocm9vdE5vZGVzLCBodG1sUGFyc2VUcmVlUmVzdWx0LmVycm9ycykgOlxuICAgICAgICAgICAgICAgaHRtbFBhcnNlVHJlZVJlc3VsdDtcbiAgfVxufVxuIl19