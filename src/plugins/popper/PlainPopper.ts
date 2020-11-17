import {adjustPlacement, Align, debounce, Direction, getBoundaryPos, getPos, getTransformOriginByPlacement, isVertical, PlacementType, PlainPopperConfig, setPos} from "./PlainPopperUtils";
import {StyleType} from "./type";

export class PlainPopper {

    private readonly content: HTMLElement
    private readonly arrow: HTMLElement | null
    private readonly arrowSize: number

    private get offset(): number {
        return this.config.offset! + this.arrowSize
    }

    constructor(private config: PlainPopperConfig) {

        (config.padding == null && (config.padding = 10));
        (config.offset == null && (config.offset = 0));
        (config.placement == null && (config.placement = 'bottom-start'));
        (config.arrowSize == null && (config.arrowSize = 12));

        this.content = config.popper.querySelector('.plain-popper-content') as HTMLElement
        this.arrowSize = !config.arrowSize ? 0 : Math.sqrt(Math.pow(config.arrowSize, 2) / 2)
        this.arrow = this.arrowSize == 0 ? null : config.popper.querySelector('.plain-popper-arrow') as HTMLElement

        this.init()
    }

    private init() {

        /*---------------------------------------init PlainPopper styles-------------------------------------------*/

        /*popper styles*/
        Object.assign(this.config.popper.style, {
            overflow: 'hidden',
            position: 'fixed',
            pointerEvents: 'none',
        } as StyleType)

        /*content styles*/
        Object.assign(this.content.style, {
            pointerEvents: 'auto',
            position: 'relative',
            boxSizing: 'border-box',
        } as StyleType)

        /*arrow styles*/
        if (this.arrowSize > 0) {
            Object.assign(this.arrow!.style, {
                height: `${this.arrowSize}px`,
                width: `${this.arrowSize}px`,

                position: 'absolute',
                pointerEvents: 'none',
                backgroundColor: 'inherit',
                boxShadow: '-2px -2px 5px rgba(0, 0, 0, .1)',
            } as StyleType)
        }

        /*---------------------------------------init done-------------------------------------------*/

        this.refresh()
        this.bindEvent()
    }

    public refresh(forceTransform = false) {
        let left: number, top: number;
        const {offset, content} = this
        const {popper, reference, boundary, placement, gpuAcceleration} = this.config
        const {padding} = this.config as { offset: number, padding: number }

        const contentPos = getPos(content)
        const referencePos = getPos(reference)

        const {maxTop, minTop, maxLeft, minLeft} = getBoundaryPos(boundary, contentPos, padding)
        let {pos, direction, align} = adjustPlacement(placement!, referencePos, contentPos, offset, padding)

        switch (direction) {
            case Direction.top:
                if (pos.top < minTop) {
                    const {pos: bottomPos} = adjustPlacement(`bottom-${align}` as Direction, referencePos, contentPos, offset, padding)
                    if (bottomPos.top > maxTop) {
                        top = pos.top
                    } else {
                        top = Math.max(minTop, bottomPos.top)
                        direction = Direction.bottom
                    }
                } else {
                    top = Math.min(maxTop, pos.top)
                }
                left = Math.min(maxLeft, Math.max(minLeft, pos.left))
                break
            case Direction.bottom:
                if (pos.top > maxTop) {
                    const {pos: topPos} = adjustPlacement(`top-${align}` as Direction, referencePos, contentPos, offset, padding)
                    if (topPos.top < minTop) {
                        top = pos.top
                    } else {
                        top = Math.min(maxTop, topPos.top)
                        direction = Direction.top
                    }
                } else {
                    top = Math.max(minTop, pos.top)
                }
                left = Math.min(maxLeft, Math.max(minLeft, pos.left))
                break
            case Direction.left:
                if (pos.left < minLeft) {
                    const {pos: rightPos} = adjustPlacement(`right-${align}` as Direction, referencePos, contentPos, offset, padding)
                    if (rightPos.left > maxLeft) {
                        left = pos.left
                    } else {
                        left = Math.max(minLeft, rightPos.left)
                        direction = Direction.right
                    }
                } else {
                    left = Math.min(maxLeft, pos.left)
                }
                top = Math.min(maxTop, Math.max(minTop, pos.top))
                break
            case Direction.right:
                if (pos.left > maxLeft) {
                    const {pos: leftPos} = adjustPlacement(`left-${align}` as Direction, referencePos, contentPos, offset, padding)
                    if (leftPos.left < minLeft) {
                        left = pos.left
                    } else {
                        left = Math.min(maxLeft, leftPos.left)
                        direction = Direction.left
                    }
                } else {
                    left = Math.max(minLeft, pos.left)
                }
                top = Math.min(maxTop, Math.max(minTop, pos.top))
                break
        }

        (() => {

            const paddingProp = isVertical(direction) ?
                (direction === Direction.top ? 'Bottom' : 'Top') :
                (direction === Direction.left ? 'Right' : 'Left');

            ['Top', 'Bottom', 'Left', 'Right'].forEach(item => {
                if (item === paddingProp) {
                    this.config.popper.style[`padding${item}` as any] = `${offset}px`;
                } else {
                    this.config.popper.style[`padding${item}` as any] = `${padding}px`;
                }
            })

            switch (paddingProp) {
                case "Top":
                    top += (padding - offset)
                    break
                case "Bottom":
                    break
                case "Left":
                    left += (padding - offset)
                    break
                case "Right":
                    break
            }
        })();

        setPos(this.config.popper, {left, top}, forceTransform ? true : !!gpuAcceleration)

        this.content.style.transformOrigin = getTransformOriginByPlacement(`${direction}-${align}` as PlacementType);

        popper.setAttribute('direction', direction)
        popper.setAttribute('align', align)

        this.refreshArrow(direction, align, forceTransform)
    }

    private refreshArrow(direction: Direction, align: Align, forceTransform: boolean) {

        if (!this.arrow) {
            return
        }

        const contentPos = getPos(this.content)

        const {arrowSize} = this
        let top: number, left: number;
        let rotate = 0
        switch (direction) {
            case Direction.top:
                top = contentPos.height - arrowSize / 2
                rotate = 225
                break
            case Direction.bottom:
                top = -arrowSize / 2
                rotate = 45
                break
            case Direction.left:
                left = contentPos.width - arrowSize / 2
                rotate = 135
                break
            case Direction.right:
                left = -arrowSize / 2
                rotate = -45
                break
        }

        const paddingSize = arrowSize * 2

        if (isVertical(direction)) {
            switch (align) {
                case Align.start:
                    left = paddingSize
                    break
                case Align.center:
                    left = (contentPos.width - arrowSize) / 2
                    break
                case Align.end:
                    left = (contentPos.width - arrowSize) - paddingSize
                    break
            }
        } else {
            switch (align) {
                case Align.start:
                    top = paddingSize
                    break
                case Align.center:
                    top = (contentPos.height - arrowSize) / 2
                    break
                case Align.end:
                    top = (contentPos.height - arrowSize) - paddingSize
                    break
            }
        }

        const gpuAcceleration = forceTransform ? true : !!this.config.gpuAcceleration

        setPos(this.arrow!, {top: top!, left: left!}, gpuAcceleration)

        /*rotate arrow*/

        const transformRotate = `rotate(${rotate}deg)`

        Object.assign(this.arrow.style, {
            transform: gpuAcceleration ? `${this.arrow.style.transform} ${transformRotate}` : transformRotate
        } as StyleType)

    }

    private scrollEventListener: { el: HTMLElement, listener: Function }[] = []         //鉴定父元素滚动事件


    /**
     * 浏览器窗口变化，重新计算定位
     * @author  韦胜健
     * @date    2019/11/29 22:03
     */
    private onWindowResize = () => {
        this.refresh()
    }

    resetPositioningMode = debounce(() => {
        this.refresh()
    }, 150)

    private onParentScroll = () => {
        if (!!this.config.shouldUpdate) {
            const flag = this.config.shouldUpdate()
            if (!flag) {
                return
            }
        }
        /*
        *  滚动的时候，自动切换为 transform 定位，提高页面渲染性能
        */
        this.refresh(true)
        this.resetPositioningMode()
        // this.refresh()
    }

    private bindEvent() {
        let parentEl = this.config.reference.parentNode as HTMLElement
        while (!!parentEl) {
            parentEl.addEventListener('scroll', this.onParentScroll)
            this.scrollEventListener.push({el: parentEl, listener: this.onParentScroll})
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
            let {el, listener} = scrollEventListener.pop()!
            el.removeEventListener('scroll', listener as any)
        }
        window.removeEventListener('resize', this.onWindowResize)
    }

    public destroy() {
        this.unbindEvent()
    }

    /**
     * 修改绑定位置
     * @author  韦胜健
     * @date    2019/11/30 18:33
     */
    public setPlacement(placement: PlacementType) {
        this.config.placement = placement
        this.refresh()
    }
}