import {computed, defineComponent, inject} from "@vue/composition-api";
import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";
import {getReturnType} from "@/util/util";
import {EditProps} from "@/use/useEdit";
import {StyleProps} from "@/use/useStyle";
import {SlotFunc, useSlots} from "@/use/useSlots";
import {FormatPropsType, useProps} from "@/use/useProps";
import {useCollectChild} from "@/use/useCollect";
import {FORM_COLLECTOR, FORM_PROVIDER} from "@/packages/form/form-utils";
import {ElRef, useRefs} from "@/use/useRefs";
import {FormContextType} from "@/packages/form/form";
import {useRefer} from "@/use/useRefer";

const Props = {
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

function formItemSetup(props: ExtractPropTypes<typeof Props>) {

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

    const refer = {
        refs,
        propsState,
        form,
        labelStyles,
        bodyStyles,
        hasLabel,
    }

    useRefer(refer)

    return {
        ...refer,
        slots,
        $slots,
    }
}

const FormItemSetupValue = getReturnType(formItemSetup)
export type FormItemContextType = typeof FormItemSetupValue

export default defineComponent({
    name: 'pl-form-item',
    props: {
        ...Props,
    },
    setup(props) {

        const {
            refs,
            propsState,
            slots,
            $slots,
            form,
            labelStyles,
            bodyStyles,
            hasLabel,
        } = formItemSetup(props)

        const classes = computed(() => ([
            'pl-form-item',
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