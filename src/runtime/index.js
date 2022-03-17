import { render } from "./render";
import { Text,h,Fragment } from "./vnode";


const vnode = h(
    'div',
    {
        class: 'a b',
        style: {
            border: '1px solid',
            fontSize: '14px'
        },
        onClick: ()=> alert('111'),
        id: 'foo',
        checked: '',
        custom:false
    },
    [
        h('ul',null,[
            h('li',{style: {color : 'red'}},1),
            h('li',null,1),
            h('li',{ style: {color: 'blue' } },3)
        ])
    ]
)



export function test() {
    render(vnode,document.body)
}
