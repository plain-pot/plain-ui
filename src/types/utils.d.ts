export interface ResizeDetectFuncParam {
    width?: number
    height?: number
    oldWidth?: number
    oldHeight?: number
    el?: HTMLElement

    [key: string]: any
}

export interface ResizeDetectFunc {
    (option: ResizeDetectFuncParam): void
}