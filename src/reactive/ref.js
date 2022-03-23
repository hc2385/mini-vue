import {isChange, isObject} from "../utils";
import {reactive} from "./reactive";
import {track, trigger} from "./effect";

/**
 * 将数据转化为Ref响应式数据
 * @param value 具体的值
 * @return {RefImpl|*} 返回一个RefImpl对象
 */
export function ref(value) {
    if (isRef(value)) return value
    return new RefImpl(value)
}

export function isRef(value) {
    return value.__isRef
}

/**
 * Ref对应的响应式对象
 */
class RefImpl {
    constructor(value) {
        this.__isRef = true
        // 判断是否是对象，如果是的话，就转化为reactive对象
        this._value = convert(value)
    }

    get value() {
        track(this,'value')
        return this._value
    }

    set value(newValue) {
        // 值发生改变的时候才会进行触发操作
        if (isChange(this._value,newValue)) {
            this._value = convert(newValue)
            trigger(this, 'value')
        }
    }

}

/**
 * 转化，value倒是是转化为RefImpl还是，取决于value是否是对象
 * @param value 传入的值
 * @return {unknown} {RefImpl | Reactive}
 */
function convert(value) {
    return isObject(value) ? reactive(value) : value
}
