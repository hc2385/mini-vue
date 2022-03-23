// n1可能为null，n2不可能为null
import {isSameVNodeType} from "../../utils";
import {unmount, unmountChildren} from "./unmountMethods";
import {ShapeFlags} from "../vnode";
import {processComponent, processElement, processFragment, processText} from "./processMethods";
import {patchProps} from "./patchProps";
import {mountChildren} from "./mountMethods";

/**
 * 比较新老虚拟dom，看看后续怎么更新dom
 * @param n1 老dom
 * @param n2 新dom
 * @param container 容器
 * @param anchor 辅助元素，意思为插入位置的后面一个位置（即在anchor前面一个位置插入元素）
 */
export function patch(n1, n2, container, anchor) {
    if (n1 && !isSameVNodeType(n1, n2)) {
        // n1被卸载后，n2将会创建，因此anchor至关重要。需要将它设置为n1的下一个兄弟节点
        anchor = (n1.anchor || n1.el).nextSibling;
        unmount(n1);
        n1 = null;
    }

    const { shapeFlag } = n2;
    if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(n1, n2, container, anchor);
    } else if (shapeFlag & ShapeFlags.TEXT) {
        processText(n1, n2, container, anchor);
    } else if (shapeFlag & ShapeFlags.FRAGMENT) {
        processFragment(n1, n2, container, anchor);
    } else if (shapeFlag & ShapeFlags.COMPONENT) {
        processComponent(n1, n2, container, anchor);
    }
}

/**
 * 修补元素，将新的虚拟dom上的元素和孩子节点都修补到旧dom上
 * @param n1 旧虚拟dom
 * @param n2 新虚拟dom
 */
export function patchElement(n1, n2) {
    n2.el = n1.el;
    patchProps(n2.el, n1.props, n2.props);
    patchChildren(n1, n2, n2.el);
}

/**
 * 比较新旧虚拟dom的孩子节点，看看哪些节点需要增加，删除或者修改的
 * @param n1 旧虚拟dom
 * @param n2 新虚拟dom
 * @param container 容器
 * @param anchor 辅助元素，插入位置的后一个位置
 */
export function patchChildren(n1, n2, container, anchor) {
    const { shapeFlag: prevShapeFlag, children: c1 } = n1;
    const { shapeFlag, children: c2 } = n2;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            unmountChildren(c1);
        }
        if (c2 !== c1) {
            container.textContent = c2;
        }
    } else {
        // c2 is array or null
        if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            // c1 was array
            if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                // c2 is array
                // 简单认为头一个元素有key就都有key
                if (c1[0] && c1[0].key != null && c2[0] && c2[0].key != null) {
                    patchKeyedChildren(c1, c2, container, anchor);
                } else {
                    patchUnkeyedChildren(c1, c2, container, anchor);
                }
            } else {
                // c2 is null
                unmountChildren(c1);
            }
        } else {
            // c1 was text or null
            if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
                container.textContent = '';
            }
            if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                mountChildren(c2, container, anchor);
            }
        }
    }
}

export function patchUnkeyedChildren(c1, c2, container, anchor) {
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    for (let i = 0; i < commonLength; i++) {
        patch(c1[i], c2[i], container, anchor);
    }
    if (newLength > oldLength) {
        mountChildren(c2.slice(commonLength), container, anchor);
    } else if (newLength < oldLength) {
        unmountChildren(c1.slice(commonLength));
    }
}

export function patchKeyedChildren(c1, c2, container, anchor) {
    let i = 0,
        e1 = c1.length - 1,
        e2 = c2.length - 1;
    // 1.从左至右依次比对
    // key的判断可能要换成isSameVNodetype
    while (i <= e1 && i <= e2 && c1[i].key === c2[i].key) {
        patch(c1[i], c2[i], container, anchor);
        i++;
    }

    // 2.从右至左依次比对
    while (i <= e1 && i <= e2 && c1[e1].key === c2[e2].key) {
        patch(c1[e1], c2[e2], container, anchor);
        e1--;
        e2--;
    }

    if (i > e1) {
        // 3.经过1、2直接将旧结点比对完，则剩下的新结点直接mount
        const nextPos = e2 + 1;
        const curAnchor = (c2[nextPos] && c2[nextPos].el) || anchor;
        for (let j = i; j <= e2; j++) {
            patch(null, c2[j], container, curAnchor);
        }
    } else if (i > e2) {
        // 3.经过1、2直接将新结点比对完，则剩下的旧结点直接unmount
        for (let j = i; j <= e1; j++) {
            unmount(c1[j]);
        }
    } else {
        // 4.采用传统diff算法，但不真的添加和移动，只做标记和删除
        const map = new Map();
        for (let j = i; j <= e1; j++) {
            const prev = c1[j];
            map.set(prev.key, { prev, j });
        }
        // used to track whether any node has moved
        let maxNewIndexSoFar = 0;
        let move = false;
        const toMounted = [];
        const source = new Array(e2 - i + 1).fill(-1);
        for (let k = 0; k < e2 - i + 1; k++) {
            const next = c2[k + i];
            if (map.has(next.key)) {
                const { prev, j } = map.get(next.key);
                patch(prev, next, container, anchor);
                if (j < maxNewIndexSoFar) {
                    move = true;
                } else {
                    maxNewIndexSoFar = j;
                }
                source[k] = j;
                map.delete(next.key);
            } else {
                // 将待新添加的节点放入toMounted
                toMounted.push(k + i);
            }
        }

        // 先刪除多余旧节点
        map.forEach(({ prev }) => {
            unmount(prev);
        });

        if (move) {
            // 5.需要移动，则采用新的最长上升子序列算法
            const seq = getSequence(source);
            let j = seq.length - 1;
            for (let k = source.length - 1; k >= 0; k--) {
                if (k === seq[j]) {
                    // 不用移动
                    j--;
                } else {
                    const pos = k + i;
                    const nextPos = pos + 1;
                    const curAnchor = (c2[nextPos] && c2[nextPos].el) || anchor;
                    if (source[k] === -1) {
                        // mount
                        patch(null, c2[pos], container, curAnchor);
                    } else {
                        // 移动
                        container.insertBefore(c2[pos].el, curAnchor);
                    }
                }
            }
        } else if (toMounted.length) {
            // 6.不需要移动，但还有未添加的元素
            for (let k = toMounted.length - 1; k >= 0; k--) {
                const pos = toMounted[k];
                const nextPos = pos + 1;
                const curAnchor = (c2[nextPos] && c2[nextPos].el) || anchor;
                patch(null, c2[pos], container, curAnchor);
            }
        }
    }
}

export function getSequence(nums) {
    const result = [];
    const position = [];
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === -1) {
            continue;
        }
        // result[result.length - 1]可能为undefined，此时nums[i] > undefined为false
        if (nums[i] > result[result.length - 1]) {
            result.push(nums[i]);
            position.push(result.length - 1);
        } else {
            let l = 0,
                r = result.length - 1;
            while (l <= r) {
                const mid = ~~((l + r) / 2);
                if (nums[i] > result[mid]) {
                    l = mid + 1;
                } else if (nums[i] < result[mid]) {
                    r = mid - 1;
                } else {
                    l = mid;
                    break;
                }
            }
            result[l] = nums[i];
            position.push(l);
        }
    }
    let cur = result.length - 1;
    // 这里复用了result，它本身已经没用了
    for (let i = position.length - 1; i >= 0 && cur >= 0; i--) {
        if (position[i] === cur) {
            result[cur--] = i;
        }
    }
    return result;
}
