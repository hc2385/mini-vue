import {NodeTypes,ElementTypes,createRoot } from "./rules";

export class AstTree {
    // 初始化参数
    constructor(content) {
        this.ctx = {
            options: {
                delimiters: ['{{', '}}'],
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
                if(item.value.startsWith('/')) {
                    stack.pop()
                    collect = stack.length>0?stack[stack.length-1].children:obj
                } else {
                    let obj = {
                        tag:item.value,
                        children: []
                    }
                    collect.push(obj)
                    stack.push(obj)
                    collect = obj.children
                }
            } else {
                // 对于内容方面的处理
                collect.push({
                    value:item.value
                })
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

    /**
     *
     */
    parseText() {
    }

    parseInterpolation() {

    }

    parseElement() {

    }

    parseAttribute() {

    }

    parseDirective() {

    }

}
