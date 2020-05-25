import {getCurrentInstance} from "@vue/composition-api";

export const ElRef = {} as HTMLElement
export const CompRef = {} as any

/**
 * 组件引用组合函数
 * @author  韦胜健
 * @date    2020/5/14 10:23
 */
export function useRefs<T>(option?: T): T & { $el: HTMLElement } {
    const context = getCurrentInstance()!
    let ret = {} as any
    Object.keys(Object.assign({
        $el: ElRef,
    }, option || {})).forEach(key => {
        Object.defineProperty(ret, key, {
            get(): any {
                if (key === '$el') {
                    return context.$el
                }
                return context.$refs[key]
            },
            set(v: any) {
                throw new Error(`can't chang refs!`)
            }
        })
    })

    return ret
}








