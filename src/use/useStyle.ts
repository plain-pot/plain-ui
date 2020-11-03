import {useFunctionWrapper} from "./useFunctionWrapper";
import {inject, computed, provide} from 'vue';

export enum StyleMode {
    fill = 'fill',
    stroke = 'stroke',
    text = 'text',
}

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

interface UseStyleProvideData {
    shape: StyleShape,
    size: StyleSize,
    status?: StyleStatus,
}

interface UseStyleOption {
    shape?: StyleShape,
    size?: StyleSize,
    status?: StyleStatus,
    adjust?: (data: UseStyleProvideData) => void | UseStyleProvideData
}

const USE_STYLE_PROVIDER = '@@USE_STYLE_PROVIDER'

export const useStyle = useFunctionWrapper('style', (ctx, option: UseStyleOption = {}): { styleComputed: { value: UseStyleProvideData } } => {

    const parent = inject(USE_STYLE_PROVIDER, null) as null | { value: UseStyleProvideData }
    const defaultData = Object.assign({shape: StyleShape.fillet, size: StyleSize.normal}, option)

    const styleComputed = computed(() => {
        const {shape, size, status} = ctx.props
        const parentData = !!parent ? parent.value : {} as any
        let data: UseStyleProvideData = {
            shape: shape || parentData.shape || defaultData.shape,
            size: size || parentData.size || defaultData.size,
            status: status || parentData.status || defaultData.status,
        }
        if (!!defaultData.adjust) {
            data = defaultData.adjust(data) || data
        }
        return data
    })

    provide(USE_STYLE_PROVIDER, styleComputed)

    return {styleComputed}
})