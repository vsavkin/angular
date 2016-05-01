import { isPresent } from 'angular2/src/facade/lang';
import { DebugNode, DebugElement, EventListener, getDebugNode, indexDebugNode, removeDebugNodeFromIndex } from 'angular2/src/core/debug/debug_node';
export class DebugDomRootRenderer {
    constructor(_delegate) {
        this._delegate = _delegate;
    }
    renderComponent(componentProto) {
        return new DebugDomRenderer(this._delegate.renderComponent(componentProto));
    }
}
export class DebugDomRenderer {
    constructor(_delegate) {
        this._delegate = _delegate;
    }
    selectRootElement(selectorOrNode, debugInfo) {
        var nativeEl = this._delegate.selectRootElement(selectorOrNode, debugInfo);
        var debugEl = new DebugElement(nativeEl, null, debugInfo);
        indexDebugNode(debugEl);
        return nativeEl;
    }
    createElement(parentElement, name, debugInfo) {
        var nativeEl = this._delegate.createElement(parentElement, name, debugInfo);
        var debugEl = new DebugElement(nativeEl, getDebugNode(parentElement), debugInfo);
        debugEl.name = name;
        indexDebugNode(debugEl);
        return nativeEl;
    }
    createViewRoot(hostElement) { return this._delegate.createViewRoot(hostElement); }
    createTemplateAnchor(parentElement, debugInfo) {
        var comment = this._delegate.createTemplateAnchor(parentElement, debugInfo);
        var debugEl = new DebugNode(comment, getDebugNode(parentElement), debugInfo);
        indexDebugNode(debugEl);
        return comment;
    }
    createText(parentElement, value, debugInfo) {
        var text = this._delegate.createText(parentElement, value, debugInfo);
        var debugEl = new DebugNode(text, getDebugNode(parentElement), debugInfo);
        indexDebugNode(debugEl);
        return text;
    }
    projectNodes(parentElement, nodes) {
        var debugParent = getDebugNode(parentElement);
        if (isPresent(debugParent) && debugParent instanceof DebugElement) {
            let debugElement = debugParent;
            nodes.forEach((node) => { debugElement.addChild(getDebugNode(node)); });
        }
        this._delegate.projectNodes(parentElement, nodes);
    }
    attachViewAfter(node, viewRootNodes) {
        var debugNode = getDebugNode(node);
        if (isPresent(debugNode)) {
            var debugParent = debugNode.parent;
            if (viewRootNodes.length > 0 && isPresent(debugParent)) {
                var debugViewRootNodes = [];
                viewRootNodes.forEach((rootNode) => debugViewRootNodes.push(getDebugNode(rootNode)));
                debugParent.insertChildrenAfter(debugNode, debugViewRootNodes);
            }
        }
        this._delegate.attachViewAfter(node, viewRootNodes);
    }
    detachView(viewRootNodes) {
        viewRootNodes.forEach((node) => {
            var debugNode = getDebugNode(node);
            if (isPresent(debugNode) && isPresent(debugNode.parent)) {
                debugNode.parent.removeChild(debugNode);
            }
        });
        this._delegate.detachView(viewRootNodes);
    }
    destroyView(hostElement, viewAllNodes) {
        viewAllNodes.forEach((node) => { removeDebugNodeFromIndex(getDebugNode(node)); });
        this._delegate.destroyView(hostElement, viewAllNodes);
    }
    listen(renderElement, name, callback) {
        var debugEl = getDebugNode(renderElement);
        if (isPresent(debugEl)) {
            debugEl.listeners.push(new EventListener(name, callback));
        }
        return this._delegate.listen(renderElement, name, callback);
    }
    listenGlobal(target, name, callback) {
        return this._delegate.listenGlobal(target, name, callback);
    }
    setElementProperty(renderElement, propertyName, propertyValue) {
        var debugEl = getDebugNode(renderElement);
        if (isPresent(debugEl) && debugEl instanceof DebugElement) {
            debugEl.properties[propertyName] = propertyValue;
        }
        this._delegate.setElementProperty(renderElement, propertyName, propertyValue);
    }
    setElementAttribute(renderElement, attributeName, attributeValue) {
        var debugEl = getDebugNode(renderElement);
        if (isPresent(debugEl) && debugEl instanceof DebugElement) {
            debugEl.attributes[attributeName] = attributeValue;
        }
        this._delegate.setElementAttribute(renderElement, attributeName, attributeValue);
    }
    setBindingDebugInfo(renderElement, propertyName, propertyValue) {
        this._delegate.setBindingDebugInfo(renderElement, propertyName, propertyValue);
    }
    setElementClass(renderElement, className, isAdd) {
        this._delegate.setElementClass(renderElement, className, isAdd);
    }
    setElementStyle(renderElement, styleName, styleValue) {
        this._delegate.setElementStyle(renderElement, styleName, styleValue);
    }
    invokeElementMethod(renderElement, methodName, args) {
        this._delegate.invokeElementMethod(renderElement, methodName, args);
    }
    setText(renderNode, text) { this._delegate.setText(renderNode, text); }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWdfcmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLWd0TTdRaEVuLnRtcC9hbmd1bGFyMi9zcmMvY29yZS9kZWJ1Zy9kZWJ1Z19yZW5kZXJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQjtPQU8zQyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osYUFBYSxFQUNiLFlBQVksRUFDWixjQUFjLEVBQ2Qsd0JBQXdCLEVBQ3pCLE1BQU0sb0NBQW9DO0FBRTNDO0lBQ0UsWUFBb0IsU0FBdUI7UUFBdkIsY0FBUyxHQUFULFNBQVMsQ0FBYztJQUFHLENBQUM7SUFFL0MsZUFBZSxDQUFDLGNBQW1DO1FBQ2pELE1BQU0sQ0FBQyxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDOUUsQ0FBQztBQUNILENBQUM7QUFFRDtJQUNFLFlBQW9CLFNBQW1CO1FBQW5CLGNBQVMsR0FBVCxTQUFTLENBQVU7SUFBRyxDQUFDO0lBRTNDLGlCQUFpQixDQUFDLGNBQTRCLEVBQUUsU0FBMEI7UUFDeEUsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDM0UsSUFBSSxPQUFPLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMxRCxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEIsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBRUQsYUFBYSxDQUFDLGFBQWtCLEVBQUUsSUFBWSxFQUFFLFNBQTBCO1FBQ3hFLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDNUUsSUFBSSxPQUFPLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxhQUFhLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNqRixPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNwQixjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEIsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBRUQsY0FBYyxDQUFDLFdBQWdCLElBQVMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU1RixvQkFBb0IsQ0FBQyxhQUFrQixFQUFFLFNBQTBCO1FBQ2pFLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzVFLElBQUksT0FBTyxHQUFHLElBQUksU0FBUyxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsYUFBYSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDN0UsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVELFVBQVUsQ0FBQyxhQUFrQixFQUFFLEtBQWEsRUFBRSxTQUEwQjtRQUN0RSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksT0FBTyxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsYUFBYSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDMUUsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsWUFBWSxDQUFDLGFBQWtCLEVBQUUsS0FBWTtRQUMzQyxJQUFJLFdBQVcsR0FBRyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDOUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLFdBQVcsWUFBWSxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLElBQUksWUFBWSxHQUFHLFdBQVcsQ0FBQztZQUMvQixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxPQUFPLFlBQVksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRSxDQUFDO1FBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCxlQUFlLENBQUMsSUFBUyxFQUFFLGFBQW9CO1FBQzdDLElBQUksU0FBUyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLElBQUksV0FBVyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7WUFDbkMsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkQsSUFBSSxrQkFBa0IsR0FBZ0IsRUFBRSxDQUFDO2dCQUN6QyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxLQUFLLGtCQUFrQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyRixXQUFXLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLGtCQUFrQixDQUFDLENBQUM7WUFDakUsQ0FBQztRQUNILENBQUM7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELFVBQVUsQ0FBQyxhQUFvQjtRQUM3QixhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSTtZQUN6QixJQUFJLFNBQVMsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxTQUFTLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMxQyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsV0FBVyxDQUFDLFdBQWdCLEVBQUUsWUFBbUI7UUFDL0MsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksT0FBTyx3QkFBd0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xGLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQsTUFBTSxDQUFDLGFBQWtCLEVBQUUsSUFBWSxFQUFFLFFBQWtCO1FBQ3pELElBQUksT0FBTyxHQUFHLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMxQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksYUFBYSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzVELENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQsWUFBWSxDQUFDLE1BQWMsRUFBRSxJQUFZLEVBQUUsUUFBa0I7UUFDM0QsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELGtCQUFrQixDQUFDLGFBQWtCLEVBQUUsWUFBb0IsRUFBRSxhQUFrQjtRQUM3RSxJQUFJLE9BQU8sR0FBRyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDMUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE9BQU8sWUFBWSxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQzFELE9BQU8sQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEdBQUcsYUFBYSxDQUFDO1FBQ25ELENBQUM7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDaEYsQ0FBQztJQUVELG1CQUFtQixDQUFDLGFBQWtCLEVBQUUsYUFBcUIsRUFBRSxjQUFzQjtRQUNuRixJQUFJLE9BQU8sR0FBRyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDMUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE9BQU8sWUFBWSxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQzFELE9BQU8sQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEdBQUcsY0FBYyxDQUFDO1FBQ3JELENBQUM7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxhQUFhLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDbkYsQ0FBQztJQUVELG1CQUFtQixDQUFDLGFBQWtCLEVBQUUsWUFBb0IsRUFBRSxhQUFxQjtRQUNqRixJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDakYsQ0FBQztJQUVELGVBQWUsQ0FBQyxhQUFrQixFQUFFLFNBQWlCLEVBQUUsS0FBYztRQUNuRSxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRCxlQUFlLENBQUMsYUFBa0IsRUFBRSxTQUFpQixFQUFFLFVBQWtCO1FBQ3ZFLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVELG1CQUFtQixDQUFDLGFBQWtCLEVBQUUsVUFBa0IsRUFBRSxJQUFXO1FBQ3JFLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRUQsT0FBTyxDQUFDLFVBQWUsRUFBRSxJQUFZLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0RixDQUFDO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzUHJlc2VudH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7XG4gIFJlbmRlcmVyLFxuICBSb290UmVuZGVyZXIsXG4gIFJlbmRlckNvbXBvbmVudFR5cGUsXG4gIFJlbmRlckRlYnVnSW5mb1xufSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9yZW5kZXIvYXBpJztcbmltcG9ydCB7XG4gIERlYnVnTm9kZSxcbiAgRGVidWdFbGVtZW50LFxuICBFdmVudExpc3RlbmVyLFxuICBnZXREZWJ1Z05vZGUsXG4gIGluZGV4RGVidWdOb2RlLFxuICByZW1vdmVEZWJ1Z05vZGVGcm9tSW5kZXhcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGVidWcvZGVidWdfbm9kZSc7XG5cbmV4cG9ydCBjbGFzcyBEZWJ1Z0RvbVJvb3RSZW5kZXJlciBpbXBsZW1lbnRzIFJvb3RSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RlbGVnYXRlOiBSb290UmVuZGVyZXIpIHt9XG5cbiAgcmVuZGVyQ29tcG9uZW50KGNvbXBvbmVudFByb3RvOiBSZW5kZXJDb21wb25lbnRUeXBlKTogUmVuZGVyZXIge1xuICAgIHJldHVybiBuZXcgRGVidWdEb21SZW5kZXJlcih0aGlzLl9kZWxlZ2F0ZS5yZW5kZXJDb21wb25lbnQoY29tcG9uZW50UHJvdG8pKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGVidWdEb21SZW5kZXJlciBpbXBsZW1lbnRzIFJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZGVsZWdhdGU6IFJlbmRlcmVyKSB7fVxuXG4gIHNlbGVjdFJvb3RFbGVtZW50KHNlbGVjdG9yT3JOb2RlOiBzdHJpbmcgfCBhbnksIGRlYnVnSW5mbzogUmVuZGVyRGVidWdJbmZvKTogYW55IHtcbiAgICB2YXIgbmF0aXZlRWwgPSB0aGlzLl9kZWxlZ2F0ZS5zZWxlY3RSb290RWxlbWVudChzZWxlY3Rvck9yTm9kZSwgZGVidWdJbmZvKTtcbiAgICB2YXIgZGVidWdFbCA9IG5ldyBEZWJ1Z0VsZW1lbnQobmF0aXZlRWwsIG51bGwsIGRlYnVnSW5mbyk7XG4gICAgaW5kZXhEZWJ1Z05vZGUoZGVidWdFbCk7XG4gICAgcmV0dXJuIG5hdGl2ZUVsO1xuICB9XG5cbiAgY3JlYXRlRWxlbWVudChwYXJlbnRFbGVtZW50OiBhbnksIG5hbWU6IHN0cmluZywgZGVidWdJbmZvOiBSZW5kZXJEZWJ1Z0luZm8pOiBhbnkge1xuICAgIHZhciBuYXRpdmVFbCA9IHRoaXMuX2RlbGVnYXRlLmNyZWF0ZUVsZW1lbnQocGFyZW50RWxlbWVudCwgbmFtZSwgZGVidWdJbmZvKTtcbiAgICB2YXIgZGVidWdFbCA9IG5ldyBEZWJ1Z0VsZW1lbnQobmF0aXZlRWwsIGdldERlYnVnTm9kZShwYXJlbnRFbGVtZW50KSwgZGVidWdJbmZvKTtcbiAgICBkZWJ1Z0VsLm5hbWUgPSBuYW1lO1xuICAgIGluZGV4RGVidWdOb2RlKGRlYnVnRWwpO1xuICAgIHJldHVybiBuYXRpdmVFbDtcbiAgfVxuXG4gIGNyZWF0ZVZpZXdSb290KGhvc3RFbGVtZW50OiBhbnkpOiBhbnkgeyByZXR1cm4gdGhpcy5fZGVsZWdhdGUuY3JlYXRlVmlld1Jvb3QoaG9zdEVsZW1lbnQpOyB9XG5cbiAgY3JlYXRlVGVtcGxhdGVBbmNob3IocGFyZW50RWxlbWVudDogYW55LCBkZWJ1Z0luZm86IFJlbmRlckRlYnVnSW5mbyk6IGFueSB7XG4gICAgdmFyIGNvbW1lbnQgPSB0aGlzLl9kZWxlZ2F0ZS5jcmVhdGVUZW1wbGF0ZUFuY2hvcihwYXJlbnRFbGVtZW50LCBkZWJ1Z0luZm8pO1xuICAgIHZhciBkZWJ1Z0VsID0gbmV3IERlYnVnTm9kZShjb21tZW50LCBnZXREZWJ1Z05vZGUocGFyZW50RWxlbWVudCksIGRlYnVnSW5mbyk7XG4gICAgaW5kZXhEZWJ1Z05vZGUoZGVidWdFbCk7XG4gICAgcmV0dXJuIGNvbW1lbnQ7XG4gIH1cblxuICBjcmVhdGVUZXh0KHBhcmVudEVsZW1lbnQ6IGFueSwgdmFsdWU6IHN0cmluZywgZGVidWdJbmZvOiBSZW5kZXJEZWJ1Z0luZm8pOiBhbnkge1xuICAgIHZhciB0ZXh0ID0gdGhpcy5fZGVsZWdhdGUuY3JlYXRlVGV4dChwYXJlbnRFbGVtZW50LCB2YWx1ZSwgZGVidWdJbmZvKTtcbiAgICB2YXIgZGVidWdFbCA9IG5ldyBEZWJ1Z05vZGUodGV4dCwgZ2V0RGVidWdOb2RlKHBhcmVudEVsZW1lbnQpLCBkZWJ1Z0luZm8pO1xuICAgIGluZGV4RGVidWdOb2RlKGRlYnVnRWwpO1xuICAgIHJldHVybiB0ZXh0O1xuICB9XG5cbiAgcHJvamVjdE5vZGVzKHBhcmVudEVsZW1lbnQ6IGFueSwgbm9kZXM6IGFueVtdKSB7XG4gICAgdmFyIGRlYnVnUGFyZW50ID0gZ2V0RGVidWdOb2RlKHBhcmVudEVsZW1lbnQpO1xuICAgIGlmIChpc1ByZXNlbnQoZGVidWdQYXJlbnQpICYmIGRlYnVnUGFyZW50IGluc3RhbmNlb2YgRGVidWdFbGVtZW50KSB7XG4gICAgICBsZXQgZGVidWdFbGVtZW50ID0gZGVidWdQYXJlbnQ7XG4gICAgICBub2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7IGRlYnVnRWxlbWVudC5hZGRDaGlsZChnZXREZWJ1Z05vZGUobm9kZSkpOyB9KTtcbiAgICB9XG4gICAgdGhpcy5fZGVsZWdhdGUucHJvamVjdE5vZGVzKHBhcmVudEVsZW1lbnQsIG5vZGVzKTtcbiAgfVxuXG4gIGF0dGFjaFZpZXdBZnRlcihub2RlOiBhbnksIHZpZXdSb290Tm9kZXM6IGFueVtdKSB7XG4gICAgdmFyIGRlYnVnTm9kZSA9IGdldERlYnVnTm9kZShub2RlKTtcbiAgICBpZiAoaXNQcmVzZW50KGRlYnVnTm9kZSkpIHtcbiAgICAgIHZhciBkZWJ1Z1BhcmVudCA9IGRlYnVnTm9kZS5wYXJlbnQ7XG4gICAgICBpZiAodmlld1Jvb3ROb2Rlcy5sZW5ndGggPiAwICYmIGlzUHJlc2VudChkZWJ1Z1BhcmVudCkpIHtcbiAgICAgICAgdmFyIGRlYnVnVmlld1Jvb3ROb2RlczogRGVidWdOb2RlW10gPSBbXTtcbiAgICAgICAgdmlld1Jvb3ROb2Rlcy5mb3JFYWNoKChyb290Tm9kZSkgPT4gZGVidWdWaWV3Um9vdE5vZGVzLnB1c2goZ2V0RGVidWdOb2RlKHJvb3ROb2RlKSkpO1xuICAgICAgICBkZWJ1Z1BhcmVudC5pbnNlcnRDaGlsZHJlbkFmdGVyKGRlYnVnTm9kZSwgZGVidWdWaWV3Um9vdE5vZGVzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5fZGVsZWdhdGUuYXR0YWNoVmlld0FmdGVyKG5vZGUsIHZpZXdSb290Tm9kZXMpO1xuICB9XG5cbiAgZGV0YWNoVmlldyh2aWV3Um9vdE5vZGVzOiBhbnlbXSkge1xuICAgIHZpZXdSb290Tm9kZXMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgdmFyIGRlYnVnTm9kZSA9IGdldERlYnVnTm9kZShub2RlKTtcbiAgICAgIGlmIChpc1ByZXNlbnQoZGVidWdOb2RlKSAmJiBpc1ByZXNlbnQoZGVidWdOb2RlLnBhcmVudCkpIHtcbiAgICAgICAgZGVidWdOb2RlLnBhcmVudC5yZW1vdmVDaGlsZChkZWJ1Z05vZGUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuX2RlbGVnYXRlLmRldGFjaFZpZXcodmlld1Jvb3ROb2Rlcyk7XG4gIH1cblxuICBkZXN0cm95Vmlldyhob3N0RWxlbWVudDogYW55LCB2aWV3QWxsTm9kZXM6IGFueVtdKSB7XG4gICAgdmlld0FsbE5vZGVzLmZvckVhY2goKG5vZGUpID0+IHsgcmVtb3ZlRGVidWdOb2RlRnJvbUluZGV4KGdldERlYnVnTm9kZShub2RlKSk7IH0pO1xuICAgIHRoaXMuX2RlbGVnYXRlLmRlc3Ryb3lWaWV3KGhvc3RFbGVtZW50LCB2aWV3QWxsTm9kZXMpO1xuICB9XG5cbiAgbGlzdGVuKHJlbmRlckVsZW1lbnQ6IGFueSwgbmFtZTogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24pOiBGdW5jdGlvbiB7XG4gICAgdmFyIGRlYnVnRWwgPSBnZXREZWJ1Z05vZGUocmVuZGVyRWxlbWVudCk7XG4gICAgaWYgKGlzUHJlc2VudChkZWJ1Z0VsKSkge1xuICAgICAgZGVidWdFbC5saXN0ZW5lcnMucHVzaChuZXcgRXZlbnRMaXN0ZW5lcihuYW1lLCBjYWxsYmFjaykpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fZGVsZWdhdGUubGlzdGVuKHJlbmRlckVsZW1lbnQsIG5hbWUsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGxpc3Rlbkdsb2JhbCh0YXJnZXQ6IHN0cmluZywgbmFtZTogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24pOiBGdW5jdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuX2RlbGVnYXRlLmxpc3Rlbkdsb2JhbCh0YXJnZXQsIG5hbWUsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHNldEVsZW1lbnRQcm9wZXJ0eShyZW5kZXJFbGVtZW50OiBhbnksIHByb3BlcnR5TmFtZTogc3RyaW5nLCBwcm9wZXJ0eVZhbHVlOiBhbnkpIHtcbiAgICB2YXIgZGVidWdFbCA9IGdldERlYnVnTm9kZShyZW5kZXJFbGVtZW50KTtcbiAgICBpZiAoaXNQcmVzZW50KGRlYnVnRWwpICYmIGRlYnVnRWwgaW5zdGFuY2VvZiBEZWJ1Z0VsZW1lbnQpIHtcbiAgICAgIGRlYnVnRWwucHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gcHJvcGVydHlWYWx1ZTtcbiAgICB9XG4gICAgdGhpcy5fZGVsZWdhdGUuc2V0RWxlbWVudFByb3BlcnR5KHJlbmRlckVsZW1lbnQsIHByb3BlcnR5TmFtZSwgcHJvcGVydHlWYWx1ZSk7XG4gIH1cblxuICBzZXRFbGVtZW50QXR0cmlidXRlKHJlbmRlckVsZW1lbnQ6IGFueSwgYXR0cmlidXRlTmFtZTogc3RyaW5nLCBhdHRyaWJ1dGVWYWx1ZTogc3RyaW5nKSB7XG4gICAgdmFyIGRlYnVnRWwgPSBnZXREZWJ1Z05vZGUocmVuZGVyRWxlbWVudCk7XG4gICAgaWYgKGlzUHJlc2VudChkZWJ1Z0VsKSAmJiBkZWJ1Z0VsIGluc3RhbmNlb2YgRGVidWdFbGVtZW50KSB7XG4gICAgICBkZWJ1Z0VsLmF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPSBhdHRyaWJ1dGVWYWx1ZTtcbiAgICB9XG4gICAgdGhpcy5fZGVsZWdhdGUuc2V0RWxlbWVudEF0dHJpYnV0ZShyZW5kZXJFbGVtZW50LCBhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gIH1cblxuICBzZXRCaW5kaW5nRGVidWdJbmZvKHJlbmRlckVsZW1lbnQ6IGFueSwgcHJvcGVydHlOYW1lOiBzdHJpbmcsIHByb3BlcnR5VmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX2RlbGVnYXRlLnNldEJpbmRpbmdEZWJ1Z0luZm8ocmVuZGVyRWxlbWVudCwgcHJvcGVydHlOYW1lLCBwcm9wZXJ0eVZhbHVlKTtcbiAgfVxuXG4gIHNldEVsZW1lbnRDbGFzcyhyZW5kZXJFbGVtZW50OiBhbnksIGNsYXNzTmFtZTogc3RyaW5nLCBpc0FkZDogYm9vbGVhbikge1xuICAgIHRoaXMuX2RlbGVnYXRlLnNldEVsZW1lbnRDbGFzcyhyZW5kZXJFbGVtZW50LCBjbGFzc05hbWUsIGlzQWRkKTtcbiAgfVxuXG4gIHNldEVsZW1lbnRTdHlsZShyZW5kZXJFbGVtZW50OiBhbnksIHN0eWxlTmFtZTogc3RyaW5nLCBzdHlsZVZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9kZWxlZ2F0ZS5zZXRFbGVtZW50U3R5bGUocmVuZGVyRWxlbWVudCwgc3R5bGVOYW1lLCBzdHlsZVZhbHVlKTtcbiAgfVxuXG4gIGludm9rZUVsZW1lbnRNZXRob2QocmVuZGVyRWxlbWVudDogYW55LCBtZXRob2ROYW1lOiBzdHJpbmcsIGFyZ3M6IGFueVtdKSB7XG4gICAgdGhpcy5fZGVsZWdhdGUuaW52b2tlRWxlbWVudE1ldGhvZChyZW5kZXJFbGVtZW50LCBtZXRob2ROYW1lLCBhcmdzKTtcbiAgfVxuXG4gIHNldFRleHQocmVuZGVyTm9kZTogYW55LCB0ZXh0OiBzdHJpbmcpIHsgdGhpcy5fZGVsZWdhdGUuc2V0VGV4dChyZW5kZXJOb2RlLCB0ZXh0KTsgfVxufVxuIl19