import {effect, track, trigger} from "./effect";
import {isFunction} from "../utils";

export function computed(getterOrOptions) {

    let getter,setter

    if (isFunction(getterOrOptions)) {
        getter = getterOrOptions
        setter = () => {
            console.warn('没写set方法呢')
        }
    } else {
        getter = getterOrOptions.get
        setter = getterOrOptions.set
    }

    return new ComputedImpl(getter,setter)
}

class ComputedImpl {
    constructor(getter,setter) {
        this._setter = setter
        this._value = undefined
        // 依赖是否更新,默认更新
        this._dirty = true
        // 用effect监视依赖是否发生改变
        this.effect = effect(getter,{
            lazy:true,
            // 此处得是箭头函数
            scheduler:()=>{
                this._dirty = true
                trigger(this,'value')
            }
        })
    }

    get value() {
        if (this._dirty) {
            this._value = this.effect()
            this._dirty = false
            track(this,'value')
        }
        return this._value
    }

    set value(newValue) {
        this._setter(newValue)
    }
}
