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

export function useListener<T extends { [key: string]: Function }>(option: T): {
    emit: T,
    on: { [key in keyof T]?: (cb: T[key]) => void },
    once: { [key in keyof T]?: (cb: T[key]) => (() => void) },
    off: { [key in keyof T]?: (cb: T[key]) => (() => void) },
} {

    const keys = Object.keys(option)
    const {$emit, $on, $once, $off,} = getCurrentInstance()!

    let emit = {} as any
    let on = {} as any
    let once = {} as any
    let off = {} as any

    keys.forEach(key => {
        /*派发事件名称，横岗命名*/
        const kebabCaseName = emitName2ListenName(key)
        emit[key] = (...args) => {
            if (key === 'input') $emit('change', ...args)
            console.log(kebabCaseName, args)
            return $emit(kebabCaseName, ...args)
        }
        on[key] = (cb) => $on(kebabCaseName, cb)
        once[key] = (cb) => $once(kebabCaseName, cb)
        off[key] = (cb) => $off(kebabCaseName, cb)
    })

    return {emit, on, once, off}
}