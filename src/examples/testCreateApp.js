import {h} from "../runtime/vnode";
import {createApp} from "../runtime/createApp";

const component = {
    template:`<div>你好</div> <span>   你好！   </span>`,
    props: ['test']
}

createApp(component).mount(document.body)

