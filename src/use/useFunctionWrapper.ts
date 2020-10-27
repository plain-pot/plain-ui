import {getCurrentInstance, ComponentInternalInstance} from 'vue'

export function useFunctionWrapper<R, P,
    T extends (ctx: ComponentInternalInstance, ...args: P[]) => R>(
    key: string,
    func: T,
) {
    return (...args: P[]): R => {
        const ctx = getCurrentInstance() as any
        if (!ctx._use) ctx._use = {}

        let r: R;
        if (!ctx._use[key]) {
            r = ctx._use[key] = func(ctx, ...args)
            return r
        } else {
            throw new Error(`use ${key} can only be executed once!`)
        }
    }
}