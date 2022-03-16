import {isChange, isObject} from "../utils";
import {track, trigger} from "./effect";

const proxyMap = new WeakMap()
export function reactive(target) {
    // 不是对象就不进行响应式
    if (!isObject(target)) return target

    if (isReactive(target)) return target

    if (proxyMap.has(target)) return proxyMap.get(target)

    const proxy = new Proxy(target,{
        get(target, key, receiver) {
            if (key === '__isReactive') return true
            const res = Reflect.get(target,key,receiver)
            track(target,key)
            return res
        },
        set(target, key, value, receiver) {
            const oldValue = target[key]
            const res = Reflect.set(target,key,value,receiver)
            // 值发生改变才trigger
            if (isChange(oldValue,value)) trigger(target,key)
            return res
        }
    })
    proxyMap.set(target,proxy)
    return proxy
}

export function isReactive(target) {
    return !!(target && target.__isReactive)
}
