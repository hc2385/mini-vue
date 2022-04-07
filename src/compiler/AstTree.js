import {NodeTypes,ElementTypes,createRoot } from "./rules";
import {getTagArr, removeMark} from "../utils";
import {config} from "./config";

let prefix = config.prefix
let delimiters = config.delimiters

export class AstTree {
    // 初始化参数
    constructor(content) {
        this.ctx = {
            options: {
                delimiters: config.delimiters,
            },
            source: content
        }
    }

    /**
     * 获取AstTree树
     */
    getAstTree() {
        return createRoot(this.parseChildren(this.ctx.source.trim()))
    }

    /**
     * 解析孩子
     */
    parseChildren(str) {
        let arr = this.parseToToken(str)
        let stack = []
        let obj = []
        let collect = obj
        // 记录collect的位置
        let temp = []
        arr.forEach(item=>{
            if(item.type === 'tag') {
                // 闭合标签，不做处理
                if(item.value.startsWith('/')) {
                    stack.pop()
                    collect = stack.length>0?stack[stack.length-1].children:obj
                } else {
                    // 非闭合标签，做处理,包含普通标签，指令标签，等等
                    let obj = this.parseTag(item.value)
                    collect.push(obj)
                    stack.push(obj)
                    collect = obj.children
                }
            } else {
                // 对于内容方面的处理
                let val = this.parseContent(item.value)
                val.forEach(item=>collect.push(item))
            }
        })
        return obj
    }

    /**
     * 返回token数组，两种类型，一种是tag，一种是content类型
     * @param str
     * @return {[]}
     */
    parseToToken(str) {
        let res = []
        while(str.length) {
            str = str.trim()
            if(str.startsWith('<')) {
                str = str.substr(1)
                let arr = str.split('>')
                str = str.substr(arr[0].length)
                res.push({
                    type:'tag',
                    value: arr[0].trim()
                })
            }
            if(str.startsWith('>')) {
                str = str.substr(1)
                let arr = str.split('<')
                str = str.substr(arr[0].length)
                let val = arr[0].trim()
                if(val.length) res.push({
                    type: 'content',
                    value: arr[0].trim()
                })

            }
            str = str.trim()
        }
        return res
    }

    parseTag(str) {
        let arr = str.split(' ')
        let tag = arr[0]
        let lastStr = str.substr(tag.length).trim()
        let props = this.parseProps(lastStr)
        let directives = this.parseDirective(lastStr)
        return {
            type:NodeTypes.ELEMENT,
            tag,
            props,
            directives,
            children: [],
        }
    }

    /**
     * 获取tag上的所有的属性
     * @param str
     * @return {[]}
     */
    parseProps(str) {
        let res = []
        let arr = getTagArr(str)
        arr.forEach(item=>{
            if (item!=='' && !item.includes(prefix)) {
                let temp = item.split('=')
                let name = temp[0]
                let type = NodeTypes.ATTRIBUTE
                let value = {
                    type:NodeTypes.TEXT,
                    content: removeMark(temp[1])
                }
                res.push({name,type,value})
            }
        })
        return res
    }

    /**
     * 专门处理 "dsdasda {{name}}" 这样的字符串，返回的是一个数组，里面包含Text和插值表达式
     * @param str
     * @return {[]}
     */
    parseContent(str) {
        let res = []
        // 现在将上面字符串转化为
        str = str.trim()
        let myStr = ''
        while (str.length) {
            if (str.startsWith(delimiters[0])) {
                if (myStr.length) res.push(this.parseText(myStr))
                let idx = str.indexOf(delimiters[1])
                let len = delimiters[1].length
                myStr = str.substr(len,str.indexOf(delimiters[1])-len).trim()
                res.push(this.parseInterpolation(myStr))
                // 置回myStr和str
                myStr = ''
                str = str.substr(idx+len)
            } else {
                myStr+=str[0]
                str = str.substr(1)
            }
        }
        if (myStr.length) res.push(this.parseText(myStr))
        return res
    }

    /**
     * 解析文本内容
     */
    parseText(str) {
        return {
            type:NodeTypes.TEXT,
            content: str
        }
    }

    /**
     *
     */
    parseInterpolation(str) {
        return {
            type:NodeTypes.INTERPOLATION,
            content: {
                type: NodeTypes.SIMPLE_EXPRESSION,
                isStatic: false,
                content:str
            }
        }
    }

    /**
     * 解析指令
     * @param str
     * @return {[]}
     */
    parseDirective(str) {
        let res = []
        let arr = getTagArr(str)
        arr.forEach(item=>{
            if (item!=='' && item.includes(prefix)) {
                let temp = item.split('=')
                // 去掉v-两位字符
                let name = temp[0].substr(prefix.length)
                let type = NodeTypes.DIRECTIVE
                let exp = {
                    type:NodeTypes.SIMPLE_EXPRESSION,
                    content: removeMark(temp[1]),
                    isStatic: false
                }
                res.push({name,type,exp})
            }
        })
        return res
    }

}
