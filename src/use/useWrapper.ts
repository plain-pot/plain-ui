import {getCurrentInstance} from "@vue/composition-api";

export function useWrapper<T extends Function>(key: string, compositionFunction: T): T {
    // @ts-ignore
    return (...args) => {
        const ctx = getCurrentInstance() as any
        ctx.plain_use = ctx.plain_use || {}
        if (!ctx.plain_use[key]) {
            ctx.plain_use[key] = compositionFunction(...args, ctx, key)
        }
        return ctx.plain_use[key]
    }
}