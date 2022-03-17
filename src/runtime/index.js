
import { Text,h,Fragment } from "./vnode";
// import { render } from "./render";
import { render } from "./render_bak";


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

render(
    h('ul',null,[
        h('li',null,'first'),
        h(Fragment,null,[]),
        h('li',null,'last'),
    ]),
    document.body
)

setTimeout(function (){
    render(
        h('ul',null,[
            h('li',null,'first'),
            h(Fragment,null,[]),
            h('li',null,'last'),
            h('li',null,'aaa'),
        ]),
        document.body
    )
},3000)



export function test() {
}
