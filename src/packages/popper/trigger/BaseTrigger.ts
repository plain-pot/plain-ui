import {PopperTrigger, PopperTriggerType} from "./PopperTrigger";
import {SimpleFunction} from "../../../shims";

export function getBaseTrigger(
    triggerName: PopperTriggerType,
    {
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
            onEnterReference: SimpleFunction,
            onLeaveReference: SimpleFunction,

            onEnterPopper: SimpleFunction,
            onLeavePopper: SimpleFunction,

            onReferenceFocus: SimpleFunction,
            onReferenceBlur: SimpleFunction,

            onClickReference: SimpleFunction,
            onClickBody: SimpleFunction,
            onClickPopper: SimpleFunction,
        },
        off: {
            onEnterReference: SimpleFunction,
            onLeaveReference: SimpleFunction,

            onEnterPopper: SimpleFunction,
            onLeavePopper: SimpleFunction,

            onReferenceFocus: SimpleFunction,
            onReferenceBlur: SimpleFunction,

            onClickReference: SimpleFunction,
            onClickBody: SimpleFunction,
            onClickPopper: SimpleFunction,
        },
        emit: {
            onReferenceFocus: SimpleFunction,
            onReferenceBlur: SimpleFunction,

            onEnterReference: SimpleFunction,
            onLeaveReference: SimpleFunction,

            onEnterPopper: SimpleFunction,
            onLeavePopper: SimpleFunction,
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
                openModel,
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
        onEnterReference: Function,
        onLeaveReference: Function,

        onEnterPopper: Function,
        onLeavePopper: Function,

        onReferenceFocus: Function,
        onReferenceBlur: Function,

        onClickReference: Function,
        onClickPopper: Function,
    },
    off: {
        onEnterReference: Function,
        onLeaveReference: Function,

        onEnterPopper: Function,
        onLeavePopper: Function,

        onReferenceFocus: Function,
        onReferenceBlur: Function,

        onClickReference: Function,
        onClickPopper: Function,
    },
    emit: {
        onReferenceFocus: Function,
        onReferenceBlur: Function,

        onEnterReference: Function,
        onLeaveReference: Function,

        onEnterPopper: Function,
        onLeavePopper: Function,
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
                    emit.onEnterReference(model.value)
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
                    emit.onLeaveReference(model.value)
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
                    emit.onEnterPopper(model.value)
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
                    emit.onLeavePopper(model.value)
                }, hoverCloseDelay)
            },
        },
    }

    return new PopperTrigger(
        PopperTriggerType.hover,
        () => {
            on.onEnterReference(handler.reference.enter)
            on.onLeaveReference(handler.reference.leave)

            on.onEnterPopper(handler.popper.enter)
            on.onLeavePopper(handler.popper.leave)
        },
        () => {
            off.onEnterReference(handler.reference.enter)
            off.onLeaveReference(handler.reference.leave)

            off.onEnterPopper(handler.popper.enter)
            off.onLeavePopper(handler.popper.leave)
        }
    )
}

function getClickTrigger({
                             model,
                             show,
                             hide,
                             openModel,
                             on,
                             off,
                         }: {
    model: { value: boolean | undefined },
    show: Function,
    hide: Function,
    openModel: { value: boolean | undefined },

    on: {
        onClickReference: Function,
        onClickBody: Function,
    },
    off: {
        onClickReference: Function,
        onClickBody: Function,
    },

}) {

    const handler = {
        onClickReference: () => {
            if (model.value) {
                hide()
            } else {
                show()
            }
        },
        onClickBody: () => {
            if (openModel.value) {
                hide()
            }
        },
    }

    return new PopperTrigger(
        PopperTriggerType.click,
        () => {
            on.onClickReference(handler.onClickReference)
            on.onClickBody(handler.onClickBody)
        },
        () => {
            off.onClickReference(handler.onClickReference)
            off.onClickBody(handler.onClickBody)
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
            onReferenceFocus: Function,
            onReferenceBlur: Function,
        },
        off: {
            onReferenceFocus: Function,
            onReferenceBlur: Function,
        },
        emit: {
            onReferenceFocus: Function,
            onReferenceBlur: Function,
        },
    }
) {

    let oldTabIndex: string | null;
    const handler = {
        focus: (e: FocusEvent) => {
            emit.onReferenceFocus(e)
            show()
        },
        blur: (e: Event) => {
            emit.onReferenceBlur(e)
            hide()
        },
    }

    return new PopperTrigger(PopperTriggerType.focus,
        () => {
            oldTabIndex = reference.getAttribute('tabindex')
            if (oldTabIndex == null) {
                reference.setAttribute('tabindex', '0')
            }
            on.onReferenceFocus(handler.focus)
            on.onReferenceBlur(handler.blur)
        },
        () => {
            if (oldTabIndex == null) {
                reference.removeAttribute('tabindex')
            } else {
                reference.setAttribute('tabindex', oldTabIndex)
            }
            off.onReferenceFocus(handler.focus)
            off.onReferenceBlur(handler.blur)
        },
    )
}

function getManualTrigger() {
    return new PopperTrigger(PopperTriggerType.manual,
        () => undefined,
        () => undefined,
    )
}