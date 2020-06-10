import {PopperTriggerType} from "@/packages/popper/PopperTrigger";
import {getBaseTrigger} from "@/packages/popper/BaseTrigger";

export function getDropdownTrigger(triggerName: PopperTriggerType, {
    model,
    open,
    show,
    hide,
    hoverCloseDelay,
    hoverOpenDelay,
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
        enterPopper: Function,
        leavePopper: Function,

        clickReference: Function,
        clickBody: Function,
        clickPopper: Function,
    },
    off: {
        enterPopper: Function,
        leavePopper: Function,

        clickReference: Function,
        clickBody: Function,
        clickPopper: Function,
    },
    emit: {
        referenceFocus: Function,
        referenceBlur: Function,

        enterReference: Function,
        leaveReference: Function,
    },
}) {
    return getBaseTrigger(triggerName, {
        model,
        openModel: open,
        show,
        hide,
        hoverOpenDelay,
        hoverCloseDelay,
        reference,
        on: {
            enterReference: (cb) => reference.addEventListener('mouseenter', cb),
            leaveReference: (cb) => reference.addEventListener('mouseleave', cb),
            enterPopper: on.enterPopper,
            leavePopper: on.leavePopper,
            referenceFocus: (cb) => reference.addEventListener('focus', cb),
            referenceBlur: (cb) => reference.addEventListener('blur', cb),
            clickReference: on.clickReference,
            clickBody: on.clickBody,
            clickPopper: on.clickPopper,
        },
        off: {
            enterReference: (cb) => reference.removeEventListener('mouseenter', cb),
            leaveReference: (cb) => reference.removeEventListener('mouseleave', cb),
            enterPopper: off.enterPopper,
            leavePopper: off.leavePopper,
            referenceFocus: (cb) => reference.removeEventListener('focus', cb),
            referenceBlur: (cb) => reference.removeEventListener('blur', cb),
            clickReference: off.clickReference,
            clickBody: off.clickBody,
            clickPopper: off.clickPopper,
        },
        emit: {
            referenceFocus: emit.referenceFocus,
            referenceBlur: emit.referenceBlur,

            enterReference: emit.enterReference,
            leaveReference: emit.leaveReference,

            enterPopper: () => undefined,
            leavePopper: () => undefined,
        },
    })
}