import { isPresent } from 'angular2/src/facade/lang';
import { ListWrapper, MapWrapper } from 'angular2/src/facade/collection';
export class EventListener {
    constructor(name, callback) {
        this.name = name;
        this.callback = callback;
    }
    ;
}
export class DebugNode {
    constructor(nativeNode, parent, _debugInfo) {
        this._debugInfo = _debugInfo;
        this.nativeNode = nativeNode;
        if (isPresent(parent) && parent instanceof DebugElement) {
            parent.addChild(this);
        }
        else {
            this.parent = null;
        }
        this.listeners = [];
    }
    get injector() { return isPresent(this._debugInfo) ? this._debugInfo.injector : null; }
    get componentInstance() {
        return isPresent(this._debugInfo) ? this._debugInfo.component : null;
    }
    get context() { return isPresent(this._debugInfo) ? this._debugInfo.context : null; }
    get references() {
        return isPresent(this._debugInfo) ? this._debugInfo.references : null;
    }
    get providerTokens() {
        return isPresent(this._debugInfo) ? this._debugInfo.providerTokens : null;
    }
    get source() { return isPresent(this._debugInfo) ? this._debugInfo.source : null; }
    /**
     * Use injector.get(token) instead.
     *
     * @deprecated
     */
    inject(token) { return this.injector.get(token); }
}
export class DebugElement extends DebugNode {
    constructor(nativeNode, parent, _debugInfo) {
        super(nativeNode, parent, _debugInfo);
        this.properties = {};
        this.attributes = {};
        this.childNodes = [];
        this.nativeElement = nativeNode;
    }
    addChild(child) {
        if (isPresent(child)) {
            this.childNodes.push(child);
            child.parent = this;
        }
    }
    removeChild(child) {
        var childIndex = this.childNodes.indexOf(child);
        if (childIndex !== -1) {
            child.parent = null;
            this.childNodes.splice(childIndex, 1);
        }
    }
    insertChildrenAfter(child, newChildren) {
        var siblingIndex = this.childNodes.indexOf(child);
        if (siblingIndex !== -1) {
            var previousChildren = this.childNodes.slice(0, siblingIndex + 1);
            var nextChildren = this.childNodes.slice(siblingIndex + 1);
            this.childNodes =
                ListWrapper.concat(ListWrapper.concat(previousChildren, newChildren), nextChildren);
            for (var i = 0; i < newChildren.length; ++i) {
                var newChild = newChildren[i];
                if (isPresent(newChild.parent)) {
                    newChild.parent.removeChild(newChild);
                }
                newChild.parent = this;
            }
        }
    }
    query(predicate) {
        var results = this.queryAll(predicate);
        return results.length > 0 ? results[0] : null;
    }
    queryAll(predicate) {
        var matches = [];
        _queryElementChildren(this, predicate, matches);
        return matches;
    }
    queryAllNodes(predicate) {
        var matches = [];
        _queryNodeChildren(this, predicate, matches);
        return matches;
    }
    get children() {
        var children = [];
        this.childNodes.forEach((node) => {
            if (node instanceof DebugElement) {
                children.push(node);
            }
        });
        return children;
    }
    triggerEventHandler(eventName, eventObj) {
        this.listeners.forEach((listener) => {
            if (listener.name == eventName) {
                listener.callback(eventObj);
            }
        });
    }
}
export function asNativeElements(debugEls) {
    return debugEls.map((el) => el.nativeElement);
}
function _queryElementChildren(element, predicate, matches) {
    element.childNodes.forEach(node => {
        if (node instanceof DebugElement) {
            if (predicate(node)) {
                matches.push(node);
            }
            _queryElementChildren(node, predicate, matches);
        }
    });
}
function _queryNodeChildren(parentNode, predicate, matches) {
    if (parentNode instanceof DebugElement) {
        parentNode.childNodes.forEach(node => {
            if (predicate(node)) {
                matches.push(node);
            }
            if (node instanceof DebugElement) {
                _queryNodeChildren(node, predicate, matches);
            }
        });
    }
}
// Need to keep the nodes in a global Map so that multiple angular apps are supported.
var _nativeNodeToDebugNode = new Map();
export function getDebugNode(nativeNode) {
    return _nativeNodeToDebugNode.get(nativeNode);
}
export function getAllDebugNodes() {
    return MapWrapper.values(_nativeNodeToDebugNode);
}
export function indexDebugNode(node) {
    _nativeNodeToDebugNode.set(node.nativeNode, node);
}
export function removeDebugNodeFromIndex(node) {
    _nativeNodeToDebugNode.delete(node.nativeNode);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWdfbm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtZ3RNN1FoRW4udG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2RlYnVnL2RlYnVnX25vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxTQUFTLEVBQU8sTUFBTSwwQkFBMEI7T0FDakQsRUFBWSxXQUFXLEVBQUUsVUFBVSxFQUFDLE1BQU0sZ0NBQWdDO0FBSWpGO0lBQTZCLFlBQW1CLElBQVksRUFBUyxRQUFrQjtRQUF2QyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBVTtJQUFFLENBQUM7O0FBQUUsQ0FBQztBQUU3RjtJQUtFLFlBQVksVUFBZSxFQUFFLE1BQWlCLEVBQVUsVUFBMkI7UUFBM0IsZUFBVSxHQUFWLFVBQVUsQ0FBaUI7UUFDakYsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLE1BQU0sWUFBWSxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDckIsQ0FBQztRQUNELElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFJLFFBQVEsS0FBZSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRWpHLElBQUksaUJBQWlCO1FBQ25CLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFV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WUFDaEMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEIsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyQixDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxZQUFZLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLGtCQUFrQixDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDL0MsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztBQUNILENBQUM7QUFFRCxzRkFBc0Y7QUFDdEYsSUFBSSxzQkFBc0IsR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztBQUV2RCw2QkFBNkIsVUFBZTtJQUMxQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2hELENBQUM7QUFFRDtJQUNFLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDbkQsQ0FBQztBQUVELCtCQUErQixJQUFlO0lBQzVDLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3BELENBQUM7QUFFRCx5Q0FBeUMsSUFBZTtJQUN0RCxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2pELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzUHJlc2VudCwgVHlwZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7UHJlZGljYXRlLCBMaXN0V3JhcHBlciwgTWFwV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7SW5qZWN0b3J9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcbmltcG9ydCB7UmVuZGVyRGVidWdJbmZvfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9yZW5kZXIvYXBpJztcblxuZXhwb3J0IGNsYXNzIEV2ZW50TGlzdGVuZXIgeyBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgY2FsbGJhY2s6IEZ1bmN0aW9uKXt9OyB9XG5cbmV4cG9ydCBjbGFzcyBEZWJ1Z05vZGUge1xuICBuYXRpdmVOb2RlOiBhbnk7XG4gIGxpc3RlbmVyczogRXZlbnRMaXN0ZW5lcltdO1xuICBwYXJlbnQ6IERlYnVnRWxlbWVudDtcblxuICBjb25zdHJ1Y3RvcihuYXRpdmVOb2RlOiBhbnksIHBhcmVudDogRGVidWdOb2RlLCBwcml2YXRlIF9kZWJ1Z0luZm86IFJlbmRlckRlYnVnSW5mbykge1xuICAgIHRoaXMubmF0aXZlTm9kZSA9IG5hdGl2ZU5vZGU7XG4gICAgaWYgKGlzUHJlc2VudChwYXJlbnQpICYmIHBhcmVudCBpbnN0YW5jZW9mIERlYnVnRWxlbWVudCkge1xuICAgICAgcGFyZW50LmFkZENoaWxkKHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMubGlzdGVuZXJzID0gW107XG4gIH1cblxuICBnZXQgaW5qZWN0b3IoKTogSW5qZWN0b3IgeyByZXR1cm4gaXNQcmVzZW50KHRoaXMuX2RlYnVnSW5mbykgPyB0aGlzLl9kZWJ1Z0luZm8uaW5qZWN0b3IgOiBudWxsOyB9XG5cbiAgZ2V0IGNvbXBvbmVudEluc3RhbmNlKCk6IGFueSB7XG4gICAgcmV0dXJuIGlzUHJlc2VudCh0aGlzLl9kZWJ1Z0luZm8pID8gdGhpcy5fZGVidWdJbmZvLmNvbXBvbmVudCA6IG51bGw7XG4gIH1cblxuICBnZXQgY29udGV4dCgpOiBhbnkgeyByZXR1cm4gaXNQcmVzZW50KHRoaXMuX2RlYnVnSW5mbykgPyB0aGlzLl9kZWJ1Z0luZm8uY29udGV4dCA6IG51bGw7IH1cblxuICBnZXQgcmVmZXJlbmNlcygpOiB7W2tleTogc3RyaW5nXTogYW55fSB7XG4gICAgcmV0dXJuIGlzUHJlc2VudCh0aGlzLl9kZWJ1Z0luZm8pID8gdGhpcy5fZGVidWdJbmZvLnJlZmVyZW5jZXMgOiBudWxsO1xuICB9XG5cbiAgZ2V0IHByb3ZpZGVyVG9rZW5zKCk6IGFueVtdIHtcbiAgICByZXR1cm4gaXNQcmVzZW50KHRoaXMuX2RlYnVnSW5mbykgPyB0aGlzLl9kZWJ1Z0luZm8ucHJvdmlkZXJUb2tlbnMgOiBudWxsO1xuICB9XG5cbiAgZ2V0IHNvdXJjZSgpOiBzdHJpbmcgeyByZXR1cm4gaXNQcmVzZW50KHRoaXMuX2RlYnVnSW5mbykgPyB0aGlzLl9kZWJ1Z0luZm8uc291cmNlIDogbnVsbDsgfVxuXG4gIC8qKlxuICAgKiBVc2UgaW5qZWN0b3IuZ2V0KHRva2VuKSBpbnN0ZWFkLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKi9cbiAgaW5qZWN0KHRva2VuOiBhbnkpOiBhbnkgeyByZXR1cm4gdGhpcy5pbmplY3Rvci5nZXQodG9rZW4pOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBEZWJ1Z0VsZW1lbnQgZXh0ZW5kcyBEZWJ1Z05vZGUge1xuICBuYW1lOiBzdHJpbmc7XG4gIHByb3BlcnRpZXM6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9O1xuICBhdHRyaWJ1dGVzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfTtcbiAgY2hpbGROb2RlczogRGVidWdOb2RlW107XG4gIG5hdGl2ZUVsZW1lbnQ6IGFueTtcblxuICBjb25zdHJ1Y3RvcihuYXRpdmVOb2RlOiBhbnksIHBhcmVudDogYW55LCBfZGVidWdJbmZvOiBSZW5kZXJEZWJ1Z0luZm8pIHtcbiAgICBzdXBlcihuYXRpdmVOb2RlLCBwYXJlbnQsIF9kZWJ1Z0luZm8pO1xuICAgIHRoaXMucHJvcGVydGllcyA9IHt9O1xuICAgIHRoaXMuYXR0cmlidXRlcyA9IHt9O1xuICAgIHRoaXMuY2hpbGROb2RlcyA9IFtdO1xuICAgIHRoaXMubmF0aXZlRWxlbWVudCA9IG5hdGl2ZU5vZGU7XG4gIH1cblxuICBhZGRDaGlsZChjaGlsZDogRGVidWdOb2RlKSB7XG4gICAgaWYgKGlzUHJlc2VudChjaGlsZCkpIHtcbiAgICAgIHRoaXMuY2hpbGROb2Rlcy5wdXNoKGNoaWxkKTtcbiAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlQ2hpbGQoY2hpbGQ6IERlYnVnTm9kZSkge1xuICAgIHZhciBjaGlsZEluZGV4ID0gdGhpcy5jaGlsZE5vZGVzLmluZGV4T2YoY2hpbGQpO1xuICAgIGlmIChjaGlsZEluZGV4ICE9PSAtMSkge1xuICAgICAgY2hpbGQucGFyZW50ID0gbnVsbDtcbiAgICAgIHRoaXMuY2hpbGROb2Rlcy5zcGxpY2UoY2hpbGRJbmRleCwgMSk7XG4gICAgfVxuICB9XG5cbiAgaW5zZXJ0Q2hpbGRyZW5BZnRlcihjaGlsZDogRGVidWdOb2RlLCBuZXdDaGlsZHJlbjogRGVidWdOb2RlW10pIHtcbiAgICB2YXIgc2libGluZ0luZGV4ID0gdGhpcy5jaGlsZE5vZGVzLmluZGV4T2YoY2hpbGQpO1xuICAgIGlmIChzaWJsaW5nSW5kZXggIT09IC0xKSB7XG4gICAgICB2YXIgcHJldmlvdXNDaGlsZHJlbiA9IHRoaXMuY2hpbGROb2Rlcy5zbGljZSgwLCBzaWJsaW5nSW5kZXggKyAxKTtcbiAgICAgIHZhciBuZXh0Q2hpbGRyZW4gPSB0aGlzLmNoaWxkTm9kZXMuc2xpY2Uoc2libGluZ0luZGV4ICsgMSk7XG4gICAgICB0aGlzLmNoaWxkTm9kZXMgPVxuICAgICAgICAgIExpc3RXcmFwcGVyLmNvbmNhdChMaXN0V3JhcHBlci5jb25jYXQocHJldmlvdXNDaGlsZHJlbiwgbmV3Q2hpbGRyZW4pLCBuZXh0Q2hpbGRyZW4pO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXdDaGlsZHJlbi5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgbmV3Q2hpbGQgPSBuZXdDaGlsZHJlbltpXTtcbiAgICAgICAgaWYgKGlzUHJlc2VudChuZXdDaGlsZC5wYXJlbnQpKSB7XG4gICAgICAgICAgbmV3Q2hpbGQucGFyZW50LnJlbW92ZUNoaWxkKG5ld0NoaWxkKTtcbiAgICAgICAgfVxuICAgICAgICBuZXdDaGlsZC5wYXJlbnQgPSB0aGlzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHF1ZXJ5KHByZWRpY2F0ZTogUHJlZGljYXRlPERlYnVnRWxlbWVudD4pOiBEZWJ1Z0VsZW1lbnQge1xuICAgIHZhciByZXN1bHRzID0gdGhpcy5xdWVyeUFsbChwcmVkaWNhdGUpO1xuICAgIHJldHVybiByZXN1bHRzLmxlbmd0aCA+IDAgPyByZXN1bHRzWzBdIDogbnVsbDtcbiAgfVxuXG4gIHF1ZXJ5QWxsKHByZWRpY2F0ZTogUHJlZGljYXRlPERlYnVnRWxlbWVudD4pOiBEZWJ1Z0VsZW1lbnRbXSB7XG4gICAgdmFyIG1hdGNoZXM6IERlYnVnRWxlbWVudFtdID0gW107XG4gICAgX3F1ZXJ5RWxlbWVudENoaWxkcmVuKHRoaXMsIHByZWRpY2F0ZSwgbWF0Y2hlcyk7XG4gICAgcmV0dXJuIG1hdGNoZXM7XG4gIH1cblxuICBxdWVyeUFsbE5vZGVzKHByZWRpY2F0ZTogUHJlZGljYXRlPERlYnVnTm9kZT4pOiBEZWJ1Z05vZGVbXSB7XG4gICAgdmFyIG1hdGNoZXM6IERlYnVnTm9kZVtdID0gW107XG4gICAgX3F1ZXJ5Tm9kZUNoaWxkcmVuKHRoaXMsIHByZWRpY2F0ZSwgbWF0Y2hlcyk7XG4gICAgcmV0dXJuIG1hdGNoZXM7XG4gIH1cblxuICBnZXQgY2hpbGRyZW4oKTogRGVidWdFbGVtZW50W10ge1xuICAgIHZhciBjaGlsZHJlbjogRGVidWdFbGVtZW50W10gPSBbXTtcbiAgICB0aGlzLmNoaWxkTm9kZXMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBEZWJ1Z0VsZW1lbnQpIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cblxuICB0cmlnZ2VyRXZlbnRIYW5kbGVyKGV2ZW50TmFtZTogc3RyaW5nLCBldmVudE9iajogYW55KSB7XG4gICAgdGhpcy5saXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIpID0+IHtcbiAgICAgIGlmIChsaXN0ZW5lci5uYW1lID09IGV2ZW50TmFtZSkge1xuICAgICAgICBsaXN0ZW5lci5jYWxsYmFjayhldmVudE9iaik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzTmF0aXZlRWxlbWVudHMoZGVidWdFbHM6IERlYnVnRWxlbWVudFtdKTogYW55IHtcbiAgcmV0dXJuIGRlYnVnRWxzLm1hcCgoZWwpID0+IGVsLm5hdGl2ZUVsZW1lbnQpO1xufVxuXG5mdW5jdGlvbiBfcXVlcnlFbGVtZW50Q2hpbGRyZW4oZWxlbWVudDogRGVidWdFbGVtZW50LCBwcmVkaWNhdGU6IFByZWRpY2F0ZTxEZWJ1Z0VsZW1lbnQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoZXM6IERlYnVnRWxlbWVudFtdKSB7XG4gIGVsZW1lbnQuY2hpbGROb2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgIGlmIChub2RlIGluc3RhbmNlb2YgRGVidWdFbGVtZW50KSB7XG4gICAgICBpZiAocHJlZGljYXRlKG5vZGUpKSB7XG4gICAgICAgIG1hdGNoZXMucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICAgIF9xdWVyeUVsZW1lbnRDaGlsZHJlbihub2RlLCBwcmVkaWNhdGUsIG1hdGNoZXMpO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIF9xdWVyeU5vZGVDaGlsZHJlbihwYXJlbnROb2RlOiBEZWJ1Z05vZGUsIHByZWRpY2F0ZTogUHJlZGljYXRlPERlYnVnTm9kZT4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hlczogRGVidWdOb2RlW10pIHtcbiAgaWYgKHBhcmVudE5vZGUgaW5zdGFuY2VvZiBEZWJ1Z0VsZW1lbnQpIHtcbiAgICBwYXJlbnROb2RlLmNoaWxkTm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgIGlmIChwcmVkaWNhdGUobm9kZSkpIHtcbiAgICAgICAgbWF0Y2hlcy5wdXNoKG5vZGUpO1xuICAgICAgfVxuICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBEZWJ1Z0VsZW1lbnQpIHtcbiAgICAgICAgX3F1ZXJ5Tm9kZUNoaWxkcmVuKG5vZGUsIHByZWRpY2F0ZSwgbWF0Y2hlcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuLy8gTmVlZCB0byBrZWVwIHRoZSBub2RlcyBpbiBhIGdsb2JhbCBNYXAgc28gdGhhdCBtdWx0aXBsZSBhbmd1bGFyIGFwcHMgYXJlIHN1cHBvcnRlZC5cbnZhciBfbmF0aXZlTm9kZVRvRGVidWdOb2RlID0gbmV3IE1hcDxhbnksIERlYnVnTm9kZT4oKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldERlYnVnTm9kZShuYXRpdmVOb2RlOiBhbnkpOiBEZWJ1Z05vZGUge1xuICByZXR1cm4gX25hdGl2ZU5vZGVUb0RlYnVnTm9kZS5nZXQobmF0aXZlTm9kZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbGxEZWJ1Z05vZGVzKCk6IERlYnVnTm9kZVtdIHtcbiAgcmV0dXJuIE1hcFdyYXBwZXIudmFsdWVzKF9uYXRpdmVOb2RlVG9EZWJ1Z05vZGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5kZXhEZWJ1Z05vZGUobm9kZTogRGVidWdOb2RlKSB7XG4gIF9uYXRpdmVOb2RlVG9EZWJ1Z05vZGUuc2V0KG5vZGUubmF0aXZlTm9kZSwgbm9kZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVEZWJ1Z05vZGVGcm9tSW5kZXgobm9kZTogRGVidWdOb2RlKSB7XG4gIF9uYXRpdmVOb2RlVG9EZWJ1Z05vZGUuZGVsZXRlKG5vZGUubmF0aXZlTm9kZSk7XG59XG4iXX0=