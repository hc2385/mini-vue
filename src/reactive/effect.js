// 栈，存放执行方法的栈
const effectStack = []
let activeEffect;

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

export function trigger(target,key) {
    const depsMap = targetMap.get(target)
    if (!depsMap) return

    const deps = depsMap.get(key)
    if (!deps) return

    deps.forEach(effectFn=>{
        // 如果有调度函数，优先执行调度函数
        if (effectFn.scheduler) {
            effectFn.scheduler()
        } else {
            effectFn()
        }
    })
}
