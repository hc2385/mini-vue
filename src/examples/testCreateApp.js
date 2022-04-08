import {h} from "../runtime/vnode";
import {createApp} from "../runtime/createApp";
import {ref} from "../reactive/ref";

const component = {
    template:`
        <div>你好 {{test.value}} </div> 
        <button @click="add">加一操作</button>
    `,
    props: ['test'],
    setup() {
        let test = ref(0)
        function add() {
            test.value++
        }
        return {
            test,add
        }
    }
}

createApp(component).mount('#app')

