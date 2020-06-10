import {getCurrentInstance} from "@vue/composition-api";

export function useRefer(refer: any) {
    const ctx = getCurrentInstance() as any
    Object.keys(refer).forEach(key => {
        if (ctx[key] !== undefined) {
            console.log({key, ctx, refer})
            throw new Error(`useRefer error: key [${key}] is exist on context!`)
        } else {
            ctx[key] = refer[key]
        }
    })
    return ctx
}