import {getBaseTrigger} from "@/packages/popper/BaseTrigger";

export class PopperTrigger {
    data: any

    constructor(
        public name: PopperTriggerType,     // 触发器名称
        public init: Function,              // 触发器初始化的时候执行函数
        public destroy: Function            // 触发器销毁的时候执行函数
    ) {
    }
}

export enum PopperTriggerType {
    hover = 'hover',
    click = 'click',
    focus = 'focus',
    manual = 'manual'
}

export function getPopperTrigger(triggerName: PopperTriggerType, {
    model,
    openModel,

    show,
    hide,

    hoverOpenDelay,
    hoverCloseDelay,
    reference,

    on,
    off,
    emit,
}: {
    model: { value: boolean | undefined },
    openModel: { value: boolean | undefined },

    show: Function,
    hide: Function,

    hoverOpenDelay: number,
    hoverCloseDelay: number,
    reference: HTMLElement,

    on: {
        clickReference: Function,
        clickBody: Function,
        clickPopper: Function,
        enterPopper: Function,
        leavePopper: Function,
    },
    off: {
        clickReference: Function,
        clickBody: Function,
        clickPopper: Function,
        enterPopper: Function,
        leavePopper: Function,
    },
    emit: {
        referenceFocus: Function,
        referenceBlur: Function,
        enterReference: Function,
        leaveReference: Function,
        enterPopper: Function,
        leavePopper: Function,
    },

}) {
    return getBaseTrigger(triggerName, {
        model,
        openModel,
        show,
        hide,

        hoverOpenDelay,
        hoverCloseDelay,
        reference,

        on: {
            enterReference: (cb) => reference.addEventListener('mouseenter', cb),
            leaveReference: (cb) => reference.addEventListener('mouseleave', cb),
            referenceFocus: (cb) => reference.addEventListener('focus', cb),
            referenceBlur: (cb) => reference.addEventListener('blur', cb),

            enterPopper: on.enterPopper,
            leavePopper: on.leavePopper,
            clickReference: on.clickReference,
            clickBody: on.clickBody,
            clickPopper: on.clickPopper,
        },
        off: {
            enterReference: (cb) => reference.removeEventListener('mouseenter', cb),
            leaveReference: (cb) => reference.removeEventListener('mouseleave', cb),
            referenceFocus: (cb) => reference.removeEventListener('focus', cb),
            referenceBlur: (cb) => reference.removeEventListener('blur', cb),

            enterPopper: off.enterPopper,
            leavePopper: off.leavePopper,
            clickReference: off.clickReference,
            clickBody: off.clickBody,
            clickPopper: off.clickPopper,
        },
        emit: emit,
    })
}