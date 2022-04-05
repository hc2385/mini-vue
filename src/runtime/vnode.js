import {isArray, isNumber, isObject, isString} from "../utils";

/**
 * 用一个数字可以表示多种类型（利用位运算）
 * @type {{ELEMENT: number, FRAGMENT: number, TEXT: number, COMPONENT: number, TEXT_CHILDREN: number, ARRAY_CHILDREN: number, CHILDREN: number}}
 */
export const ShapeFlags = {
    ELEMENT:1,             // 00000001
    TEXT:1 << 1,           // 00000010
    FRAGMENT:1<<2,         // 00000100
    COMPONENT: 1<<3,       // 00001000
    TEXT_CHILDREN:1<<4,    // 00010000
    ARRAY_CHILDREN:1<<5,   // 00100000
    CHILDREN:(1<<4)|(1<<5) // 00110000
}

export const Text = Symbol('Text');
export const Fragment = Symbol('Fragment');


/**
 * h函数，返回一个虚拟节点
 * @param {string | Object | Text | Fragment} type
 * @param {Object | null} props
 * @param {string | Number | Array | null} children
 * @return VNode
 */
export function h(type,props,children) {
    let shapeFlag = 0;

    if (isString(type)) {
        shapeFlag = ShapeFlags.ELEMENT
    } else if (type === Text) {
        shapeFlag = ShapeFlags.TEXT
    } else if (type === Fragment) {
        shapeFlag = ShapeFlags.FRAGMENT
    } else  {
        shapeFlag = ShapeFlags.COMPONENT
    }

    if (isString(children) || isNumber(children)) {
        shapeFlag |= ShapeFlags.TEXT_CHILDREN
        children = children.toString()
    } else if (isArray(children)) {
        shapeFlag |= ShapeFlags.ARRAY_CHILDREN
    }

    return {
        type,
        props,
        children,
        shapeFlag,
        el: null,
        // 专门为fragment设定的属性
        anchor: null,
        key: props && (props.key != null ? props.key : null),
        // 准们用于存储组件的实例对象
        component: null,
    }
}

/**
 * 规范化Vnode的形式，避免出现只有Array，String，Number这样的类型数据
 * @param target 传递的目标值，{ 'abc' | 123 | [h(),h()] | h() }
 * @return {*|VNode} 返回一个规范形式的VNode
 */
export function normalizeVNode(target) {
    if(isArray(target)) return h(Fragment,null,target)
    else if (isObject(target)) return target
    else return h(Text,null,target.toString())
}
