/*
    简单说明：
        1、该模块主要是判断如何用什么方式更新到dom上
        2、其实主要流程是  大概的patch --> process判断 --> 具体的patch 或者是 mount
 */
import {mountChildren, mountComponent, mountElement, mountTextNode} from "./mountMethods";
import {patchChildren, patchElement} from "./patch";

/**
 * 判断元素类型的虚拟dom 怎么转换到真实dom上
 * @param n1 旧的虚拟dom
 * @param n2 新的虚拟dom
 * @param container 容器
 * @param anchor 用于辅助插入的前一个元素
 */
export function processElement(n1, n2, container, anchor) {
    if (n1 == null) {
        mountElement(n2, container, anchor);
    } else {
        patchElement(n1, n2);
    }
}

/**
 * 判断fragment类型的虚拟dom 怎么转换到真实dom上
 * @param n1 旧的虚拟dom
 * @param n2 新的虚拟dom
 * @param container 容器
 * @param anchor 用于辅助插入的前一个元素
 */
export function processFragment(n1, n2, container, anchor) {
    const fragmentStartAnchor = (n2.el = n1
        ? n1.el
        : document.createTextNode(''));
    const fragmentEndAnchor = (n2.anchor = n1
        ? n1.anchor
        : document.createTextNode(''));
    if (n1 == null) {
        container.insertBefore(fragmentStartAnchor, anchor);
        container.insertBefore(fragmentEndAnchor, anchor);
        mountChildren(n2.children, container, fragmentEndAnchor);
    } else {
        patchChildren(n1, n2, container, fragmentEndAnchor);
    }
}

/**
 * 判断文本类型的虚拟dom 怎么转换到真实dom上
 * @param n1 旧的虚拟dom
 * @param n2 新的虚拟dom
 * @param container 容器
 * @param anchor 用于辅助插入的前一个元素
 */
export function processText(n1, n2, container, anchor) {
    if (n1 == null) {
        mountTextNode(n2, container, anchor);
    } else {
        n2.el = n1.el;
        n2.el.textContent = n2.children;
    }
}

/**
 * 判断组件类型的虚拟dom 怎么转换到真实dom上
 * @param n1 旧的虚拟dom
 * @param n2 新的虚拟dom
 * @param container 容器
 * @param anchor 用于辅助插入的前一个元素
 */
export function processComponent(n1, n2, container, anchor) {
    if (n1 == null) {
        mountComponent(n2, container, anchor, patch);
    } else {
        // updateComponent(n1, n2);
    }
}
