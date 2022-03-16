import {reactive} from "./reactive/reactive";
import {effect} from "./reactive/effect";

var observed = window.observed = reactive({
    count1:0,
    count2:10
})


effect(()=>{
    effect(()=>{
        console.log('内层',observed.count1)
    })
    console.log('外层',observed.count2)
})
//
//
// effect(()=>{
//     console.log('数据被第二次双向绑定了',observed.count)
// })
