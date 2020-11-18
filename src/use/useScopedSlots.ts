import {VNodeChild} from "../shims";
import {getCurrentInstance, onBeforeUpdate, reactive} from 'vue';
import {getSlotExist} from "../utils/getSlotExists";

type ScopedSlotsOptionType = { [SlotName: string]: { [ScopeKey: string]: any } }

type ExtractScopedSlotsDataValue<ScopeValue> = ScopeValue extends new (...args: any[]) => infer R ? R : ScopeValue;

type ExtractScopedSlotsData<Scope extends { [ScopeKey: string]: any }> = {
    [k in keyof Scope]: ExtractScopedSlotsDataValue<Scope[k]>
}

interface UseScopedSlots {
    <T extends ScopedSlotsOptionType>(options: T): {
        scopedSlots: {
            [k in keyof T]: ((scope: ExtractScopedSlotsData<T[k]>, vnode: VNodeChild) => void)
        }
    }

    <T extends ScopedSlotsOptionType>(options: T, makeReactive?: boolean): {
        scopedSlots: {
            [k in keyof T]: ((scope: ExtractScopedSlotsData<T[k]>, vnode: VNodeChild) => void) & { isExist: () => boolean }
        }
    }
}

export const useScopedSlots: UseScopedSlots = <T extends ScopedSlotsOptionType>(options: T, makeReactive?: boolean) => {

    const ctx = getCurrentInstance()!
    const slotNames = Object.keys(options)

    const state = reactive({exist: getSlotExist(null, slotNames, ctx)})
    /*如果需要响应式，则需要设置 makeReactive，会自动在updated之后更新slots的isExist值*/
    if (makeReactive) {
        onBeforeUpdate(() => {
            getSlotExist(state.exist, slotNames, ctx)
        })
    }

    const scopedSlots = slotNames.reduce((prev: any, slotName: string) => {
        prev[slotName] = Object.assign((scope: any, vnode: VNodeChild) => {
            const slot = ctx.slots[slotName]
            return !!slot ? slot(scope) : vnode
        }, {
            isExist() {
                return state.exist[slotName]
            },
        })
        return prev
    }, {} as any)

    return {
        scopedSlots,
    }
}
