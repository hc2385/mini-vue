import {unmount} from "./lib/unmountMethods";
import {patch} from "./lib/patch";

// 渲染函数
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
