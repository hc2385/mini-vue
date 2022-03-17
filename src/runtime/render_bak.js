import {ShapeFlags} from "./vnode";
import {isBoolean} from "../utils";
import { patchDomProp,patchProps } from "./patchProps";


export function render(vnode,container) {
    // 前一个vnode节点
    const prevVnode = container._vnode
    if (!vnode) {

    } else {
        patch(prevVnode,vnode,container)
    }
    container._vnode = vnode
}

// 卸载
function unmount(vnode) {
    const { shapeFlag,el } = vnode
    if (shapeFlag & ShapeFlags.COMPONENT) {
        unmountComponent(vnode)
    } else if (shapeFlag & ShapeFlags.FRAGMENT) {
        unmountFragment(vnode)
    } else {
        // 移除el这个元素
        el.parentNode.removeChild(el)
    }
}

// 卸载组件
function unmountComponent(vnode) {

}

// 卸载dom片段
function unmountFragment(vnode) {

}

function patch(pre,next,container) {
     // 此处需要再优化一下，现在是暴力删除
    if(pre) {
        unmount(pre)
        // 卸载之后，释放内存
        pre = null
    }

    const { shapeFlag } = next
    if (shapeFlag & ShapeFlags.COMPONENT) {
        processComponent(pre,next,container)
    } else if (shapeFlag & ShapeFlags.TEXT ) {
        processText(pre,next,container)
    } else if (shapeFlag & ShapeFlags.FRAGMENT) {
        processFragment(pre,next,container)
    } else {
        processElement(pre,next,container)
    }

}

// 判断是否实现相同类型的node
function isSameVnode(pre,next) {
    console.log(pre,next)
    return pre.type === next.type
}

function processComponent(pre,next,container) {

}

function processText(pre,next,container) {
    if (pre) {
        next.el = pre.el
        pre.el.textContent = next.children
    } else {
        // 不然我们就直接挂载节点
        mountTextNode(next,container)
    }
}

function processFragment(pre,next,container) {
    if (pre) {
        patchChildren(pre,next,container)
    } else {
        mountChildren(next.children,container)
    }
}

function processElement(pre,next,container) {
    if (pre) {
        patchElement(pre,next)
    } else {
        mountElement(next,container)
    }
}

// 挂载textNode
function mountTextNode(vnode,container){
    const textNode = document.createTextNode(vnode.children)
    container.appendChild(textNode)
    vnode.el = textNode
}

function mountElement(vnode,container) {
    const { type,props,shapeFlag,children } = vnode
    const el = document.createElement(type)
    patchProps(null,props,el)

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        mountTextNode(vnode,el)
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(children,el)
    }
    container.appendChild(el)
    vnode.el = el
}

function mountChildren(children,container) {
    children.forEach(child=>{
        patch(null,child,container)
    })
}


function patchElement(pre,next) {
    next.el = pre.el
    patchProps(pre.props,next.props,next.el)
    patchChildren(pre,next,next.el)
}

function unmountChildren(children) {
    children.forEach(child=>{
        unmount(child)
    })
}

function patchChildren(pre,next,container) {
    const { shapeFlag:preShapeFlag,children:preChild } = pre
    const { shapeFlag:nextShapeFlag,children:nextChild } = next

    // 分了九种情况去处理
    if (nextShapeFlag & ShapeFlags.TEXT_CHILDREN) {

        if (preShapeFlag & ShapeFlags.TEXT_CHILDREN) {
            container.textContent = nextChild
        } else if (preShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            unmountChildren(preChild)
            container.textContent = next.textContent
        } else {
            container.textContent = next.textContent
        }

    } else if (nextShapeFlag & ShapeFlags.ARRAY_CHILDREN) {

        if (preShapeFlag & ShapeFlags.TEXT_CHILDREN) {
            container.textContent = ''
            mountChildren(next,container)
        } else if (preShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            patchArrayChildren(pre,next,container)
        } else {
            mountChildren(next,container)
        }

    } else {

        if (preShapeFlag & ShapeFlags.TEXT_CHILDREN) {
            container.textContent = ''
        } else if (preShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            unmountChildren(pre)
        } else {

        }

    }
}

function patchArrayChildren(c1,c2,container) {
    const oldLength = c1.length
    const newLength = c2.length
    const commonLength = Math.min(oldLength,newLength);
    for (let i=0;i<commonLength;i++) {
        patch(c1[i],c2[i],container)
    }
    if (oldLength > newLength) {
        unmountChildren(c1.slice(commonLength));
    } else if (oldLength < newLength) {
        mountChildren(c1.slice(commonLength),container);
    }
}


