import {ref} from "../reactive/ref";
import {h} from "../runtime/vnode";
import {render} from "../runtime/render";

// 按钮主动更新组件测试

const component = {
    setup() {
        const count = ref(0)
        const add = ()=>{
            count.value++
        }
        return {count,add}
    },
    render(ctx) {
        return [
            h('div', null, ctx.count.value),
            h('button',{onClick:ctx.add},'add')
        ]
    }
}

const vnode = h(component,[]);
export let test =  render(vnode,document.body)
