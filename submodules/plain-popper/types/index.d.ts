export type PlainPlacementType = 'top-start' | 'top-center' | 'top-end' | 'top' |
    'bottom-start' | 'bottom-center' | 'bottom-end' | 'bottom' |
    'left-start' | 'left-center' | 'left-end' | 'left' |
    'right-start' | 'right-center' | 'right-end' | 'right'

export interface PlainPopperOption {
    popperEl: HTMLElement;                                                      //弹出层dom
    targetEl: HTMLElement;                                                      //目标元素dom
    offset?: number                                                             //弹出层dom与目标dom的距离
    boundary?: HTMLElement | string;                                            //边界元素
    placement?: PlainPlacementType | null;                                     //位置
    backgroundColor?: string                                                    //背景色
    boxShadow?: string                                                          //阴影
    border?: string                                                             //边框
    arrow?: boolean                                                             //是否需要箭头
    arrowSize?: number                                                          //箭头大小
    gpuAcceleration?: boolean
}

export type PlainTooltipTheme = 'light' | 'dark' | 'error' | 'success'
export type PlainTooltipAnimate = 'scale' | 'fade' | 'drop'
export type PlainTooltipTrigger = 'focus' | 'click' | 'hover' | 'always' | 'manual'

export interface PlainTooltipOption {
    targetEl: HTMLElement
    offset?: number
    boundary?: HTMLElement | string;
    placement?: PlainPlacementType | null;
    backgroundColor?: string
    boxShadow?: string
    border: string
    arrow?: boolean
    arrowSize?: number
    gpuAcceleration?: boolean

    theme?: PlainTooltipTheme
    animate?: PlainTooltipAnimate
    content: HTMLElement | string
    trigger?: PlainTooltipTrigger
    removeOnHide?: boolean
}

export interface PlainPopperType {
    targetEl: HTMLElement
    popperEl: HTMLElement
}

declare const PlainPopper: PlainPopperType

export default PlainPopper