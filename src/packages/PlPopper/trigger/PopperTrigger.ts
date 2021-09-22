import {getBaseTrigger} from "./BaseTrigger";
import {SimpleFunction} from "plain-ui-composition"

export class PopperTrigger {
    data: any

    constructor(
        public name: PopperTriggerType,             // 触发器名称
        public init: SimpleFunction,                // 触发器初始化的时候执行函数
        public destroy: SimpleFunction              // 触发器销毁的时候执行函数
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

    show: SimpleFunction,
    hide: SimpleFunction,

    hoverOpenDelay: number,
    hoverCloseDelay: number,
    reference: HTMLElement,

    on: {
        onClickReference: SimpleFunction,
        onClickBody: SimpleFunction,
        onClickPopper: SimpleFunction,
        onEnterPopper: SimpleFunction,
        onLeavePopper: SimpleFunction,
    },
    off: {
        onClickReference: SimpleFunction,
        onClickBody: SimpleFunction,
        onClickPopper: SimpleFunction,
        onEnterPopper: SimpleFunction,
        onLeavePopper: SimpleFunction,
    },
    emit: {
        onReferenceFocus: SimpleFunction,
        onReferenceBlur: SimpleFunction,
        onEnterReference: SimpleFunction,
        onLeaveReference: SimpleFunction,
        onEnterPopper: SimpleFunction,
        onLeavePopper: SimpleFunction,
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
            onEnterReference: (cb) => reference.addEventListener('mouseenter', cb),
            onLeaveReference: (cb) => reference.addEventListener('mouseleave', cb),
            onReferenceFocus: (cb) => reference.addEventListener('focus', cb),
            onReferenceBlur: (cb) => reference.addEventListener('blur', cb),

            onEnterPopper: on.onEnterPopper,
            onLeavePopper: on.onLeavePopper,
            onClickReference: on.onClickReference,
            onClickBody: on.onClickBody,
            onClickPopper: on.onClickPopper,
        },
        off: {
            onEnterReference: (cb) => reference.removeEventListener('mouseenter', cb),
            onLeaveReference: (cb) => reference.removeEventListener('mouseleave', cb),
            onReferenceFocus: (cb) => reference.removeEventListener('focus', cb),
            onReferenceBlur: (cb) => reference.removeEventListener('blur', cb),

            onEnterPopper: off.onEnterPopper,
            onLeavePopper: off.onLeavePopper,
            onClickReference: off.onClickReference,
            onClickBody: off.onClickBody,
            onClickPopper: off.onClickPopper,
        },
        emit: emit,
    })
}
