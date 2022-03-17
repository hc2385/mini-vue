import {reactive} from "./reactive/reactive";
import {effect} from "./reactive/effect";
import {ref} from "./reactive/ref";
import {computed} from "./reactive/computed";
import {test} from "./runtime";

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

// var obs2 = window.obs2 = ref('1')
//
// effect(()=>{
//     console.log('发生了变化',obs2.value)
// })

// var obs3 = window.obs3 = ref(1)
// var obs4 = window.obs4 = ref(2)
//
// let res = window.res = computed(()=>{
//     return obs3.value * 2
// })
//
// effect(()=>{
//     console.log('ceshi',res.value)
// })

const num = window.num = ref(0)
// const c = window.c = computed(()=>{
//     console.log('计算一个值')
//     return num.value * 2
// })

// const c = window.c = computed({
//     set(value) {
//         console.log(`你尝试修改得值为${value}`)
//     },
//     get() {
//         console.log('get')
//         return num.value + 4
//     }
// })

test()
