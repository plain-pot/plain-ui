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

export const enum TreeNodeCheckStatus {
    check = 'check',
    uncheck = 'uncheck',
    minus = 'minus',
}