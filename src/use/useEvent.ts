import {getCurrentInstance, onBeforeUnmount} from 'vue'
import {createPlainEvent, PlainEvent} from "../plugins/Event";
import {SimpleFunction} from "../shims";
import {kebabCase} from 'plain-utils/string/kebabCase'

type EventListener<EmitsValue> = EmitsValue extends (...args: any[]) => any ? Parameters<EmitsValue> : never

export type ComponentEvent<Emit> = {
    emit: { [key in keyof Emit]: (...args: EventListener<Emit[key]>) => void },
    on: { [key in keyof Emit]: (cb: (...args: EventListener<Emit[key]>) => void) => void },
    once: { [key in keyof Emit]: (cb: (...args: EventListener<Emit[key]>) => void) => void },
    off: { [key in keyof Emit]: (cb: (...args: EventListener<Emit[key]>) => void) => void },
}

export function getComponentEmit<T>(emitObject: T): T {
    return Object.keys(emitObject || {}).reduce((prev, key) => {
        const emitter = (emitObject as any)[key];
        const match = key.match(/onUpdate([A-Z])(.*)/)
        const kebabCaseName = kebabCase(key).replace('on-', '')
        if (!!match) {
            const updateName = `update:${match[1].toLowerCase()}${match[2]}`
            prev[updateName] = emitter
            if (key === 'onUpdateModelValue') {
                prev['change'] = emitter
            }
        }
        prev[kebabCaseName] = emitter
        return prev
    }, {} as any)
}

export function useEvent<T>(emitObject: T): ComponentEvent<T> {

    const ctx = getCurrentInstance()!
    const event = createPlainEvent()

    const emit = {} as any;
    const on = {} as any;
    const once = {} as any;
    const off = {} as any;

    const keys = Object.keys(emitObject || {})
    if (!!emitObject && !!(emitObject as any).onUpdateModelValue) {keys.push('onChange')}

    keys.forEach(key => {
        /*派发事件名称，横杠命名*/
        const match = key.match(/onUpdate([A-Z])(.*)/)
        const kebabCaseName = kebabCase(key).replace('on-', '')
        if (!!match) {
            const updateName = `update:${match[1].toLowerCase()}${match[2]}`
            emit[key] = (...args: any[]) => {
                ctx.emit(kebabCaseName, ...args)
                event.emit(kebabCaseName, ...args)
                ctx.emit(updateName, ...args)
                event.emit(updateName, ...args)
                if (key === 'onUpdateModelValue') {
                    ctx.emit('change', ...args)
                    event.emit('change', ...args)
                }
            }
        } else {
            emit[key] = (...args: any[]) => {
                ctx.emit(kebabCaseName, ...args)
                event.emit(kebabCaseName, ...args)
            }
        }
        on[key] = (fn: SimpleFunction) => event.on(kebabCaseName, fn)
        once[key] = (fn: SimpleFunction) => event.once(kebabCaseName, fn)
        off[key] = (fn: SimpleFunction) => event.off(kebabCaseName, fn)
    })

    onBeforeUnmount(event.clear)

    return {
        emit, on, once, off,
    }
}