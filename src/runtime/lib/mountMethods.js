// 都是一些挂载函数

import {ShapeFlags} from "../vnode";
import {patchProps} from "./patchProps";
import {patch} from "./patch";

/**
 * 挂载元素到容器内
 * @param vnode 虚拟节点
 * @param container 容器
 * @param anchor 辅助元素，意思为插入位置的后面一个位置（即在anchor前面一个位置插入元素）
 */
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

/**
 * 挂载文本节点
 * @param vnode 虚拟节点
 * @param container 容器
 * @param anchor 辅助元素（和上面函数一个意思）
 */
export function mountTextNode(vnode, container, anchor) {
    const textNode = document.createTextNode(vnode.children);
    vnode.el = textNode;
    container.insertBefore(textNode, anchor);
}

/**
 * 挂载所有的孩子节点
 * @param children 虚拟dom的孩子
 * @param container 容器
 * @param anchor 辅助元素（同上）
 */
export function mountChildren(children, container, anchor) {
    children.forEach((child) => {
        patch(null, child, container, anchor);
    });
}

/**
 * 挂载组件，后续完成，还没做
 */
export function mountComponent(newNode, container, anchor, patch) {

}

/**
 * 更新组件
 * @param n1 老的虚拟dom
 * @param n2 新的虚拟dom
 */
function updateComponent(n1, n2) {
    n2.component = n1.component;
    n2.component.next = n2;
    n2.component.update();
}
