import {getCurrentInstance} from 'vue';

export function useRefs<T extends { [k: string]: any }>(config: T): {
    refs: {
        [k in keyof T]: T[k] extends { use: { ref: (refName: string) => { value: infer Refer } } } ? Refer :
            T[k] extends new (...args: any[]) => infer Refer ? Refer : T
    }
} {
    const ctx = getCurrentInstance() as any
    return {
        refs: Object.keys(config).reduce((prev, refName) => {
            Object.defineProperty(prev, refName, {
                get(): any {
                    return ctx.refs[refName]
                }
            })
            return prev
        }, {} as any)
    }
}
