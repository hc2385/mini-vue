import {isArray, isChange, isObject} from "../utils";
import {track, trigger} from "./effect";

const proxyMap = new WeakMap()
export function reactive(target) {
    // 不是对象就不进行响应式
    if (!isObject(target)) return target

    // 判断是否是reactive对象，如果是就没必要再进行操作了
    if (isReactive(target)) return target

    // 将对象放入map对象中，方便后续给track和trigger操作
    if (proxyMap.has(target)) return proxyMap.get(target)

    const proxy = new Proxy(target,{
        get(target, key, receiver) {

            // 为了判断它是否是reactive对象而存在的
            if (key === '__isReactive') return true

            // 获取访问的值
            const res = Reflect.get(target,key,receiver)

            // 追踪target的去向
            track(target,key)

            // 这一步为了深层次的对象代理
            return isObject(res) ? reactive(res) : res
        },
        set(target, key, value, receiver) {
            let oldLength = target.length
            const oldValue = target[key]
            const res = Reflect.set(target,key,value,receiver)
            // 值发生改变才触发事件
            if (isChange(oldValue,value)) {
                trigger(target,key)
                if(isArray(target) && isChange(oldLength,target.length)) {
                    trigger(target,'length')
                }
            }
            return res
        }
    })
    proxyMap.set(target,proxy)
    return proxy
}

export function isReactive(target) {
    return !!(target && target.__isReactive)
}
