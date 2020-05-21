import {Ref} from "@vue/composition-api";

export class PopperTrigger {
    data: any

    constructor(
        public name: PopperTriggerType,     // 触发器名称
        public init: Function,              // 触发器初始化的时候执行函数
        public destroy: Function            // 触发器销毁的时候执行函数
    ) {
        this.data = {}
    }
}

export enum PopperTriggerType {
    hover = 'hover',
    click = 'click',
    focus = 'focus',
    manual = 'manual'
}

export function getTrigger(triggerName: PopperTriggerType, {
    model,
    show,
    hide,
    emitEnterReference,
    emitLeaveReference,
    emitEnterPopper,
    emitLeavePopper,
    hoverOpenDelay,
    hoverCloseDelay,
    reference,
    popper,

    emitReferenceFocus,
    emitReferenceBlur,

    open,
    on,
    off,

}: {
    model: { value: boolean | undefined },
    open: { value: boolean | undefined },

    show: Function,
    hide: Function,

    emitEnterReference: Function,
    emitLeaveReference: Function,
    emitEnterPopper: Function,
    emitLeavePopper: Function,

    hoverOpenDelay: number,
    hoverCloseDelay: number,
    reference: HTMLElement,
    popper: HTMLElement,

    emitReferenceFocus: Function,
    emitReferenceBlur: Function,

    on: {
        clickReference: Function,
        clickBody: Function,
    },
    off: {
        clickReference: Function,
        clickBody: Function,
    },

}) {
    switch (triggerName) {
        case PopperTriggerType.hover:
            return getHoverTrigger({
                model,
                show,
                hide,
                emitEnterReference,
                emitLeaveReference,
                emitEnterPopper,
                emitLeavePopper,
                hoverOpenDelay,
                hoverCloseDelay,
                reference,
                popper,
            })
        case PopperTriggerType.click:
            return getClickTrigger({
                model,
                show,
                hide,
                open,
                on,
                off,
            })
        case PopperTriggerType.focus:
            return getFocusTrigger({
                show,
                hide,
                emitReferenceBlur,
                emitReferenceFocus,
                reference,
            })
        case PopperTriggerType.manual:
            return getManualTrigger();
        default:
            throw new Error(`can't recognise trigger: ${triggerName}`)
    }
}

function getHoverTrigger({
                             model,
                             show,
                             hide,
                             emitEnterReference,
                             emitLeaveReference,
                             emitEnterPopper,
                             emitLeavePopper,
                             hoverOpenDelay,
                             hoverCloseDelay,
                             reference,
                             popper,
                         }: {
    model: { value: boolean | undefined },
    show: Function,
    hide: Function,
    emitEnterReference: Function,
    emitLeaveReference: Function,
    emitEnterPopper: Function,
    emitLeavePopper: Function,
    hoverOpenDelay: number,
    hoverCloseDelay: number,
    reference: HTMLElement,
    popper: HTMLElement,

}) {
    let closeTimer: number | undefined;
    let openTimer: number | undefined;

    const handler = {
        reference: {
            enter: () => {
                if (!!closeTimer) {
                    clearTimeout(closeTimer)
                    closeTimer = undefined
                }
                openTimer = setTimeout(() => {
                    show()
                    openTimer = undefined
                    emitEnterReference(model.value)
                }, hoverOpenDelay)
            },
            leave: () => {
                if (!!openTimer) {
                    clearTimeout(openTimer)
                    openTimer = undefined
                }
                closeTimer = setTimeout(() => {
                    hide()
                    closeTimer = undefined
                    emitLeaveReference(model.value)
                }, hoverCloseDelay)
            },
        },
        popper: {
            enter: () => {
                if (!!closeTimer) {
                    clearTimeout(closeTimer)
                    closeTimer = undefined
                }
                openTimer = setTimeout(() => {
                    show()
                    openTimer = undefined
                    emitEnterPopper(model.value)
                }, hoverOpenDelay)
            },
            leave: () => {
                if (!!openTimer) {
                    clearTimeout(openTimer)
                    openTimer = undefined
                }
                closeTimer = setTimeout(() => {
                    hide()
                    closeTimer = undefined
                    emitLeavePopper(model.value)
                }, hoverCloseDelay)
            },
        },
    }

    return new PopperTrigger(
        PopperTriggerType.hover,
        () => {
            reference.addEventListener('mouseenter', handler.reference.enter)
            reference.addEventListener('mouseleave', handler.reference.leave)
            popper.addEventListener('mouseenter', handler.popper.enter)
            popper.addEventListener('mouseleave', handler.popper.leave)
        },
        () => {
            reference.removeEventListener('mouseenter', handler.reference.enter)
            reference.removeEventListener('mouseleave', handler.reference.leave)
            popper.removeEventListener('mouseenter', handler.popper.enter)
            popper.removeEventListener('mouseleave', handler.popper.leave)
        }
    )
}

function getClickTrigger({
                             model,
                             show,
                             hide,
                             open,
                             on,
                             off,
                         }: {
    model: { value: boolean | undefined },
    show: Function,
    hide: Function,
    open: { value: boolean | undefined },

    on: {
        clickReference: Function,
        clickBody: Function,
    },
    off: {
        clickReference: Function,
        clickBody: Function,
    },

}) {

    const handler = {
        clickReference: () => {
            if (model.value) {
                hide()
            } else {
                show()
            }
        },
        clickBody: () => {
            if (open.value) {
                hide()
            }
        },
    }

    return new PopperTrigger(
        PopperTriggerType.click,
        () => {
            on.clickReference(handler.clickReference)
            on.clickBody(handler.clickBody)
        },
        () => {
            off.clickReference(handler.clickReference)
            off.clickBody(handler.clickBody)
        },
    )
}

function getFocusTrigger(
    {
        show,
        hide,
        emitReferenceBlur,
        emitReferenceFocus,
        reference,
    }: {
        show: Function,
        hide: Function,
        emitReferenceFocus: Function,
        emitReferenceBlur: Function,
        reference: HTMLElement,
    }
) {

    let oldTabIndex;
    const handler = {
        focus: (e) => {
            emitReferenceFocus(e)
            show()
        },
        blur: (e) => {
            emitReferenceBlur(e)
            hide()
        },
    }

    return new PopperTrigger(PopperTriggerType.focus,
        () => {
            oldTabIndex = reference.getAttribute('tabindex')
            if (oldTabIndex == null) {
                reference.setAttribute('tabindex', '0')
            }
            reference.addEventListener('focus', handler.focus)
            reference.addEventListener('blur', handler.blur)
        },
        () => {
            if (oldTabIndex == null) {
                reference.removeAttribute('tabindex')
            } else {
                reference.setAttribute('tabindex', oldTabIndex)
            }
            reference.removeEventListener('focus', handler.focus)
            reference.removeEventListener('blur', handler.blur)
        },
    )
}

function getManualTrigger() {
    return new PopperTrigger(PopperTriggerType.manual,
        () => {
        },
        () => {
        },
    )
}