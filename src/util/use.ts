import {computed, inject, provide, reactive, watch} from "@vue/composition-api";
import {toArray} from "@/util/util";

export enum FormatPropsType {
    promise = 'promise',
    function = 'function',
    number = 'number',
}

function formatValue(state: any, key: string, val: any, types: FormatPropsType | FormatPropsType[]) {

    if (val == null) {
        return state[key] = val
    }

    types = toArray(types)
    if (types.indexOf(FormatPropsType.promise) > -1 && !!val.then && typeof val.then === 'function') {
        return val.then(val => state[key] = val)
    }
    if (types.indexOf(FormatPropsType.function) > -1 && typeof val === 'function') {
        return state[key] = val()
    }
    if (types.indexOf(FormatPropsType.number) > -1) {
        val = String(val)
        if (!/^[\d]+$/.test(val) && val.lastIndexOf('px') === val.length - 2) {
            val = Number(val.replace('px', ''))
        }
        return state[key] = Number(val)
    }

    return state[key] = val
}

export function useProps<T = any>(props: T, option: { [key in keyof T]?: FormatPropsType | FormatPropsType[] }, watcher?: any): any {
    const keys = Object.keys(option)

    let state = {} as any
    keys.forEach(key => state[key] = null)
    state = reactive(state)

    keys.forEach(key => {
        watch(
            () => props[key],
            (val) => {
                formatValue(state, key, val, option[key])
            },
        )
    })

    return state
}

export function useEmit<T = { [k: string]: any }>(context: any, option: T): { [key in keyof T]: ((...args: any[]) => void) } {
    // @ts-ignore
    return Object.keys(option).reduce((ret, key) => {
        ret[key] = (...args: any[]) => {
            context.emit(key, ...args)
        }
        return ret
    }, {})
}

const StyleProvider = '@@PLAIN_STYLE_PROVIDER'

export function useStyle(props: any, defaultValue?: { shape: string, size: string, status: string }) {

    const {shape, size, status} = props
    const parent = inject(StyleProvider, null)
    defaultValue = Object.assign({
        shape: 'fillet',
        size: 'normal',
        status: 'primary',
    }, defaultValue || {})

    const style = computed(() => {
        // @ts-ignore
        const parentStyler = !!parent ? parent.value : <any>{}

        return {
            shape: shape || parentStyler.shape || defaultValue!.shape,
            size: size || parentStyler.size || defaultValue!.size,
            status: shape || parentStyler.status || defaultValue!.status,
        }
    })

    provide(StyleProvider, style)

    return style
}


