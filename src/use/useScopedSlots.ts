import {VNodeChild} from "../shims";
import {getCurrentInstance, reactive, onBeforeUpdate} from 'vue';

type ScopedSlotsOptionType = { [SlotName: string]: { [ScopeKey: string]: any } }

type ExtractScopedSlotsDataValue<ScopeValue> = ScopeValue extends new (...args: any[]) => infer R ? R : ScopeValue;

type ExtractScopedSlotsData<Scope extends { [ScopeKey: string]: any }> = {
    [k in keyof Scope]: ExtractScopedSlotsDataValue<Scope[k]>
}

type ScopedSlotsData<T extends ScopedSlotsOptionType> = {
    [k in keyof T]: ((scope: ExtractScopedSlotsData<T[k]>, vnode: VNodeChild) => void) & { isExist: () => boolean }
}

export function useScopedSlots<T extends ScopedSlotsOptionType>(options: T): { scopedSlots: ScopedSlotsData<T> } {

    const ctx = getCurrentInstance()!
    const slotNames = Object.keys(options)

    const ctxSlots = reactive(slotNames.reduce((prev: any, slotName) => (prev[slotName] = ctx.slots[slotName] || null, prev), {}) as any)
    onBeforeUpdate(() => slotNames.forEach(slotName => ctxSlots[slotName] = ctx.slots[slotName] || null))

    const scopedSlots = slotNames.reduce((prev: any, slotName: string) => {
        prev[slotName] = Object.assign((scope: any, vnode: VNodeChild) => {
            const slot = ctxSlots[slotName]
            return !!slot ? slot(scope) : vnode
        }, {
            isExist() {
                return !!ctxSlots[slotName]
            },
        })
        return prev
    }, {} as ScopedSlotsData<T>)

    return {
        scopedSlots,
    }
}
