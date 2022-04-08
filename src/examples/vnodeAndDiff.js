import { Text,h,Fragment } from "../runtime/vnode";
import { render } from "../runtime/render";

render(
    h('ul',null,[
        h('li',null,'first'),
        // h(Fragment,null,[]),
        // h('li',null,'last'),
        // h('li',null,'111'),
    ]),
    document.body
)

// render([h('div',null,123),h('div',null,123)],
//     document.body
// )

// setTimeout(function (){
//     render(
//         h('ul',null,[
//             h('li',null,'first'),
//             h(Fragment,null,[
//                 h('li',null,'mid1'),
//                 h('li',null,'mid2')
//             ]),
//             h('li',null,'last'),
//         ]),
//         document.body
//     )
// },1000)

export default {

}
