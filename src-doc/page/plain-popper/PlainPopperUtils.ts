export type Boundary = HTMLElement | string;

export enum Direction {
    top = 'top',
    bottom = 'bottom',
    left = 'left',
    right = 'right',
}

export enum Align {
    start = 'start',
    center = 'center',
    end = 'end'
}

export type PlacementType = 'top-start' | 'top-center' | 'top-end' | 'top' |
    'bottom-start' | 'bottom-center' | 'bottom-end' | 'bottom' |
    'left-start' | 'left-center' | 'left-end' | 'left' |
    'right-start' | 'right-center' | 'right-end' | 'right';

export interface Pos {
    top: number,
    left: number,
    height: number,
    width: number,
}

export interface PlainPopperConfig {
    popper: HTMLElement,                                    // 浮层元素
    reference: HTMLElement,                                 // 目标元素
    padding?: number,                                       // PlainPopper节点 外边距
    offset?: number,                                        // popper 与 reference 在方向上的距离
    boundary?: Boundary | undefined | null,                 // 边界元素,
    placement?: PlacementType | undefined | null,           // 位置
    arrowSize?: number,                                     // 箭头大小，设置为0则不初始化箭头
    gpuAcceleration?: boolean,                              // 是否使用 transform 定位
}

/**
 * 获取dom元素
 * @author  韦胜健
 * @date    2020/9/22 9:28
 */
function getEl(el: any): HTMLElement | null {
    if (!el) {
        return null
    }
    if (el === window || el === 'window') {
        return document.documentElement
    }
    if (typeof el === "string") {
        let ret = document.querySelector(el)
        if (ret == null) {
            throw new Error(`can't find HTMLElement:${el}!`)
        }
        return ret as HTMLElement
    } else {
        return el
    }
}

/**
 * 判断是否为纵向
 * @author  韦胜健
 * @date    2020/9/22 9:40
 */
export function isVertical(direction: Direction) {
    return [Direction.top, Direction.bottom].indexOf(direction) > -1
}

/**
 * 获取位置信息
 * @author  韦胜健
 * @date    2020/9/22 9:18
 */
export function getPos(el: HTMLElement): Pos {
    const rect = el.getBoundingClientRect()!
    const {offsetWidth, offsetHeight} = el
    return {
        left: rect.left,
        top: rect.top,
        width: offsetWidth,
        height: offsetHeight,
    }
}

/**
 * 获取边界信息
 * @author  韦胜健
 * @date    2020/9/22 9:19
 */
export const getBoundaryPos = (boundary: Boundary | undefined | null, popperRect: { width: number, height: number }): {
    maxTop: number,
    minTop: number,
    maxLeft: number,
    minLeft: number,
} => {
    if (!boundary) {
        return {
            maxTop: Infinity,
            minTop: -Infinity,
            maxLeft: Infinity,
            minLeft: -Infinity,
        }
    } else {
        const boundaryEl = getEl(boundary)!
        const {top, left, height, width} = getPos(boundaryEl)

        return {
            maxTop: top + height - popperRect.height,
            minTop: top,
            maxLeft: left + width - popperRect.width,
            minLeft: left,
        }
    }
}

/**
 * 根据placement获取位置信息
 * @author  韦胜健
 * @date    2020/9/22 9:53
 */
export function adjustPlacement(placement: PlacementType, referencePos: Pos, popperPos: Pos, offset: number, padding: number): {
    pos: { top: number, left: number },
    direction: Direction,
    align: Align,
} {

    let [direction, align] = placement.split('-') as [Direction, Align]
    align = align || Align.center
    let left, top;

    if (isVertical(direction)) {
        top = direction === Direction.top ?
            (referencePos.top - (popperPos.height - padding))
            : (referencePos.top + (referencePos.height - padding))
        switch (align) {
            case Align.start:
                left = referencePos.left
                break
            case Align.center:
                left = referencePos.left - (popperPos.width - referencePos.width) / 2
                break
            case Align.end:
                left = referencePos.left + referencePos.width - popperPos.width
                break
        }
        left -= padding
    } else {
        left = direction === Direction.left ?
            (referencePos.left - (popperPos.width - padding))
            : (referencePos.left + (referencePos.width - padding))
        switch (align) {
            case Align.start:
                top = referencePos.top
                break
            case Align.center:
                top = referencePos.top - (popperPos.height - referencePos.height) / 2
                break
            case Align.end:
                top = referencePos.top + referencePos.height - popperPos.height
                break
        }
        top -= padding
    }

    switch (direction) {
        case Direction.top:
            top -= offset;
            break
        case Direction.bottom:
            top += offset
            break
        case Direction.left:
            left -= offset
            break
        case Direction.right:
            left += offset
            break
    }


    return {
        pos: {
            top,
            left,
        },
        direction,
        align,
    }
}

/**
 * 给元素 设置位置
 * @author  韦胜健
 * @date    2020/9/22 10:14
 */
export function setPos(el: HTMLElement, {left, top}: { top: number, left: number }, gpuAcceleration: boolean) {
    if (gpuAcceleration) {
        left = Math.ceil(left)
        top = Math.ceil(top)
        if (left % 2 !== 0) left++
        if (top % 2 !== 0) top++
        el.style.transform = `translate3d(${left}px,${top}px,0)`
        el.style.transitionDuration = '0ms'
        el.style.willChange = 'transform'
    } else {
        el.style.left = `${left}px`
        el.style.top = `${top}px`
    }
}

const origin = {
    'top-start': 'bottom left',
    'top-center': 'bottom center',
    'top-end': 'bottom right',
    'bottom-start': 'top left',
    'bottom-center': 'top center',
    'bottom-end': 'top right',
    'left-start': 'right top',
    'left-center': 'right center',
    'left-end': 'right bottom',
    'right-start': 'left top',
    'right-center': 'left center',
    'right-end': 'left bottom',
}

/**
 * 根据 placement 获取transform动画的origin
 * @author  韦胜健
 * @date    2020/9/22 10:19
 */
export function getTransformOriginByPlacement(placement: PlacementType) {
    return origin[placement]
}

