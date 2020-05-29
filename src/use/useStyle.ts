import {computed, inject, provide, getCurrentInstance} from "@vue/composition-api";
import {useWrapper} from "@/use/useWrapper";

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

export const useStyle = useWrapper('style', (defaultValue?: { shape?: string, size?: string, status?: string }) => {
    const ctx = getCurrentInstance()!

    const parent = inject(StyleProvider, null)
    defaultValue = Object.assign({shape: 'fillet', size: 'normal', status: 'primary',}, defaultValue || {})

    const style = computed(() => {
        // 这句代码不可以放在外边，会导致变成非响应式属性
        const {shape, size, status} = ctx.$props
        // @ts-ignore
        const parentStyler = !!parent ? parent.value : <any>{}

        return {
            shape: shape || parentStyler.shape || defaultValue!.shape,
            size: size || parentStyler.size || defaultValue!.size,
            status: status || parentStyler.status || defaultValue!.status,
        }
    })

    provide(StyleProvider, style)

    return {
        styleComputed: style
    }
})