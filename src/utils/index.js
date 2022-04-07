export function isObject(target) {
    return typeof target === 'object' && target !== null
}

export function isChange(oldValue,newValue) {
    return oldValue !== newValue && !(Number.isNaN(oldValue) && Number.isNaN(newValue))
}

export function isArray(target) {
    return Array.isArray(target)
}

export function isFunction(fn) {
    return typeof fn === 'function'
}

export function isString(target) {
    return typeof target === 'string'
}

export function isNumber(target) {
    return typeof target === 'number'
}

export function isBoolean(target) {
    return typeof target === 'boolean'
}

export function isSameVNodeType(n1, n2) {
    return n1.type === n2.type;
}

export function removeMark(str) {
    let res = str.substr(1)
    res = res.substr(0,res.length-1)
    return res
}

//   id="foo" class="abc cba" v-if="ok"
export function getTagArr(str) {
    let arr = []
    let mystr = ''
    let count = 0
    let pre = count
    for (let s of str) {
        mystr += s
        if (s === '"' || s === "'") count++
        if (pre !==count && count % 2 === 0) {
            arr.push(mystr.trim())
            mystr = ''
            pre = count
        }
    }
    return arr
}
// dsadsad {{name}}

