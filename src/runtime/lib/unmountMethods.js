import {ShapeFlags} from "../vnode";

/**
 * 用于卸载节点
 * @param vnode 虚拟dom节点
 */

// 卸载虚拟节点
export function unmount(vnode) {
    const { shapeFlag, el } = vnode;
    if (shapeFlag & ShapeFlags.COMPONENT) {
        unmountComponent(vnode);
    } else if (shapeFlag & ShapeFlags.FRAGMENT) {
        unmountFragment(vnode);
    } else {
        el.parentNode.removeChild(el);
    }
}

// 卸载组件
export function unmountComponent(vnode) {
    // const { component } = vnode;
    // unmount(component.subTree);
}

// 卸载Fragment片段
export function unmountFragment(vnode) {
    // eslint-disable-next-line prefer-const
    let { el: cur, anchor: end } = vnode;
    while (cur !== end) {
        const next = cur.nextSibling;
        cur.parentNode.removeChild(cur);
        cur = next;
    }
    end.parentNode.removeChild(end);
}

// 卸载孩子节点
export function unmountChildren(children) {
    children.forEach((child) => unmount(child));
}
