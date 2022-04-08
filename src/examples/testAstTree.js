import {AstTree} from "../compiler/AstTree";
import {astToH} from "../compiler/AstToH";
import {render} from "../runtime/render";

let str = `<div id="foo" class="abc cba" v-if="ok">
    <span>hello {{name}}</span>
    <span>你好</span>
    <div class="test abc"> 垃圾</div>
</div>`

let str2 = `<div>你好<button class="abc bca">点击事件</button></div><div>dsadas</div>`

let ast = new AstTree(str2)
let fnString = astToH(ast.getAstTree())
console.log(fnString)
let fn = new Function('ctx',fnString)
render(fn(),document.body)
