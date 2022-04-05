import {render} from "../runtime/render";
import {Fragment, h} from "../runtime/vnode";

// 组件挂载测试（被动更新）
const component = {
    props: ['test'],
    render(ctx) {
        return h('div',{ class:'b',id: 123 },ctx.test)
    }
}

const vnodeProps = {
    foo: 'foo',
    bar: 'bar',
    test: '12524'
}

const vnode = h(component,vnodeProps);
export let test =  render(vnode,document.body)

setTimeout(function (){
    let vnode = h(component,{test:456});
    render(vnode,document.body)
},1000)
