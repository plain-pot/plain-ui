import {StyleType} from "@/types/utils";

type PlainPlacementType = 'top-start' | 'top-center' | 'top-end' | 'top' |
    'bottom-start' | 'bottom-center' | 'bottom-end' | 'bottom' |
    'left-start' | 'left-center' | 'left-end' | 'left' |
    'right-start' | 'right-center' | 'right-end' | 'right'

interface PlainPopperConfig {
    popper: HTMLElement,                                    // 浮层元素
    reference: HTMLElement,                                 // 目标元素
    padding?: number,                                       // PlainPopper节点 外边距
    offset?: number,                                        // popper 与 reference 在方向上的距离
    boundary?: HTMLElement | string | null | undefined      // 边界元素,
    placement?: PlainPlacementType | undefined,             // 位置
    arrowSize?: number,                                     // 箭头大小，设置为0则不初始化箭头
}

const getRect = (el: HTMLElement) => el.getBoundingClientRect()!

export class PlainPopper {
    constructor(public config: PlainPopperConfig) {

        (config.padding == null && (config.padding = 0));
        (config.offset == null && (config.offset = 0));
        (config.placement == null && (config.placement = 'bottom-start'));
        (config.arrowSize == null && (config.arrowSize = 10));

        this.init()
    }

    init() {

        /*---------------------------------------init PlainPopper styles-------------------------------------------*/

        const plainPopperStyles = {
            padding: `${this.config.padding}px`,
        } as StyleType

        Object.assign(this.config.popper.style, plainPopperStyles)

        /*---------------------------------------init done-------------------------------------------*/

        this.refresh()
    }

    refresh() {

        const popperPos = getRect(this.config.popper)
        const referencePos = getRect(this.config.reference)

        console.log(popperPos, referencePos)

    }

}