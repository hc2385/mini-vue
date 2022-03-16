import {reactive} from "./reactive/reactive";
import {effect} from "./reactive/effect";

var observed = window.observed = reactive(reactive({
    count:0,
    test: 2
}))

effect(()=>{
    console.log('数据被双向绑定了',observed.count)
})
//
//
// effect(()=>{
//     console.log('数据被第二次双向绑定了',observed.count)
// })
