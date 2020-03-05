import {RusionPlacementType, RusionPopperOption, RusionPopperType, RusionTooltipAnimate, RusionTooltipOption, RusionTooltipTrigger} from "./types";
import {addClass} from "./utils";

interface Position {
    left: number
    top: number
    width: number
    height: number
}

/**
 * 边界信息
 * @author  韦胜健
 * @date    2019/11/29 22:20
 */
class BoundaryData {
    el: HTMLElement         //边界dom对象
    maxTop: number          //popper最大top
    minTop: number          //popper最小top
    maxLeft: number         //popper最大left
    minLeft: number         //popper最小left

    constructor(boundary: HTMLElement | string | null, popperPosition: Position) {
        if (!boundary) {
            this.maxTop = Infinity
            this.minTop = -Infinity
            this.maxLeft = Infinity
            this.minLeft = -Infinity
        } else {
            this.el = RusionPopper.getEl(boundary)
            let boundaryPosition = RusionPopper.getPosition(this.el)
            this.maxTop = boundaryPosition.top + boundaryPosition.height - popperPosition.height
            this.minTop = boundaryPosition.top
            this.maxLeft = boundaryPosition.left + boundaryPosition.width - popperPosition.width
            this.minLeft = boundaryPosition.left
        }
    }
}

interface PopperData {
    left: number
    top: number
    width: number
    height: number
    direction: string
    align: string
}

class RusionPopper implements RusionPopperType {

    popperEl: HTMLElement;                                                      //弹出层dom
    targetEl: HTMLElement;                                                      //目标元素dom
    offset: number                                                              //弹出层dom与目标dom的距离
    boundary: HTMLElement | string;                                             //边界元素
    placement: RusionPlacementType | null;                                      //位置
    backgroundColor: string                                                     //背景色
    boxShadow: string                                                           //阴影
    border: string                                                              //边框
    arrow: boolean                                                              //是否需要箭头
    arrowSize: number                                                           //箭头大小
    gpuAcceleration: boolean                                                    //是否使用3d transform定位，否则使用top和left进行定位

    scrollEventListener: Array<{ el: HTMLElement, listener: Function }> = []    //鉴定父元素滚动事件
    popperData: PopperData                                                      //popper相关数据

    arrowEl: HTMLElement;                                                       //箭头dom元素
    arrowInnerEl: HTMLElement;                                                  //箭头内方块dom元素
    contentEl: HTMLElement

    private arrowScale = 0.6
    private static transformOriginMap = {
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

    constructor(option: RusionPopperOption) {
        this.popperEl = option.popperEl
        this.targetEl = option.targetEl

        this.offset = option.offset || 0
        this.boundary = option.boundary
        this.placement = option.placement || 'bottom-start'
        this.backgroundColor = option.backgroundColor || 'white'
        this.boxShadow = option.boxShadow || '0 0 4px rgba(0,0,0,0.1)'
        this.border = option.border || '1px solid #e4e7ed'
        this.arrow = option.arrow == null ? false : option.arrow
        this.arrowSize = option.arrowSize || 16
        this.gpuAcceleration = option.gpuAcceleration == null ? true : option.gpuAcceleration

        if (!!option.arrow) {
            this.arrowEl = this.popperEl.querySelector('.rusion-popper-arrow')
            if (!this.arrowEl) {
                throw new Error(`Please add arrow element(div.rusion-popper-arrow) under popper element!`)
            }
            Object.assign(this.arrowEl.style, {
                position: 'absolute',
                overflow: 'hidden',
                left: '0',
                top: '0',
                // backgroundColor: '#ddd',
            })
            let innerEl = this.arrowEl.querySelector('.rusion-popper-arrow-inner') as HTMLElement
            if (!innerEl) {
                innerEl = document.createElement('div')
                addClass(innerEl, 'rusion-popper-arrow-inner')
                this.arrowEl.appendChild(innerEl)
            }
            Object.assign(innerEl.style, {
                position: 'relative',
                transform: `rotate(45deg)`,
                backgroundColor: this.backgroundColor,
                // backgroundColor: '#999',
                boxShadow: this.boxShadow,
                width: `${this.arrowSize * this.arrowScale}px`,
                height: `${this.arrowSize * this.arrowScale}px`,
            })
            this.arrowInnerEl = innerEl
            this.offset += this.arrowSize / 2
        }

        this.contentEl = this.popperEl.querySelector('.rusion-popper-content')
        if (!this.contentEl) {
            throw new Error(`Please add content element(div.rusion-popper > div.rusion-popper-content) under popper element!`)
        }
        Object.assign(this.contentEl.style, {
            backgroundColor: this.backgroundColor,
            boxShadow: this.boxShadow,
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            border: this.border,
        })

        Object.assign(this.popperEl.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            zIndex: '9999',
        })

        this.bindEvent()
        setTimeout(() => this.refresh(), 23)
    }

    /*---------------------------------------methods-------------------------------------------*/
    /**
     * 重新计算位置
     * @author  韦胜健
     * @date    2019/11/29 22:03
     */
    public refresh(): void {
        let left, top;

        const targetPosition = RusionPopper.getPosition(this.targetEl)
        const popperPosition = RusionPopper.getPosition(this.popperEl)

        let {maxTop, minTop, maxLeft, minLeft} = RusionPopper.getBoundaryData(this.boundary, popperPosition)

        let {position, direction, align} = RusionPopper.getPositionByPlacement(this.placement, targetPosition, popperPosition, this.offset)

        switch (direction) {
            case 'top':
                if (position.top < minTop) {
                    let {position: p} = RusionPopper.getPositionByPlacement(`bottom-${align}` as RusionPlacementType, targetPosition, popperPosition, this.offset)
                    if (p.top > maxTop) {
                        top = position.top
                    } else {
                        top = p.top
                        if (top < minTop) top = minTop
                        direction = 'bottom'
                    }
                } else {
                    top = position.top
                    if (top > maxTop) top = maxTop
                }
                left = Math.min(Math.max(position.left, minLeft), maxLeft)
                break
            case 'bottom':
                if (position.top > maxTop) {
                    let {position: p} = RusionPopper.getPositionByPlacement(`top-${align}` as RusionPlacementType, targetPosition, popperPosition, this.offset)
                    if (p.top < minTop) {
                        top = position.top
                    } else {
                        top = p.top
                        if (top > maxTop) top = maxTop
                        direction = 'top'
                    }
                } else {
                    top = position.top
                    if (top < minTop) top = minTop
                }
                left = Math.min(Math.max(position.left, minLeft), maxLeft)
                break
            case 'left':
                if (position.left < minLeft) {
                    let {position: p} = RusionPopper.getPositionByPlacement(`right-${align}` as RusionPlacementType, targetPosition, popperPosition, this.offset)
                    if (p.left > maxLeft) {
                        left = position.left
                    } else {
                        left = p.left
                        if (left < minLeft) left = minLeft
                        direction = 'right'
                    }
                } else {
                    left = position.left
                    if (left > maxLeft) left = maxLeft
                }
                top = Math.min(Math.max(position.top, minTop), maxTop)
                break
            case 'right':
                if (position.left > maxLeft) {
                    let {position: p} = RusionPopper.getPositionByPlacement(`left-${align}` as RusionPlacementType, targetPosition, popperPosition, this.offset)
                    if (p.left < minLeft) {
                        left = position.left
                    } else {
                        left = p.left
                        if (left > maxLeft) left = maxLeft
                        direction = 'left'
                    }
                } else {
                    left = position.left
                    if (left < minLeft) left = minLeft
                }
                top = Math.min(Math.max(position.top, minTop), maxTop)
                break
            default:
                throw new Error(`Can't recognise direction:${direction}`)
        }
        this.setPosition(this.popperEl, top, left)

        this.contentEl.style.transformOrigin = RusionPopper.transformOriginMap[`${direction}-${align}`]

        this.popperData = {
            left,
            top,
            height: popperPosition.height,
            width: popperPosition.width,
            direction,
            align,
        }

        this.refreshArrowPosition()
    }

    /**
     * 释放资源
     * @author  韦胜健
     * @date    2019/11/29 22:03
     */
    public destroy() {
        this.unbindEvent()
    }

    /**
     * 修改绑定位置
     * @author  韦胜健
     * @date    2019/11/30 18:33
     */
    public setPlacement(placement: RusionPlacementType | null) {
        this.placement = placement
        this.refresh()
    }

    /**
     * 重新计算箭头的位置
     * @author  韦胜健
     * @date    2019/12/2 9:41
     */
    private refreshArrowPosition() {

        if (!this.arrowEl) return
        let size = this.arrowSize

        let top, left
        let isVertical = ['top', 'bottom'].indexOf(this.popperData.direction) > -1

        switch (this.popperData.direction) {
            case 'top':
                /*不清楚这里为什么要-1，不-1的话，箭头和内容会有点距离*/
                top = this.popperData.height - 4
                break
            case 'bottom':
                top = -size / 2 + 2
                break
            case 'left':
                left = this.popperData.width - 4
                break
            case 'right':
                left = -size / 2 + 2
                break
        }

        if (isVertical) {
            switch (this.popperData.align) {
                case 'start':
                    left = 10
                    break
                case 'center':
                    left = (this.popperData.width - size) / 2
                    break
                case 'end':
                    left = this.popperData.width - 10 - size
                    break
            }
        } else {
            switch (this.popperData.align) {
                case 'start':
                    top = 10
                    break
                case 'center':
                    top = (this.popperData.height - size) / 2
                    break
                case 'end':
                    top = this.popperData.height - 10 - size
                    break
            }
        }

        this.setPosition(this.arrowEl, top, left)

        Object.assign(this.arrowEl.style, {
            width: `${!isVertical ? size / 2 : size}px`,
            height: `${isVertical ? size / 2 : size}px`,
            // width: `${size}px`,
            // height: `${size}px`,
            // transform: `translate3d(${left}px,${top}px,0)`
        })
        Object.assign(this.arrowInnerEl.style, {
            left: `${((1 - this.arrowScale) / 2 - (this.popperData.direction === 'left' ? 0.5 : 0)) * size}px`,
            top: `${((1 - this.arrowScale) / 2 - (this.popperData.direction === 'top' ? 0.5 : 0)) * size}px`,
        })
    }

    /*---------------------------------------utils-------------------------------------------*/

    /**
     * 绑定事件
     * @author  韦胜健
     * @date    2019/11/29 22:03
     */
    private bindEvent(): void {
        let parentEl = this.targetEl.parentNode as HTMLElement
        while (!!parentEl) {
            let listener = (e) => this.refresh()
            parentEl.addEventListener('scroll', listener)
            this.scrollEventListener.push({el: parentEl, listener})
            parentEl = parentEl.parentNode as HTMLElement
        }

        window.addEventListener('resize', this.onWindowResize)
    }

    /**
     * 解除绑定事件
     * @author  韦胜健
     * @date    2019/11/29 22:03
     */
    private unbindEvent(): void {
        let scrollEventListener = this.scrollEventListener
        while (scrollEventListener.length > 0) {
            let {el, listener} = scrollEventListener.pop()
            el.removeEventListener('scroll', listener as any)
        }
        window.removeEventListener('resize', this.onWindowResize)
    }

    private setPosition(el: HTMLElement, top: number, left: number) {

        left = Math.ceil(left)
        top = Math.ceil(top)

        if (this.gpuAcceleration) {

            if (left % 2 !== 0) left++
            if (top % 2 !== 0) top++
            el.style.transform = `translate3d(${left}px,${top}px,0)`
            el.style.transitionDuration = '0ms'
            el.style.willChange = 'transform'

            // el.style.marginLeft = `${left}px`
            // el.style.marginTop = `${top}px`
        } else {
            el.style.left = `${left}px`
            el.style.top = `${top}px`
        }
    }

    /*---------------------------------------handler-------------------------------------------*/

    /**
     * 浏览器窗口变化，重新计算定位
     * @author  韦胜健
     * @date    2019/11/29 22:03
     */
    onWindowResize = () => {
        this.refresh()
    }

    /*---------------------------------------static-------------------------------------------*/

    /**
     * 获取元素布局定位信息
     * @author  韦胜健
     * @date    2019/11/27 9:57
     */
    static getPosition(el: HTMLElement): Position {
        const {top, left, width, height} = el.getBoundingClientRect()
        return {
            left: Math.ceil(left),
            top: Math.ceil(top),
            width: Math.ceil(width),
            height: Math.ceil(height),
        }
    }

    /**
     * 获取dom对象
     * @author  韦胜健
     * @date    2019/11/29 22:14
     */
    static getEl(el: HTMLElement | string): HTMLElement {
        if (el as any === window || el === 'window') {
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
     * 根据placement获取定位信息
     * @author  韦胜健
     * @date    2019/11/30 23:06
     */
    static getPositionByPlacement:
        (placement: RusionPlacementType, targetPosition: Position, popperPosition, offset: number | null) => { position: Position, direction: string, align: string }
        = function (placement, targetPosition, popperPosition, offset) {

        let [direction, align] = placement.split('-')
        align = align || 'center'
        let left, top;

        if (['top', 'bottom'].indexOf(direction) > -1) {
            if (direction === 'top') {
                top = targetPosition.top - popperPosition.height
            } else {
                top = targetPosition.top + targetPosition.height
            }
            switch (align) {
                case 'start':
                    left = targetPosition.left
                    break
                case 'center':
                    left = targetPosition.left - (popperPosition.width - targetPosition.width) / 2
                    break
                case 'end':
                    left = targetPosition.left - (popperPosition.width - targetPosition.width)
                    break
                default:
                    throw new Error(`Can't recognise align:${align}`)
            }
        } else if (['left', 'right'].indexOf(direction) > -1) {
            if (direction === 'left') {
                left = targetPosition.left - popperPosition.width
            } else if (direction === 'right') {
                left = targetPosition.left + targetPosition.width
            }
            switch (align) {
                case 'start':
                    top = targetPosition.top
                    break
                case 'center':
                    top = targetPosition.top - (popperPosition.height - targetPosition.height) / 2
                    break
                case 'end':
                    top = targetPosition.top - (popperPosition.height - targetPosition.height)
                    break
                default:
                    throw new Error(`Can't recognise align:${align}`)
            }
        } else {
            throw new Error(`Can't recognise direction:${direction}`)
        }
        if (offset !== null) {
            switch (direction) {
                case 'top':
                    top -= offset
                    break
                case 'bottom':
                    top += offset
                    break
                case 'left':
                    left -= offset
                    break
                case 'right':
                    left += offset
                    break
            }
        }

        return {
            position: {
                top,
                left,
                height: null,
                width: null,
            },
            direction,
            align,
        }
    }

    /**
     * 获取边界信息
     * @author  韦胜健
     * @date    2019/11/30 23:06
     */
    static getBoundaryData:
        (boundary: HTMLElement | string | null, popperPosition: Position) => BoundaryData
        = function (boundary, popperPosition) {
        return new BoundaryData(boundary, popperPosition)
    }

    static RusionTooltip = null
}

class RusionTooltip {

    /*---------------------------------------local-------------------------------------------*/
    removeOnHide: boolean
    onContentTransitionEnd: Function = null

    /*---------------------------------------trigger-------------------------------------------*/
    trigger: RusionTooltipTrigger
    private triggerHandler: Function
    private static readonly triggers = {
        /*手动控制*/
        manual: {init: () => null, destroy: () => null},
        /*总是显示*/
        always: {
            init: (instance: any) => instance.show(),
            destroy: () => null
        },
        /*target获取焦点的时候显示*/
        focus: {
            init(instance: any, target: HTMLElement) {
                instance.triggerHandler = {focus: () => instance.show(), blur: () => instance.hide(),}
                target.addEventListener('focus', instance.triggerHandler.focus)
                target.addEventListener('blur', instance.triggerHandler.blur)
            },
            destroy(instance: any, target: HTMLElement) {
                target.removeEventListener('focus', instance.triggerHandler.focus)
                target.removeEventListener('blur', instance.triggerHandler.blur)
            },
        },
        /*target被点击的时候切换显示*/
        click: {
            init(instance: any, target: HTMLElement) {
                instance.triggerHandler = () => {
                    if (instance.isShow) instance.hide()
                    else instance.show()
                }
                target.addEventListener('click', instance.triggerHandler)
            },
            destroy(instance: any, target: HTMLElement) {
                target.removeEventListener('click', instance.triggerHandler)
            },
        },
        /*鼠标选择在target上时显示*/
        hover: {
            init(instance: any, target: HTMLElement) {
                instance.triggerHandler = {
                    mouseenter: () => instance.show(),
                    mouseleave: () => instance.hide(),
                }
                target.addEventListener('mouseenter', instance.triggerHandler.mouseenter)
                target.addEventListener('mouseleave', instance.triggerHandler.mouseleave)
            },
            destroy(instance: any, target: HTMLElement) {
                target.removeEventListener('mouseenter', instance.triggerHandler.mouseenter)
                target.removeEventListener('mouseleave', instance.triggerHandler.mouseleave)
            },
        },
    }
    /*---------------------------------------popper-------------------------------------------*/
    public isShow: boolean
    private isMounted: boolean = false
    private readonly contentEl: HTMLElement
    private readonly popperEl: HTMLElement
    private readonly targetEl: HTMLElement
    private readonly popper: RusionPopper
    /*---------------------------------------animate-------------------------------------------*/
    animate: RusionTooltipAnimate
    private static readonly animates = {
        drop: {
            show: {
                opacity: 1,
                transform: `scaleY(1)`
            },
            hide: {
                opacity: 0,
                transform: `scaleY(0)`
            },
        },
        scale: {
            show: {
                opacity: 1,
                transform: `scale(1)`
            },
            hide: {
                opacity: 0,
                transform: `scale(0.75)`
            },
        },
        fade: {
            show: {
                opacity: 1,
                transform: `scaleY(1)`                  //show和hide没有这个scaleY的话，在ie下arrow元素不会消失
            },
            hide: {
                opacity: 0,
                transform: `scaleY(1)`
            },
        },
    }
    /*---------------------------------------theme-------------------------------------------*/
    private static readonly themes = {
        public: {
            option: {
                arrow: true,
            },
        },
        dark: {
            option: {
                backgroundColor: '#444',
            },
            popperElStyles: {
                color: 'white'
            },
        },
        light: {
            option: {
                backgroundColor: 'white',
            },
            popperElStyles: {
                color: '#666'
            },
        },
    }

    constructor(option: RusionTooltipOption) {

        this.removeOnHide = option.removeOnHide == null ? true : option.removeOnHide

        /*theme*/
        let theme = option.theme || 'dark'
        let themeData;

        if (!RusionTooltip.themes[theme]) {
            throw new Error(`Can not recognise theme:${theme}`)
        } else {
            themeData = RusionTooltip.themes[theme]
        }

        /*animate*/
        let animate = option.animate || 'fade'
        if (!RusionTooltip.animates[animate]) {
            throw new Error(`Can not recognise animate:${animate}`)
        } else {
            this.animate = animate
        }

        /*popper*/
        let {targetEl, offset, boundary, placement, backgroundColor, boxShadow, arrow, arrowSize} = option

        let {popperEl, contentEl} = RusionPopper.RusionTooltip.createPopperEl()

        if (typeof option.content === 'string') {
            const textEl = document.createElement('span')
            textEl.innerHTML = option.content
            contentEl.appendChild(textEl)
        } else {
            contentEl.appendChild(option.content)
        }

        let popperOption = {targetEl, popperEl, offset, boundary, placement, backgroundColor, boxShadow, arrow, arrowSize}
        let defaultOption = Object.assign({}, RusionTooltip.themes.public.option, themeData.option)
        Object.keys(defaultOption).forEach(key => {
            if (popperOption[key] == null) popperOption[key] = defaultOption[key]
        })
        Object.assign(popperEl.style, themeData.popperElStyles)
        this.popper = new RusionPopper(popperOption)
        this.targetEl = targetEl
        this.popperEl = popperEl
        this.contentEl = contentEl
        this.contentEl.addEventListener('transitionend', this._onContentTransitionEnd)

        this.hide()

        /*trigger*/
        this.trigger = option.trigger || 'always'
        if (!RusionTooltip.triggers[this.trigger]) {
            throw new Error(`Can not recognise trigger:${this.trigger}`)
        } else {
            RusionTooltip.triggers[this.trigger].init(this, this.targetEl)
        }
    }

    show() {
        if (!this.isMounted) {
            document.body.appendChild(this.popperEl)
            this.isMounted = true
            this.popper.refresh()
        }
        setTimeout(() => {
            Object.assign(this.contentEl.style, RusionTooltip.animates[this.animate].show)
            this.isShow = true
            this.onContentTransitionEnd = () => {
                this.onContentTransitionEnd = null
            }
        }, 23)
    }

    hide() {
        Object.assign(this.contentEl.style, RusionTooltip.animates[this.animate].hide)
        this.isShow = false
        this.onContentTransitionEnd = () => {
            if (this.removeOnHide && !!this.isMounted) {
                document.body.removeChild(this.popperEl)
                this.isMounted = false
            }
            this.onContentTransitionEnd = null
        }
    }

    destroy() {
        RusionTooltip.triggers[this.trigger].destroy(this, this.targetEl)
        this.contentEl.removeEventListener('transitionend', this._onContentTransitionEnd)
        if (this.isMounted) document.body.removeChild(this.popperEl)
        this.popper.destroy()
    }

    /*---------------------------------------listener-------------------------------------------*/
    _onContentTransitionEnd = (e) => {
        !!this.onContentTransitionEnd && this.onContentTransitionEnd(e)
    }

    /*---------------------------------------static-------------------------------------------*/

    static tempPopperEl: HTMLElement

    static createPopperEl() {
        if (!RusionPopper.RusionTooltip.tempPopperEl) {
            let popperEl = document.createElement('div')
            addClass(popperEl, 'rusion-popper')

            let contentEl = document.createElement('div')
            addClass(contentEl, 'rusion-popper-content')
            popperEl.appendChild(contentEl)

            Object.assign(contentEl.style, {
                borderRadius: '4px',
                transition: `all 300ms cubic-bezier(0.23, 1, 0.32, 1)`,
                padding: '6px 9px',
                boxSizing: 'border-box',
                fontSize: '14px',
                maxWidth: '300px',
            })

            let arrowEl = document.createElement('div')
            addClass(arrowEl, 'rusion-popper-arrow')
            contentEl.appendChild(arrowEl)

            RusionPopper.RusionTooltip.tempPopperEl = popperEl
        }

        let popperEl = RusionPopper.RusionTooltip.tempPopperEl.cloneNode(true) as HTMLElement
        let contentEl = popperEl.querySelector('.rusion-popper-content') as HTMLElement
        let arrowEl = popperEl.querySelector('.rusion-popper-arrow') as HTMLElement

        return {
            popperEl,
            contentEl,
            arrowEl,
        }
    }

}

RusionPopper.RusionTooltip = RusionTooltip

export default RusionPopper