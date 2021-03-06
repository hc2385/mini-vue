/**
 * 专门用于处理标签上的各种参数的，例如class和各种attribute，将这些东西加到dom节点上去
 * @param el 该dom元素
 * @param oldProps 以前的标签参数
 * @param newProps 新的标签参数
 */
export function patchProps(el, oldProps, newProps) {
    if (oldProps === newProps) {
        return;
    }
    oldProps = oldProps || {};
    newProps = newProps || {};
    for (const key in newProps) {
        if (key === 'key') {
            continue;
        }
        const prev = oldProps[key];
        const next = newProps[key];
        if (prev !== next) {
            patchDomProp(el, key, prev, next);
        }
    }
    for (const key in oldProps) {
        if (key !== 'key' && !(key in newProps)) {
            patchDomProp(el, key, oldProps[key], null);
        }
    }
}

/**
 * 正则表达式，这些元素的attribute值和property值会出现不同步的情况
 * @type {RegExp}
 */
const domPropsRE = /[A-Z]|^(value|checked|selected|muted|disabled)$/;

/**
 * 更新dom元素上的属性值
 * @param el dom元素
 * @param key 要更新的key
 * @param prev key对应的以前的value
 * @param next key对应的之后的value
 */
function patchDomProp(el, key, prev, next) {
    switch (key) {
        case 'class':
            // 暂时认为class就是字符串
            // next可能为null，会变成'null'，因此要设成''
            el.className = next || '';
            break;
        case 'style':
            // style为对象
            if (!next) {
                el.removeAttribute('style');
            } else {
                for (const styleName in next) {
                    el.style[styleName] = next[styleName];
                }
                if (prev) {
                    for (const styleName in prev) {
                        if (next[styleName] == null) {
                            el.style[styleName] = '';
                        }
                    }
                }
            }
            break;
        default:
            if (/^on[^a-z]/.test(key)) {
                // 事件
                if (prev !== next) {
                    const eventName = key.slice(2).toLowerCase();
                    if (prev) {
                        el.removeEventListener(eventName, prev);
                    }
                    if (next) {
                        el.addEventListener(eventName, next);
                    }
                }
            } else if (domPropsRE.test(key)) {
                if (next === '' && typeof el[key] === 'boolean') {
                    next = true;
                }
                el[key] = next;
            } else {
                // 例如自定义属性{custom: ''}，应该用setAttribute设置为<input custom />
                // 而{custom: null}，应用removeAttribute设置为<input />
                if (next == null || next === false) {
                    el.removeAttribute(key);
                } else {
                    el.setAttribute(key, next);
                }
            }
            break;
    }
}
