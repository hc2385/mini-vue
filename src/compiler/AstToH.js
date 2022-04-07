// 将AST转化为H函数
import {Fragment, h, ShapeFlags, Text} from "../runtime/vnode";
import {NodeTypes} from "./rules";
import {render} from "../runtime/render";

export function astToH(ast) {
    // 将这个对象转化为h函数
    let res = getChildren(ast.children)
    render(h(Fragment,null,res),document.body)
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
            // 解析指令
        }
    })
    return arr.length?arr:null
}

function getElementNode(obj) {
    let { tag,props } = obj
    let myProps = {}
    props.forEach(item=>{
        // console.log(item.name,item.value.content)
        myProps[item.name] = item.value.content
    })
    return h(tag,myProps,getChildren(obj.children))
}

// 注意里面包含插值语法和值
function getTextNode(obj) {
    return h(Text,null,obj.content)
}
