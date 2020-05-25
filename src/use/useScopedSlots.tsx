import {getCurrentInstance} from "@vue/composition-api";

export class ScopedSlotFunc<T> {

}

type ScopedSlotFuncType = object
type JSXElement = JSX.Element

export function useScopedSlots<T extends { [key: string]: ScopedSlotFuncType }>(option?: T): {
    scopedSlots: { [key in keyof T]: (data: { param: object, content: JSXElement | (JSXElement | null)[] | null }) => JSXElement | (JSXElement | null)[] | null }
        &
        { default: (data: { param: object, content: JSXElement | (JSXElement | null)[] | null }) => JSXElement | (JSXElement | null)[] | null },
    $scopedSlots: { [key in keyof T]?: (...args: any[]) => JSXElement | (JSXElement | null)[][] | null }
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