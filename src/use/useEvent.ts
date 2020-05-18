import {ref, Ref, set, SetupContext} from "@vue/composition-api";
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

export function useListener<T extends { [key: string]: Function }>(context: SetupContext, option: T): {
    emit: T,
    on: { [key in keyof T]?: (cb: T[key]) => void },
    once: { [key in keyof T]?: (cb: T[key]) => (() => void) },
    off: { [key in keyof T]?: (cb: T[key]) => (() => void) },
    onListeners: Ref<{ [key in keyof T]: Function[] }>,
    onceListeners: Ref<{ [key in keyof T]: Function[] }>,
} {

    const keys = Object.keys(option)

    // @ts-ignore
    const onListeners: Ref<{ [key in keyof T]: Function[] }> = ref({})
    // @ts-ignore
    const onceListeners: Ref<{ [key in keyof T]: Function[] }> = ref({})

    const emit = {} as any
    const on = {} as any
    const once = {} as any
    const off = {} as any

    keys.forEach(key => {

        set(onListeners.value, key, [])
        set(onceListeners.value, key, [])

        /*派发事件名称，横岗命名*/
        const kebabCaseName = emitName2ListenName(key)

        /*执行监听函数*/
        function callListener(key, args) {
            if (!!onListeners.value[key] && onListeners.value[key].length > 0) {
                onListeners.value[key].forEach(listener => listener(...args))
            }
            if (!!onceListeners.value[key] && onceListeners.value[key].length > 0) {
                onceListeners.value[key].forEach(listener => listener(...args))
                onceListeners.value[key].splice(0, onceListeners.value[key].length)
            }
        }

        /*派发事件*/
        emit[key] = (...args) => {
            context.emit(kebabCaseName, ...args)
            callListener(key, args)

            if (key === 'input') {
                context.emit('change', ...args)
                callListener('change', args)
            }
        }

        /*监听事件*/
        on[key] = (cb) => {
            onListeners.value[key].push(cb)
            return () => off[key](cb)
        }

        /*监听一次事件*/
        once[key] = (cb) => {
            onceListeners.value[key].push(cb)
            return () => off[key](cb)
        }

        /*解除监听事件*/
        off[key] = (cb) => {
            let onIndex = onListeners.value[key].indexOf(cb)
            if (onIndex > -1) {
                onListeners.value[key].splice(onIndex, 1)
            }
            let onceIndex = onceListeners.value[key].indexOf(cb)
            if (onceIndex > -1) {
                onceListeners.value[key].splice(onceIndex, 1)
            }
        }

    })

    return {emit, on, once, off, onListeners, onceListeners}
}