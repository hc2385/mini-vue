// 测试虚拟结点比较
// import vnodeAndDiff from "./examples/vnodeAndDiff";

// 测试组件
// import mountComponent from "./examples/mountComponent";

// import updateComponentView from "./examples/updateComponentView";

// 测试模板语法树
import {AstTree} from "./compiler/AstTree"

let str = "<div id='12'>大大撒旦</div>"

let ast = new AstTree(str)

console.log(ast.getAstTree())
