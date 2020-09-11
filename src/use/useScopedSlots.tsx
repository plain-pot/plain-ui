import {getCurrentInstance} from "@vue/composition-api";
import {VNode} from "vue/types/umd";

export class ScopedSlotFunc<T> {

}

type ScopedSlotFuncType = object

type ScopedSlotsContentType = VNode | (VNode | null)[] | null | undefined | string | number

export function useScopedSlots<T extends { [key: string]: ScopedSlotFuncType }>(option?: T): {
    scopedSlots: { [key in keyof T]: (data: { param: T[key], content: ScopedSlotsContentType }) => ScopedSlotsContentType }
        &
        { default: (data: { param: object, content: ScopedSlotsContentType }) => ScopedSlotsContentType },
    $scopedSlots: { [key in keyof T]?: (...args: any[]) => ScopedSlotsContentType }
} {

    const ctx = getCurrentInstance()!
    const scopedSlots = {}
    const $scopedSlots = {}

    Object.keys(Object.assign({default: ScopedSlotFunc}, option || {})).forEach(key => {
        scopedSlots[key] = ({param, content}) => {
            const node = !!ctx.$scopedSlots[key] ? ctx.$scopedSlots[key]!(param) : content
            return Array.isArray(node) ? node.filter(Boolean) : node
        }

        Object.defineProperty($scopedSlots, key, {
            get() {
                return ctx.$scopedSlots[key]
            },
        })
    })

    // @ts-ignore
    return {scopedSlots, $scopedSlots}
}