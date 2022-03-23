// 都是一些挂载函数

import {ShapeFlags} from "../vnode";
import {patchProps} from "./patchProps";
import {patch} from "./patch";

// 挂载元素节点
export function mountElement(vnode, container, anchor) {
    const { type, props, shapeFlag, children } = vnode;
    const el = document.createElement(type);

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 这里不能传anchor。因为anchor限制的是当前的element
        // 作为本element的children，不用指定anchor，append就行
        mountChildren(children, el);
    }

    if (props) {
        patchProps(el, null, props);
    }

    vnode.el = el;
    container.insertBefore(el, anchor);
}

// 挂载文本节点
export function mountTextNode(vnode, container, anchor) {
    const textNode = document.createTextNode(vnode.children);
    vnode.el = textNode;
    container.insertBefore(textNode, anchor);
}

// 挂载孩子节点
export function mountChildren(children, container, anchor) {
    children.forEach((child) => {
        patch(null, child, container, anchor);
    });
}

// 挂载组件
export function mountComponent(n2, container, anchor, patch) {

}

// 更新组件
function updateComponent(n1, n2) {
    n2.component = n1.component;
    n2.component.next = n2;
    n2.component.update();
}
