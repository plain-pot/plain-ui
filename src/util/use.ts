import {computed, inject, onBeforeUnmount, onMounted, provide, reactive, Ref, ref, set, SetupContext, watch} from "@vue/composition-api";
import {toArray} from "@/util/util";
import PlainUtils from '../../submodules/plain-utils'

export function useMounted() {
    const state = reactive({
        val: false,
    })
    const flag = computed(() => state.val)
    onMounted(() => state.val = true)
    onBeforeUnmount(() => state.val = false)
    return flag
}

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

/**
 * 双向绑定值组合函数
 * @author  韦胜健
 * @date    2020/5/14 10:23
 */
export function useModel<T>(getter: () => T, emitter: (...args: any[]) => void, autoEmit = true): { value: T } {

    const state = ref(getter())

    watch(
        getter,
        (val: any) => {
            state.value = val
        }
    )

    const computedState = computed({
        get: () => state.value as (T | null),
        set: (val: any) => {
            state.value = val
            if (autoEmit) {
                emitter(state.value)
            }
        },
    })
    // @ts-ignore
    return computedState
}

/**
 * 组件引用组合函数
 * @author  韦胜健
 * @date    2020/5/14 10:23
 */
export function useRef<T = HTMLElement>(name?: string, context?: SetupContext): Readonly<{ value: T }> {

    if (!!name) {
        return {
            // @ts-ignore
            get value() {
                return context!.refs[name!]
            },
        }
    } else {
        // @ts-ignore
        return ref(null)
    }
}

export function useRefer(context: SetupContext, ref: any): void {

    // @ts-ignore
    const refer: ((ref: any) => void) | { value: any } | undefined = context.attrs.refer

    if (!refer) {
        return
    }

    if (typeof refer === "function") {
        refer(ref)
    } else if (typeof refer === "object") {
        refer.value = ref
    }
}