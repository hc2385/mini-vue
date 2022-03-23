import {reactive} from "../reactive/reactive";
import {ref} from "../reactive/ref";
import {effect} from "../reactive/effect";

var observed = window.observed = reactive({
    count1:0,
    count2:10
})



const num = window.num = ref(0)

effect(()=>{
    effect(()=>{
        console.log('内层',observed.count1)
    })
    console.log('外层',observed.count2)
})


effect(()=>{
    console.log('数据被第二次双向绑定了',observed.count)
})

var obs2 = window.obs2 = ref('1')

effect(()=>{
    console.log('发生了变化',obs2.value)
})

var obs3 = window.obs3 = ref(1)
var obs4 = window.obs4 = ref(2)

let res = window.res = computed(()=>{
    return obs3.value * 2
})

effect(()=>{
    console.log('ceshi',res.value)
})
