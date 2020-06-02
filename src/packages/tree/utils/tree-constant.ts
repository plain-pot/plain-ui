/**
 * 拖拽放置的类型
 * @author  韦胜健
 * @date    2020/4/1 17:15
 */
export enum TreeDropType {
    prev = 'prev',
    inner = 'inner',
    next = 'next',
    null = 'null',
}

export const enum TreeMarkAttr {
    expand = 'expand',
    check = 'check',
    loading = 'loading',
    loaded = 'loaded',
    node = 'node',
}

export const enum TreeNodeCheckStatus {
    check = 'check',
    uncheck = 'uncheck',
    minus = 'minus',
}

export interface TreeContextType {
    keyField: string,
    labelField: string,
    childrenField: string,
    isCheckable: Function,
    isLeaf: Function,
    checkStrictly: boolean,
    filterNodeMethod: Function,
    intent: number,
    $set: (obj: object, key: string, value: any) => void
}