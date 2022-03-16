import {reactive} from "./reactive/reactive";
import {effect} from "./reactive/effect";
import {ref} from "./reactive/ref";

var observed = window.observed = reactive({
    count1:0,
    count2:10
})

// effect(()=>{
//     effect(()=>{
//         console.log('内层',observed.count1)
//     })
//     console.log('外层',observed.count2)
// })
//
//
// effect(()=>{
//     console.log('数据被第二次双向绑定了',observed.count)
// })

var obs2 = window.obs2 = ref('1')

effect(()=>{
    console.log('发生了变化',obs2.value)
})
