/**
 * 导出结点类型，目前一共是7中类型
 * 1、根节点
 * 2、元素
 * 3、文本
 * 4、简单表达式
 * 5、插值 例如：{{name}}
 * 6、属性
 * 7、指令
 */
export const NodeTypes = {
    ROOT: 'ROOT',
    ELEMENT: 'ELEMENT',
    TEXT: 'TEXT',
    SIMPLE_EXPRESSION: 'SIMPLE_EXPRESSION',
    INTERPOLATION: 'INTERPOLATION',
    ATTRIBUTE: 'ATTRIBUTE',
    DIRECTIVE: 'DIRECTIVE',
};

/**
 * 判断该标签是原生element，还是组件标签
 * @type {{ELEMENT: string, COMPONENT: string}}
 */
export const ElementTypes = {
    ELEMENT: 'ELEMENT',
    COMPONENT: 'COMPONENT',
};

/**
 * 创建一个根节点
 * @param children 接收一个孩子
 * @return {{children: *, type: string}}
 */
export function createRoot(children) {
    return {
        type: NodeTypes.ROOT,
        children,
    };
}
