import {isChange, isObject} from "../utils";
import {reactive} from "./reactive";
import {track, trigger} from "./effect";

export function ref(value) {
    if (isRef(value)) return value
    return new RefImpl(value)
}

export function isRef(value) {

}

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

function convert(value) {
    return isObject(value) ? reactive(value) : value
}
