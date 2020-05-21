import {getCurrentInstance} from "@vue/composition-api";
import {PlainUtils} from "@/util/util";

/**
 * 生成emit方法
 * @author  韦胜健
 * @date    2020/5/13 14:54
 */

// emitInput        -> input
// emitItemClick    -> item-click
// emitUpdateSTart  -> update:start
export function emitName2ListenName(emitName) {
    return PlainUtils.kebabCase(emitName).replace('update-', 'update:')
}

export const EmitFunc: ((data?) => void) = (() => null)

export function useEvent<T extends { [key: string]: Function }>(option: T): {
    emit: T,
    on: { [key in keyof T]: (cb: T[key]) => void },
    once: { [key in keyof T]: (cb: T[key]) => void },
    off: { [key in keyof T]: (cb: T[key]) => void },
} {

    const keys = Object.keys(option)
    const ctx = getCurrentInstance()!

    let emit = {} as any
    let on = {} as any
    let once = {} as any
    let off = {} as any

    keys.forEach(key => {
        /*派发事件名称，横岗命名*/
        const kebabCaseName = emitName2ListenName(key)
        emit[key] = (...args) => {
            ctx.$emit(kebabCaseName, ...args)
            ctx.$emit('emit', {event: kebabCaseName, args})
            if (key === 'input') {
                ctx.$emit('change', ...args)
                ctx.$emit('emit', {event: 'change', args})
            }
        }
        on[key] = (cb) => ctx.$on(kebabCaseName, cb)
        once[key] = (cb) => ctx.$once(kebabCaseName, cb)
        off[key] = (cb) => ctx.$off(kebabCaseName, cb)
    })

    return {emit, on, once, off}
}