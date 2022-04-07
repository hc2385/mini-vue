// 测试虚拟结点比较
// import vnodeAndDiff from "./examples/vnodeAndDiff";

// 测试组件
// import mountComponent from "./examples/mountComponent";

// import updateComponentView from "./examples/updateComponentView";

// 测试模板语法树
import {AstTree} from "./compiler/AstTree"
import {astToH} from "./compiler/AstToH";

let str = `<div id="foo" class="abc cba" v-if="ok">
    <span>hello {{name}}</span>
</div>`

let ast = new AstTree(str)

console.log(astToH(ast.getAstTree()))
