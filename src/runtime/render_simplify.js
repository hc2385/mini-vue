/*
    简单说明：
        1、这个是第一个版本的渲染函数，是一个简化版本的
        2、功能只有渲染，没有比对，更新和diff比较
 */
import {ShapeFlags} from "./vnode";
import {isBoolean} from "../utils";

/**
 * 渲染vnode到容器container中
 * @param vnode 虚拟dom节点
 * @param container 容器
 */
export function render_simplify(vnode, container) {
    mount(vnode,container)
}

/**
 * 将vnode按不同的情况挂载到container中
 * @param vnode 虚拟dom节点
 * @param container 容器
 */
function mount(vnode,container) {
    const { shapeFlag } = vnode
    if (shapeFlag & ShapeFlags.ELEMENT) {
        mountElement(vnode,container)
    } else if (shapeFlag & ShapeFlags.TEXT) {
        mountTextNode(vnode,container)
    } else if (shapeFlag & ShapeFlags.FRAGMENT) {
        mountFragment(vnode,container)
    } else {
        mountComponent(vnode,container)
    }
}

/**
 * 挂载元素类型的vnode到container中
 * @param vnode 虚拟dom节点
 * @param container 容器
 */
function mountElement(vnode,container) {
    const { type,props,children } = vnode
    const el = document.createElement(type)
    mountProps(props,el)
    mountChildren(vnode,el)
    container.appendChild(el)
    // 挂载之后，保存el
    vnode.el = el
}

/**
 * 挂载文本类型的vnode到container中
 * @param vnode 虚拟dom节点
 * @param container 容器
 */
function mountTextNode(vnode,container){
    const textNode = document.createTextNode(vnode.children)
    container.appendChild(textNode)
    vnode.el = textNode
}

/**
 * 挂载片段类型的vnode到container中
 * @param vnode 虚拟dom节点
 * @param container 容器
 */
function mountFragment(vnode,container){
    mountChildren(vnode,container)
}

/**
 * 挂载组件类型的vnode到container中
 * @param vnode 虚拟dom节点
 * @param container 容器
 */
function mountComponent(vnode,container){

}

/**
 * 挂载孩子类型的vnode到container中
 * @param vnode 虚拟dom节点
 * @param container 容器
 */
function mountChildren(vnode,container) {
    const { shapeFlag,children } = vnode
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        mountTextNode(vnode,container)
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        children.forEach(child=>{
            mount(child,container)
        })
    }
}
// 满足[A-Z]大写是满足InnerHtml
// html某些属性不能使用setAttribute来，必须要用dom节点设置才能生效
const domPropsRE = /[A-Z]|^(value|checked|selected|muted|disabled)/

/**
 * 挂载属性到元素上
 * @param props 属性对象
 * @param el 要挂载的节点
 */
function mountProps(props,el) {
    for (const key in props) {
        let value = props[key]
        switch (key) {
            case 'class':
                el.className = value
                break;
            case 'style':
                for (const styleName in value) {
                    el.style[styleName] = value[styleName]
                }
                break;
            default:
                // 匹配事件，例如onClick
                if (/^on[^a-z]/.test(key)) {
                    const eventName = key.slice(2).toLocaleLowerCase();
                    el.addEventListener(eventName,value)
                } else if (domPropsRE.test(key)) {
                    if (value === '' && isBoolean(value)) {
                        value = true
                    }
                    el[key] = value
                } else {
                    // 这个判断的主要目的是为了避免存在想要设置某个属性为false，让它消失，但是错误的将它设置成了字符串false
                    if (value === null || value === false) {
                        el.removeAttribute(key)
                    } else {
                        el.setAttribute(key,value)
                    }
                }
                break
        }
    }
}
