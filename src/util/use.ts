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

/**
 * 格式化props中的部分属性，产生一个state，支持异步格式化
 * @author  韦胜健
 * @date    2020/5/13 14:53
 */
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

/**
 * 生成emit方法
 * @author  韦胜健
 * @date    2020/5/13 14:54
 */
export function useEmit<T = { [k: string]: any }>(context: any, option: T): { [key in keyof T]: ((...args: any[]) => void) } {
    // @ts-ignore
    return Object.keys(option).reduce((ret, key) => {
        ret[key] = (...args: any[]) => {
            context.emit(key, ...args)
        }
        return ret
    }, {})
}

/**
 * 生成styleComputed对象，用于继承父组件的style属性；
 * @author  韦胜健
 * @date    2020/5/13 14:54
 */
const StyleProvider = '@@PLAIN_STYLE_PROVIDER'

export const StyleProps = {
    shape: {type: String},                      // fillet,round,square
    size: {type: String},                       // normal,large,mini
    status: {type: String},                     // primary,success,error,warn,info
}

export function useStyle(props: any, defaultValue?: { shape?: string, size?: string, status?: string }) {

    const parent = inject(StyleProvider, null)
    defaultValue = Object.assign({shape: 'fillet', size: 'normal', status: 'primary',}, defaultValue || {})

    const style = computed(() => {
        // 这句代码不可以放在外边，会导致变成非响应式属性
        const {shape, size, status} = props
        // @ts-ignore
        const parentStyler = !!parent ? parent.value : <any>{}

        return {
            shape: shape || parentStyler.shape || defaultValue!.shape,
            size: size || parentStyler.size || defaultValue!.size,
            status: status || parentStyler.status || defaultValue!.status,
        }
    })

    provide(StyleProvider, style)

    return style
}

/**
 * 生成editComputed，用于继承父组件的edit属性
 * @author  韦胜健
 * @date    2020/5/13 14:55
 */
const EditProvider = '@@PLAIN_EDIT_PROVIDER'

export const EditProps = {
    disabled: {type: Boolean, default: null},
    readonly: {type: Boolean, default: null},
    loading: {type: Boolean, default: null},
}

export function useEdit(props) {

    const parent = inject(EditProvider, null) as any

    const editState = reactive({loading: null} as { loading: boolean | null })

    const editComputed = computed(() => {
        let {disabled, readonly, loading} = props
        const p = {disabled, readonly, loading}

        if (p.disabled == null) {
            p.disabled = !!parent ? parent.value.disabled : false
        }
        if (p.readonly == null) {
            p.readonly = !!parent ? parent.value.readonly : false
        }
        if (editState.loading == null) {
            p.loading = p.loading != null ? p.loading : (!!parent ? parent.value.loading : false)
        } else {
            p.loading = editState.loading
        }
        return {
            disabled: p.disabled,
            loading: p.loading,
            readonly: p.readonly,
            editable: !p.disabled && !p.readonly && !p.loading
        }
    })

    provide(EditProvider, editComputed)

    return {
        editState,
        editComputed,
    }
}


