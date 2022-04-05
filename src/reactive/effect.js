// 栈，存放执行方法的栈
const effectStack = []
let activeEffect;

/**
 * 监视器函数，函数中有值发生改变就执行这个函数
 * @param fn 监视函数
 * @param options 选项值
 * @return {effectFn} 返回对fn封装后的监视器函数
 */
export function effect(fn,options = {}) {
    const effectFn = ()=>{
        try {
            activeEffect = effectFn;
            effectStack.push(activeEffect)
            return fn();
        } finally {
            // 执行过后还原
            effectStack.pop()
            activeEffect = effectStack[effectStack.length-1]
        }
    }
    if (!options.lazy) {
        effectFn()
    }
    // 调度函数挂载到effectFn上面
    effectFn.scheduler = options.scheduler
    return effectFn
}

const targetMap = new WeakMap()

/**
 * 追踪函数
 * @param target 追踪的对象
 * @param key 追踪的key
 */
export function track(target,key) {
    if (!activeEffect) {
        return;
    }
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target,(depsMap = new Map()));
    }
    let deps = depsMap.get(key)
    if (!deps) {
        depsMap.set(key,(deps=new Set()))
    }

    deps.add(activeEffect)

}

/**
 * 触发函数
 * @param target 触发的对象
 * @param key 触发的key值
 */
export function trigger(target,key) {
    const depsMap = targetMap.get(target)
    if (!depsMap) return

    const deps = depsMap.get(key)
    if (!deps) return

    deps.forEach(effectFn=>{
        // 如果有调度函数，优先执行调度函数
        if (effectFn.scheduler) {
            // 调度函数需要得到这个effectFn这个函数
            effectFn.scheduler(effectFn)
        } else {
            effectFn()
        }
    })
}
