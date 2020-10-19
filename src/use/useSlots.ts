import {VNodeChild, getCurrentInstance} from 'vue'

const Slots = () => ({} as any)

type SlotFunctionType = (vnode?: VNodeChild | undefined | null) => any

type Slots<T> = {
    slots: { default: SlotFunctionType } & { [k in keyof T]: SlotFunctionType }
} & {
    $slots: { default?: VNodeChild } & { [k in keyof T]?: VNodeChild }
}

function formatSlotResult(vnode: any) {
    if (Array.isArray(vnode)) {
        return vnode.filter(node => node != null)
    } else {
        return vnode
    }
}

function createSlots<T extends {
    [k: string]: (...args: any[]) => any
}>(options: T): Slots<T> {

    const ctx = getCurrentInstance()!

    let $slots: Slots<T>["$slots"] = {}
    let slots: Slots<T>["slots"] = {} as any

    [...Object.keys(options), 'default'].forEach(key => {
        Object.defineProperty($slots, key, {
            get() {
                return !!ctx.slots[key] ? ctx.slots[key]!() : null
            },
        });
        (slots as any)[key] = (vnode: VNodeChild) => {
            const slot = $slots[key]
            return formatSlotResult(!!slot ? slot : vnode)
        }
    })

    return {
        slots,
        $slots,
    }
}

export const useSlots = Object.assign(createSlots, {
    Slots,
})