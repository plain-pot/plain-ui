import {computed, inject, provide, getCurrentInstance} from "@vue/composition-api";
import {useWrapper} from "@/use/useWrapper";

/**
 * 生成styleComputed对象，用于继承父组件的style属性；
 * @author  韦胜健
 * @date    2020/5/13 14:54
 */
export const StyleProvider = '@@PLAIN_STYLE_PROVIDER'

export enum StyleShape {
    fillet = 'fillet',
    round = 'round',
    square = 'square',
}

export enum StyleSize {
    normal = 'normal',
    large = 'large',
    mini = 'mini',
}

export enum StyleStatus {
    primary = 'primary',
    success = 'success',
    error = 'error',
    warn = 'warn',
    info = 'info',
}

export const StyleProps = {
    shape: {type: String},                      // fillet,round,square
    size: {type: String},                       // normal,large,mini
    status: {type: String},                     // primary,success,error,warn,info
}

export const useStyle = useWrapper('style', (defaultValue?: {
    shape?: string | null,
    size?: string | null,
    status?: string | null,
    adjust?: (result: { shape?: string | null, size?: string | null, status?: string | null }) => { shape?: string | null, size?: string | null, status?: string | null }
}) => {
    const ctx = getCurrentInstance()!

    const parent = inject(StyleProvider, null)
    defaultValue = Object.assign({shape: 'fillet', size: 'normal'}, defaultValue || {})

    const style = computed(() => {
        // 这句代码不可以放在外边，会导致变成非响应式属性
        const {shape, size, status} = ctx.$props
        // @ts-ignore
        const parentStyler = !!parent ? parent.value : <any>{}

        let result = {
            shape: shape || parentStyler.shape || defaultValue!.shape,
            size: size || parentStyler.size || defaultValue!.size,
            status: status || parentStyler.status || defaultValue!.status,
        }

        if (!!defaultValue && !!defaultValue.adjust) {
            // @ts-ignore
            result = defaultValue.adjust(result) || result
        }

        return result
    })

    provide(StyleProvider, style)

    return {
        styleComputed: style
    }
})