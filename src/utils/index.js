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
