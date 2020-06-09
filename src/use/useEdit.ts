import {computed, inject, provide, reactive, getCurrentInstance, ref} from "@vue/composition-api";
import {useWrapper} from "@/use/useWrapper";

/**
 * 生成editComputed，用于继承父组件的edit属性
 * @author  韦胜健
 * @date    2020/5/13 14:55
 */
export const EditProvider = '@@PLAIN_EDIT_PROVIDER'

export const EditProps = {
    disabled: {type: Boolean, default: null},
    readonly: {type: Boolean, default: null},
    loading: {type: Boolean, default: null},
}

export const useEdit = useWrapper('edit', () => {

    const ctx = getCurrentInstance()!
    const parent = inject(EditProvider, null) as any

    const editState = reactive({loading: null} as { loading: boolean | null })

    const editComputed = computed(() => {
        let {disabled, readonly, loading} = ctx.$props
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
})

export const useEditOuterLoading = useWrapper('loading', () => {
    const loading = ref(false)
    const {editComputed} = useEdit()

    // @ts-ignore
    return computed({
        get: () => loading.value || editComputed.value.loading,
        set: (val) => {
            loading.value = val
        },
    }) as { value: boolean }
})