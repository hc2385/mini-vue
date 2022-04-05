import {reactive} from "../../reactive/reactive";
import {effect} from "../../reactive/effect";
import {normalizeVNode} from "../vnode";
import { patch } from "./patch";



/**
 * 挂载组件
 * @param vnode 虚拟don
 * @param container 容器
 * @param anchor 需要挂载的地方
 * @param patch 选择合适的挂载方案
 */
export function mountComponent(vnode, container, anchor) {
    const { type: Component } = vnode;

    // 创建组件的实例对象
    const instance = (vnode.component = {
        props: {},
        attrs: {},
        setupState: null,
        ctx: null,
        update: null,
        subTree: null,//子树
        next: null, // 组件更新时，把新vnode暂放在这里
    });

    // 更新props
    updateProps(instance,vnode)

    // 更新instance
    updateInstance(instance,vnode)


    // 更新或者挂载组件
    instance.update = effect(()=>{
        // 如果有值说明是被动更新
        if (instance.next) {
            //1、更新vnode
            vnode = instance.next
            instance.next = null
            //2、更新vnode的props
            updateProps(instance,vnode)
            //3、更新instance
            updateInstance(instance,vnode)
        }
        const {preSubTree,subTree} = getPreNextSubTree(Component,instance)
        patch(preSubTree,subTree,container,anchor)
        vnode.el = subTree.el
    })

    instance.update()
}

/**
 * 更新组件内容
 * @param n1 旧的虚拟dom
 * @param n2 新的虚拟dom
 */
export function updateComponent(n1,n2) {
    n2.component = n1.component;
    n2.component.next = n2;
    n2.component.update();
}


/**
 * 更新组件上面的属性
 * @param instance 组件实例对象
 * @param vnode vnode对象
 */
function updateProps(instance, vnode) {
    const { type: Component, props: vnodeProps } = vnode;
    const props = (instance.props = {});
    const attrs = (instance.attrs = {});
    for (const key in vnodeProps) {
        // 这里的props默认为数组类型
        if (Component.props && Component.props.includes(key)) {
            props[key] = vnodeProps[key];
        } else {
            attrs[key] = vnodeProps[key];
        }
    }
    // // toThink: props源码是shallowReactive，确实需要吗?
    // // 需要。否则子组件修改props不会触发更新
    instance.props = reactive(instance.props);
}

/**
 * 更新instance上的实例
 * @param instance
 * @param vnode
 * @return {*}
 */
function updateInstance(instance,vnode) {
    const { type: Component } = vnode;
    // 返回setup的执行结果，这里没有对setup进行处理
    if (Component.setup) {
        instance.setupState = Component.setup(instance.props, {
            attrs: instance.attrs,
        });
    } else {
        instance.setupState = {}
    }

    // 上下文对象
    instance.ctx = {
        ...instance.props,
        ...instance.setupState,
    };
    return instance
}


/**
 * 返回组件的子树和上一次实例的子树
 * @param component
 * @param instance
 * @return {{preSubTree: (*|VNode), subTree: (*|VNode)}} 返回上一次结果的subTree和这次结果的subTree
 */
function getPreNextSubTree(component,instance) {
    let preSubTree = instance.subTree
    let res = component.render(instance.ctx)
    // 格式化渲染得到的结果
    const subTree = normalizeVNode(res)
    // 保存subTree的结果
    instance.subTree = subTree
    if (Object.keys(subTree).length) {
        subTree.props = {
            ...subTree.props,
            ...instance.attrs
        }
    }
    return { preSubTree,subTree }
}
