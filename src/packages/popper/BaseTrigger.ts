import {PopperTrigger, PopperTriggerType} from "@/packages/popper/PopperTrigger";

export function getBaseTrigger(
    triggerName: PopperTriggerType,
    {
        model,
        open,

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
        open: { value: boolean | undefined },

        show: Function,
        hide: Function,

        hoverOpenDelay: number,
        hoverCloseDelay: number,
        reference: HTMLElement,

        on: {
            enterReference: Function,
            leaveReference: Function,

            enterPopper: Function,
            leavePopper: Function,

            referenceFocus: Function,
            referenceBlur: Function,

            clickReference: Function,
            clickBody: Function,
            clickPopper: Function,
        },
        off: {
            enterReference: Function,
            leaveReference: Function,

            enterPopper: Function,
            leavePopper: Function,

            referenceFocus: Function,
            referenceBlur: Function,

            clickReference: Function,
            clickBody: Function,
            clickPopper: Function,
        },
        emit: {
            referenceFocus: Function,
            referenceBlur: Function,

            enterReference: Function,
            leaveReference: Function,

            enterPopper: Function,
            leavePopper: Function,
        },
    },
) {
    switch (triggerName) {
        case PopperTriggerType.hover:
            return getHoverTrigger({
                model,
                show,
                hide,
                hoverOpenDelay,
                hoverCloseDelay,
                on,
                off,
                emit,
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
                reference,
                on,
                off,
                emit,
            })
        case PopperTriggerType.manual:
            return getManualTrigger()
    }
}

function getHoverTrigger({
                             model,
                             show,
                             hide,
                             hoverOpenDelay,
                             hoverCloseDelay,

                             on,
                             off,
                             emit,
                         }: {
    model: { value: boolean | undefined },
    show: Function,
    hide: Function,
    hoverOpenDelay: number,
    hoverCloseDelay: number,

    on: {
        enterReference: Function,
        leaveReference: Function,

        enterPopper: Function,
        leavePopper: Function,

        referenceFocus: Function,
        referenceBlur: Function,

        clickReference: Function,
        clickPopper: Function,
    },
    off: {
        enterReference: Function,
        leaveReference: Function,

        enterPopper: Function,
        leavePopper: Function,

        referenceFocus: Function,
        referenceBlur: Function,

        clickReference: Function,
        clickPopper: Function,
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
                    emit.enterReference(model.value)
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
                    emit.leaveReference(model.value)
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
                    emit.enterPopper(model.value)
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
                    emit.leavePopper(model.value)
                }, hoverCloseDelay)
            },
        },
    }

    return new PopperTrigger(
        PopperTriggerType.hover,
        () => {
            on.enterReference(handler.reference.enter)
            on.leaveReference(handler.reference.leave)

            on.enterPopper(handler.popper.enter)
            on.leavePopper(handler.popper.leave)
        },
        () => {
            off.enterReference(handler.reference.enter)
            off.leaveReference(handler.reference.leave)

            off.enterPopper(handler.popper.enter)
            off.leavePopper(handler.popper.leave)
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
        reference,
        on,
        off,
        emit,
    }: {
        show: Function,
        hide: Function,
        reference: HTMLElement,

        on: {
            referenceFocus: Function,
            referenceBlur: Function,
        },
        off: {
            referenceFocus: Function,
            referenceBlur: Function,
        },
        emit: {
            referenceFocus: Function,
            referenceBlur: Function,
        },
    }
) {

    let oldTabIndex;
    const handler = {
        focus: (e) => {
            emit.referenceFocus(e)
            show()
        },
        blur: (e) => {
            emit.referenceBlur(e)
            hide()
        },
    }

    return new PopperTrigger(PopperTriggerType.focus,
        () => {
            oldTabIndex = reference.getAttribute('tabindex')
            if (oldTabIndex == null) {
                reference.setAttribute('tabindex', '0')
            }
            on.referenceFocus(handler.focus)
            on.referenceBlur(handler.blur)
        },
        () => {
            if (oldTabIndex == null) {
                reference.removeAttribute('tabindex')
            } else {
                reference.setAttribute('tabindex', oldTabIndex)
            }
            off.referenceFocus(handler.focus)
            off.referenceBlur(handler.blur)
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