import {unmount} from "./lib/unmountMethods";
import {patch} from "./lib/patch";

/**
 * 渲染函数
 * @param vnode 该节点
 * @param container 需要渲染的容器
 */
export function render(vnode, container) {
    const prevVNode = container._vnode;
    if (!vnode) {
        if (prevVNode) {
            unmount(prevVNode);
        }
    } else {
        patch(prevVNode, vnode, container);
    }
    container._vnode = vnode;
}
