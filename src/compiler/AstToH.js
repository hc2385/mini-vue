// 将AST转化为H函数
import {Fragment, h, ShapeFlags, Text} from "../runtime/vnode";
import {NodeTypes} from "./rules";
import {render} from "../runtime/render";
import {capitalize, removeMark} from "../utils";

export function astToH(ast) {
    // 将这个对象转化为h函数
    let res = getChildren(ast.children)
    console.log(res)
    return `
        with(ctx) {
            const {h,Text,Fragment} = MiniVue
            return [${res}]
        }
    `
}

function getChildren(children) {
    let arr = []
    children.forEach(child=>{
        const { type } = child
        if (type === NodeTypes.ELEMENT) {
            arr.push(getElementNode(child))
        } else if (type === NodeTypes.TEXT) {
            arr.push(getTextNode(child))
        } else if (type === NodeTypes.INTERPOLATION) {
            // 解析插值
            arr.push(getInterpolation(child))
        }
    })
    return arr.length?arr:null
}

function getElementNode(obj) {
    let { tag,props } = obj
    let myProps = processProps(props)
    return `h("${tag}",${myProps},[${getChildren(obj.children)}])`
}


function processProps(props) {
    let str = ''
    let val = ''
    props.forEach(item=>{
        // 处理点击事件
        if (item.name.startsWith('@')) {
            let eventName = 'on' + capitalize(item.name.substr(1))
            let event = item.value.content
            val = `,${eventName}:${event}`
        } else {
            val = `,"${item.name}":"${item.value.content}"`
            // myProps[item.name] = item.value.content
        }
        str+=val
    })
    if (str.length) str = str.substr(1)
    return `{${str}}`
}

// 注意里面包含插值语法和值
function getTextNode(obj) {
    return `h(Text,null,"${obj.content}")`
}

function getInterpolation(obj) {
    return `h(Text,null,${obj.content.content})`
}
