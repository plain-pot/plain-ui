import {StyleType} from "@/types/utils";
import {adjustPlacement, Direction, getBoundaryPos, getPos, getTransformOriginByPlacement, PlacementType, PlainPopperConfig, setPos} from "./PlainPopperUtils";

export class PlainPopper {

    content: HTMLElement
    arrow: HTMLElement | null
    arrowSize: number

    constructor(public config: PlainPopperConfig) {

        (config.padding == null && (config.padding = 0));
        (config.offset == null && (config.offset = 0));
        (config.placement == null && (config.placement = 'bottom-start'));
        (config.arrowSize == null && (config.arrowSize = 12));

        this.content = config.popper.querySelector('.plain-popper-content') as HTMLElement
        this.arrowSize = !config.arrowSize ? 0 : Math.sqrt(Math.pow(config.arrowSize, 2) / 2)
        this.arrow = this.arrowSize == 0 ? null : config.popper.querySelector('.plain-popper-arrow') as HTMLElement

        this.init()
    }

    init() {

        /*---------------------------------------init PlainPopper styles-------------------------------------------*/

        const plainPopperStyles = {
            padding: `${this.config.padding}px`,
        } as StyleType

        Object.assign(this.config.popper.style, plainPopperStyles)

        if (this.arrowSize > 0) {
            Object.assign(this.arrow!.style, {
                height: `${this.arrowSize}px`,
                width: `${this.arrowSize}px`,
            } as StyleType)
        }

        /*---------------------------------------init done-------------------------------------------*/

        this.refresh()
    }

    refresh() {
        let left: number, top: number;
        const {popper, reference, boundary, placement, gpuAcceleration} = this.config
        const {offset, padding} = this.config as { offset: number, padding: number }

        const popperPos = getPos(popper)
        const referencePos = getPos(reference)

        const {maxTop, minTop, maxLeft, minLeft} = getBoundaryPos(boundary, popperPos)
        let {pos, direction, align} = adjustPlacement(placement!, referencePos, popperPos, offset, padding)

        switch (direction) {
            case Direction.top:
                if (pos.top < minTop) {
                    const {pos: bottomPos} = adjustPlacement(`bottom-${align}` as Direction, referencePos, popperPos, offset, padding)
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
                    const {pos: topPos} = adjustPlacement(`top-${align}` as Direction, referencePos, popperPos, offset, padding)
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
                    const {pos: rightPos} = adjustPlacement(`right-${align}` as Direction, referencePos, popperPos, offset, padding)
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
                    const {pos: leftPos} = adjustPlacement(`left-${align}` as Direction, referencePos, popperPos, offset, padding)
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

        setPos(this.config.popper, {left, top}, !!gpuAcceleration)

        this.content.style.transformOrigin = getTransformOriginByPlacement(`${direction}-${align}` as PlacementType)
        popper.setAttribute('direction', direction)
        popper.setAttribute('align', align)
    }

}