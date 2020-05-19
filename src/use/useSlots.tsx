import {getCurrentInstance} from "@vue/composition-api";
import {VNode} from "vue/types/umd";

type SlotFuncType = (vn?: VNode | null | string | number | (VNode | null | string | number)[]) => VNode | null | string | number | (VNode | null | string | number)[]
export const SlotFunc: SlotFuncType = () => 1

function formatSlotResult(vnode: any) {
    if (Array.isArray(vnode)) {
        return vnode.filter(node => node != null)
    } else {
        return vnode
    }
}

export function useSlots<T extends { [key: string]: SlotFuncType }>(options?: T): { slots: { default: SlotFuncType } & T, $slots: { default: VNode | null } & { [key in keyof T]: VNode | null } } {

    const ctx = getCurrentInstance()!

    // 这样写就是响应式的了
    const $slots = {};
    [...Object.keys(options || {}), 'default'].forEach(key => {
        Object.defineProperty($slots, key, {
            get(): any {
                return ctx.$slots[key]
            }
        })
    })

    return {
        // @ts-ignore
        slots: {
            ...[...Object.keys(options || {}), 'default'].reduce((ret, key) => {
                ret[key] = (vNode) => {
                    return formatSlotResult(!!ctx.$slots[key] ? ctx.$slots[key] : vNode)
                }
                return ret
            }, {})
        },
        // @ts-ignore
        $slots,
    }

}