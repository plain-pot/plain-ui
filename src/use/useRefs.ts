import {getCurrentInstance} from "@vue/composition-api";

export const ElRef = {} as HTMLElement
export const CompRef = {} as any

/**
 * 组件引用组合函数
 * @author  韦胜健
 * @date    2020/5/14 10:23
 */
export function useRefs<T>(option: T): T {
    const context = getCurrentInstance()!
    let ret = {} as any
    Object.keys(option).forEach(key => {
        Object.defineProperty(ret, key, {
            get(): any {
                return context.$refs[key]
            },
            set(v: any) {
                throw new Error(`can't chang refs!`)
            }
        })
    })

    return ret
}








