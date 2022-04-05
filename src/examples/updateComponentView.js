import {ref} from "../reactive/ref";
import {h} from "../runtime/vnode";
import {render} from "../runtime/render";

// 按钮主动更新组件测试

const component = {
    setup() {
        const count = ref(0)
        const abc = ref(1)
        const add = ()=>{
            count.value++
            count.value++
            count.value++
            abc.value++
        }
        return {count,abc,add}
    },
    render(ctx) {
        console.log('render')
        return [
            h('div', null, ctx.count.value + ' ' + ctx.abc.value),
            h('button',{onClick:ctx.add},'add1')
        ]
    }
}

const vnode = h(component,[]);
export let test =  render(vnode,document.body)
