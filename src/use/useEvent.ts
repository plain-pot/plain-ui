import {getCurrentInstance, onBeforeUnmount} from 'vue'
import {createPlainEvent} from "../plugins/Event";
import {SimpleFunction} from "../shims";
import {kebabCase} from 'plain-utils/string/kebabCase'

// focus                -> focus
// itemClick            -> item-click
// updateModelValue     -> update:modelValue
// updateStart          -> update:start
function emitName2ListenName(emitName: string): string {
    const match = emitName.match(/update([A-Z])(.*)/)
    if (match) {
        return `update:${match[1].toLowerCase()}${match[2]}`
    }
    return kebabCase(emitName)!
}

type EventListener<EmitsValue> = EmitsValue extends (...args: any[]) => any ? Parameters<EmitsValue> : never

export type ComponentEvent<Emit> = {
    emit: { [key in keyof Emit]: (...args: EventListener<Emit[key]>) => void },
    on: { [key in keyof Emit]: (cb: (...args: EventListener<Emit[key]>) => void) => void },
    once: { [key in keyof Emit]: (cb: (...args: EventListener<Emit[key]>) => void) => void },
    off: { [key in keyof Emit]: (cb: (...args: EventListener<Emit[key]>) => void) => void },
}

export function getComponentEmit<T>(emitObject: T): T {
    return {
        change: null,
        ...Object.keys(emitObject || {}).reduce((ret: any, key: string) => {
            ret[emitName2ListenName(key)] = (emitObject as any)[key]
            return ret
        }, {} as any),
    }
}

export function useEvent<T>(emitObject: T): ComponentEvent<T> {

    const ctx = getCurrentInstance()!
    const event = createPlainEvent()

    const emit = {} as any;
    const on = {} as any;
    const once = {} as any;
    const off = {} as any;


    Object.keys(emitObject || {}).forEach(key => {
        /*派发事件名称，横杠命名*/
        const kebabCaseName = emitName2ListenName(key)

        emit[key] = (...args: any[]) => {
            ctx.emit(kebabCaseName, ...args)
            event.emit(kebabCaseName, ...args)
            if (key === 'updateModelValue') {
                ctx.emit('change', ...args)
                event.emit('change', ...args)
            }
        }
        on[key] = (fn: SimpleFunction) => event.on(kebabCaseName, fn)
        once[key] = (fn: SimpleFunction) => event.once(kebabCaseName, fn)
        off[key] = (fn: SimpleFunction) => event.off(kebabCaseName, fn)
    })

    onBeforeUnmount(event.clear)

    return {
        emit, on, once, off
    } as any
}