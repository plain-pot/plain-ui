import {computed, defineComponent, inject, provide, Ref} from "@vue/composition-api";

import {EditProps, EditProvider} from "@/use/useEdit";
import {StyleProps, StyleProvider} from "@/use/useStyle";
import {SlotFunc, useSlots} from "@/use/useSlots";
import {FormatPropsType, useProps} from "@/use/useProps";
import {useCollectChild} from "@/use/useCollect";
import {FORM_COLLECTOR, FORM_PROVIDER} from "@/packages/form/form-utils";
import {ElRef, useRefs} from "@/use/useRefs";
import {FormContextType} from "@/packages/form/form";
import {useRefer} from "@/use/useRefer";
import {ValidateResult} from "@/packages/form/validate";

function useFormItemEdit(props: ExtractPropTypes<typeof FormItemProps>, form: FormContextType | null, handler: { onBlur: Function, onChange: Function }) {
    const parent = inject(EditProvider, null) as any
    const editComputed = computed(() => {
        const {disabled, readonly, loading} = props
        const p = {disabled, readonly, loading}

        if (p.disabled == null) {
            if (!!props.field && !!form && !!form.props.disabledFields && !!form.props.disabledFields[props.field as string]) {
                p.disabled = true
            } else {
                p.disabled = !!parent ? parent.value.disabled : false
            }
        }

        if (p.readonly == null) {
            if (!!props.field && !!form && !!form.props.readonlyFields && !!form.props.readonlyFields[props.field as string]) {
                p.readonly = true
            } else {
                p.readonly = !!parent ? parent.value.readonly : false
            }
        }

        if (p.loading == null) {
            p.loading = !!parent ? parent.value.loading : false
        }

        return {
            ...p,
            editable: !p.disabled && !p.readonly && !p.loading,
            onBlur: handler.onBlur,
            onChange: handler.onChange
        }
    })

    provide(EditProvider, editComputed)
    return {editComputed}
}

function useFormItemStyle(props: ExtractPropTypes<typeof FormItemProps>, form: FormContextType | null, validateMessage: Ref<string | null>) {
    const parent = inject(StyleProvider, null)

    const style = computed(() => {
        const {shape, size, status} = props
        const parentStyler = !!parent ? (parent as any).value : {}
        return {
            shape: shape || parentStyler.shape || 'fillet',
            size: size || parentStyler.size || 'normal',
            status: status != null ? status : (validateMessage.value != null ? 'error' : (parentStyler.status || null))
        }
    })

    provide(StyleProvider, style)

    return {
        styleComputed: style
    }
}

export const FormItemProps = {
    ...EditProps,
    ...StyleProps,

    field: {type: [String, Array]},                                     // 绑定的属性字段名
    rules: {type: [Array, Object]},                                     // 校验规则
    required: {type: Boolean},                                          // 不能为空
    hideRequiredAsterisk: {type: Boolean, default: null},               // 是否隐藏文本旁边的红色必填星号
    hideValidateMessage: {type: Boolean, default: null},                // 是否隐藏校验失败的信息
    validateOnRulesChange: {type: Boolean, default: null},              // 是否当rules属性改变之后立即触发一次验证

    label: {type: String, default: ' '},                                // 显示文本
    labelWidth: {type: [String, Number]},                               // 显示文本宽度
    column: {type: [String, Number]},                                   // 多列表单的列数
    block: {type: Boolean},                                             // 占用一行
}

function formItemSetup(props: ExtractPropTypes<typeof FormItemProps>) {

    useCollectChild({provideString: FORM_COLLECTOR})

    const {slots, $slots} = useSlots({
        label: SlotFunc,
        suffix: SlotFunc,
    })

    const refs = useRefs({
        label: ElRef,
    })

    const propsState = useProps(props, {
        label: FormatPropsType.promise,
        labelWidth: FormatPropsType.number,
        column: FormatPropsType.number,
    })

    const form = inject(FORM_PROVIDER) as FormContextType

    /*---------------------------------------computer-------------------------------------------*/

    const labelStyles = computed(() => {
        if (form.targetLabelWidth.value != null) {
            return {width: `${form.targetLabelWidth.value}px`}
        } else if (!!propsState.labelWidth) {
            return {width: `${propsState.labelWidth}px`}
        }
        return null
    })

    const bodyStyles = computed(() => {
        let width;
        if (props.block) {
            if (!form.targetItemWidth.value) {
                width = null
            } else {
                width = form.propsState.column * (form.targetItemWidth.value) - form.targetLabelWidth.value!
            }
        } else {
            const column = propsState.column || 1

            if (!form.targetItemWidth.value) {
                width = null
            } else {
                width = column * (form.targetItemWidth.value) - form.targetLabelWidth.value!
            }
        }

        if (!width) {
            return null
        } else {
            return {
                width: `${width}px`
            }
        }
    })

    const hasLabel = computed(() => {
        if (!!propsState.label || !!$slots.label) return true
        if (!$slots.default && !$slots.suffix) return true
        return false
    })

    /*---------------------------------------validate-------------------------------------------*/

    const isRequired = computed(() => {
        if (!form || !props.field) return false
        return form.allFieldRequired.value[props.field as string]
    })
    const validateMessage = computed(() => {
        if (!form) return null
        let fields = Array.isArray(props.field) ? props.field : [props.field]
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            let validateResult = form.validateResultModel.value[field as string] as ValidateResult
            if (!!validateResult) return validateResult.message
        }
        return null
    })
    const {editComputed} = useFormItemEdit(props, form, {
        onBlur: () => !!props.field && !!form && form.handler.onEditBlur(props.field as string),
        onChange: () => !!props.field && !!form && form.handler.onEditChange(props.field as string),
    })
    const {styleComputed} = useFormItemStyle(props, form, validateMessage)

    const refer = {
        refs,
        propsState,
        form,
        labelStyles,
        bodyStyles,
        hasLabel,
        isRequired,
        validateMessage,
        editComputed,
        styleComputed,
    }

    useRefer(refer)

    return {
        ...refer,
        slots,
        $slots,
    }
}

export type FormItemContextType = ReturnType<typeof formItemSetup>

export default defineComponent({
    name: 'pl-form-item',
    props: {
        ...FormItemProps,
    },
    setup(props) {

        const {
            propsState,
            slots,
            $slots,
            labelStyles,
            bodyStyles,
            hasLabel,
            isRequired,
            validateMessage,
        } = formItemSetup(props)

        const classes = computed(() => ([
            'pl-form-item',
            {
                'pl-form-item-required': isRequired.value,
                'pl-form-item-invalidate': !!validateMessage.value,
            }
        ]))

        return () => (
            <div class={classes.value}>
                {!!hasLabel.value && (
                    <div class="pl-form-item-label" ref="label" style={labelStyles.value}>
                        <span>{slots.label(propsState.label)}</span>
                    </div>
                )}
                <div class="pl-form-item-body" style={bodyStyles.value}>
                    <div class="pl-form-item-content">
                        {slots.default()}
                        <div class="pl-form-item-message">
                            <span>{validateMessage.value}</span>
                        </div>
                    </div>
                    {!!$slots.suffix && (
                        <div class="pl-form-item-suffix">
                            {slots.suffix()}
                        </div>
                    )}
                </div>
            </div>
        )
    },
})