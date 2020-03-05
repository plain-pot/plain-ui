export type RusionPlacementType = 'top-start' | 'top-center' | 'top-end' | 'top' |
    'bottom-start' | 'bottom-center' | 'bottom-end' | 'bottom' |
    'left-start' | 'left-center' | 'left-end' | 'left' |
    'right-start' | 'right-center' | 'right-end' | 'right'

export interface RusionPopperOption {
    popperEl: HTMLElement;                                                      //弹出层dom
    targetEl: HTMLElement;                                                      //目标元素dom
    offset?: number                                                             //弹出层dom与目标dom的距离
    boundary?: HTMLElement | string;                                            //边界元素
    placement?: RusionPlacementType | null;                                     //位置
    backgroundColor?: string                                                    //背景色
    boxShadow?: string                                                          //阴影
    border?: string                                                             //边框
    arrow?: boolean                                                             //是否需要箭头
    arrowSize?: number                                                          //箭头大小
    gpuAcceleration?: boolean
}

export type RusionTooltipTheme = 'light' | 'dark' | 'error' | 'success'
export type RusionTooltipAnimate = 'scale' | 'fade' | 'drop'
export type RusionTooltipTrigger = 'focus' | 'click' | 'hover' | 'always' | 'manual'

export interface RusionTooltipOption {
    targetEl: HTMLElement
    offset?: number
    boundary?: HTMLElement | string;
    placement?: RusionPlacementType | null;
    backgroundColor?: string
    boxShadow?: string
    border: string
    arrow?: boolean
    arrowSize?: number
    gpuAcceleration?: boolean

    theme?: RusionTooltipTheme
    animate?: RusionTooltipAnimate
    content: HTMLElement | string
    trigger?: RusionTooltipTrigger
    removeOnHide?: boolean
}

export interface RusionPopperType {
    targetEl: HTMLElement
    popperEl: HTMLElement
}

declare const RusionPopper: RusionPopperType

export default RusionPopper