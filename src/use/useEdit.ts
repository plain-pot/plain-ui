import {useFunctionWrapper} from "./useFunctionWrapper";
import {inject, reactive, computed, provide, onBeforeUnmount} from 'vue';

export const EDIT_PROVIDER = '@@EDIT_PROVIDER'

export const EditProps = {
    disabled: {type: Boolean, default: null},
    readonly: {type: Boolean, default: null},
    loading: {type: Boolean, default: null},
    placeholder: {type: String, default: null},
    customReadonly: {type: Boolean, default: null},
}

interface EditProvideData {
    disabled: boolean | null,
    readonly: boolean | null,
    loading: boolean | null,
    placeholder: string | null,

    onBlur?: (...args: any[]) => void,
    onChange?: (...args: any[]) => void,
}

export const useEdit = useFunctionWrapper('edit', (ctx: any, option: {
    adjust?: (data: EditProvideData) => void | EditProvideData
} = {}) => {

    const parentEditComputed = inject(EDIT_PROVIDER, null) as null | { value: EditProvideData }

    const editState = reactive({loading: null as null | boolean})

    const editComputed = computed(() => {
        const {
            disabled,
            readonly,
            loading,
            placeholder
        } = ctx.props as EditProvideData

        let data = {disabled, readonly, loading, placeholder}

        if (data.disabled == null) data.disabled = !!parentEditComputed ? parentEditComputed.value.disabled : false
        if (data.readonly == null) data.readonly = !!parentEditComputed ? parentEditComputed.value.readonly : false
        if (data.placeholder == null) data.placeholder = !!parentEditComputed ? parentEditComputed.value.placeholder : null
        if (editState.loading == null) {
            data.loading = data.loading != null ? data.loading : (!!parentEditComputed ? parentEditComputed.value.loading : false)
        } else {
            data.loading = editState.loading
        }

        if (!!option.adjust) data = option.adjust(data) || data

        return {
            ...data,
            editable: !data.disabled && !data.readonly && !data.loading
        }
    });

    provide(EDIT_PROVIDER, editComputed)

    if (!!parentEditComputed) {
        if (!!parentEditComputed.value.onBlur && !!ctx._event && !!ctx._event.on.blur) {
            ctx._event.on.blur(parentEditComputed.value.onBlur)
            onBeforeUnmount(ctx._event.off.blur(parentEditComputed.value.onBlur))
        }
        if (!!parentEditComputed.value.onChange && !!ctx._event && !!ctx._event.on.change) {
            ctx._event.on.change(parentEditComputed.value.onBlur)
            onBeforeUnmount(ctx._event.off.change(parentEditComputed.value.onBlur))
        }
    }

    return {
        editState,
        editComputed,
    }
})