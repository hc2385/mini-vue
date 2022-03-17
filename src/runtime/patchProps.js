

// 满足[A-Z]大写是满足InnerHtml
// html某些属性不能使用setAttribute来，必须要用dom节点设置才能生效
import {isBoolean} from "../utils";

const domPropsRE = /[A-Z]|^(value|checked|selected|muted|disabled)/

export function patchProps(oldProps,newProps,el) {
    if (oldProps === newProps) return

    oldProps = oldProps || {}
    newProps = newProps || {}

    for (const key in newProps) {
        const next = newProps[key]
        const prev = oldProps[key]
        if (prev !== next) {
            patchDomProp(prev,next,key,el)
        }
    }
    for (const key in oldProps) {
        if (newProps[key] == null) {
            patchDomProp(oldProps[key],null,key,el)
        }
    }
}

export function patchDomProp(prev,next,key,el) {
    switch (key) {
        case 'class':
            el.className = next || ''
            break;
        case 'style':
            for (const styleName in next) {
                el.style[styleName] = next[styleName]
            }
            if (prev) {
                for (const styleName in prev) {
                    if (next[styleName] === null) {
                        el.style[styleName] = ''
                    }
                }
            }
            break;
        default:
            // 匹配事件，例如onClick
            if (/^on[^a-z]/.test(key)) {
                const eventName = key.slice(2).toLocaleLowerCase();
                if (prev) {
                    el.removeEventListener(eventName,prev)
                }
                if (next) {
                    el.addEventListener(eventName,next)
                }
            } else if (domPropsRE.test(key)) {
                if (next === '' && isBoolean(next)) {
                    next = true
                }
                el[key] = next
            } else {
                // 这个判断的主要目的是为了避免存在想要设置某个属性为false，让它消失，但是错误的将它设置成了字符串false
                if (next === null || next === false) {
                    el.removeAttribute(key)
                } else {
                    el.setAttribute(key,next)
                }
            }
            break
    }
}
