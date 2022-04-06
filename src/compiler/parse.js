
class astTree {
    // 返回一个编译后的对象AST语法树

    constructor(content) {
        this.content = content
        console.log(this.content)
    }

}

export function parse(context) {
    let tree = new astTree(context)
}
