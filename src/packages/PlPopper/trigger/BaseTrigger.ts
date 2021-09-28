import {PopperTrigger, PopperTriggerType} from "./PopperTrigger";
import {SimpleFunction} from "plain-design-composition"

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
    show: SimpleFunction,
    hide: SimpleFunction,
    hoverOpenDelay: number,
    hoverCloseDelay: number,

    on: {
        onEnterReference: SimpleFunction,
        onLeaveReference: SimpleFunction,

        onEnterPopper: SimpleFunction,
        onLeavePopper: SimpleFunction,

        onReferenceFocus: SimpleFunction,
        onReferenceBlur: SimpleFunction,

        onClickReference: SimpleFunction,
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
                }, hoverOpenDelay) as any as number
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
                }, hoverCloseDelay) as any as number
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
                    // emit.onEnterPopper(model.value)
                }, hoverOpenDelay) as any as number
            },
            leave: () => {
                if (!!openTimer) {
                    clearTimeout(openTimer)
                    openTimer = undefined
                }
                closeTimer = setTimeout(() => {
                    hide()
                    closeTimer = undefined
                    // emit.onLeavePopper(model.value)
                }, hoverCloseDelay) as any as number
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
    show: SimpleFunction,
    hide: SimpleFunction,
    openModel: { value: boolean | undefined },

    on: {
        onClickReference: SimpleFunction,
        onClickBody: SimpleFunction,
    },
    off: {
        onClickReference: SimpleFunction,
        onClickBody: SimpleFunction,
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
        show: SimpleFunction,
        hide: SimpleFunction,
        reference: HTMLElement,

        on: {
            onReferenceFocus: SimpleFunction,
            onReferenceBlur: SimpleFunction,
        },
        off: {
            onReferenceFocus: SimpleFunction,
            onReferenceBlur: SimpleFunction,
        },
        emit: {
            onReferenceFocus: SimpleFunction,
            onReferenceBlur: SimpleFunction,
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
