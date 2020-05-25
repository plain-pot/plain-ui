import {PopperTriggerType} from "@/packages/popper/PopperTrigger";

export function getDropdownTrigger(triggerName: PopperTriggerType,{

}:{
    model: { value: boolean | undefined },
    open: { value: boolean | undefined },

    show: Function,
    hide: Function,

    hoverOpenDelay: number,
    hoverCloseDelay: number,
    reference: HTMLElement,
    popper: HTMLElement,

    on: {
        clickReference: Function,
        clickBody: Function,
    },
    off: {
        clickReference: Function,
        clickBody: Function,
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

}