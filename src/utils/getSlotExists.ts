import {ComponentInternalInstance} from "vue"

export function getSlotExist(prevState: { [k: string]: boolean } | null, slotNames: string[], ctx: ComponentInternalInstance) {
    if (!prevState) {
        prevState = {}
    }
    slotNames.forEach((slotName) => {
        prevState![slotName] = !!ctx.slots[slotName]
    })
    return prevState
}