import {computed, defineComponent} from "@vue/composition-api";
import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";
import {getReturnType} from "@/util/util";
import {EditProps} from "@/use/useEdit";
import {StyleProps} from "@/use/useStyle";
import {SlotFunc, useSlots} from "@/use/useSlots";
import {FormatPropsType, useProps} from "@/use/useProps";
import {useCollectChild} from "@/use/useCollect";
import {FORM_PROVIDER} from "@/packages/form/form-utils";
import {ElRef, useRefs} from "@/use/useRefs";

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

    const refs = useRefs({
        label: ElRef,
    })

    const {slots} = useSlots({
        label: SlotFunc,
        suffix: SlotFunc,
    })

    const propsState = useProps(props, {
        label: FormatPropsType.promise,
        labelWidth: FormatPropsType.number,
        column: FormatPropsType.number,
    })

    const ctx = useCollectChild({provideString: FORM_PROVIDER})

    const refer = {
        refs,
        slots,
        propsState,
    }

    return refer
}

const FormItemSetupValue = getReturnType(formItemSetup)
export type FormItemContextType = typeof FormItemSetupValue

export default defineComponent({
    name: 'pl-form-item',
    props: {
        ...Props,
    },
    setup(props) {

        const {propsState, slots} = formItemSetup(props)

        const classes = computed(() => ([
            'pl-form-item',

        ]))

        return () => (
            <div class={classes.value}>
                <div class="pl-form-item-label" ref="label">
                    <span>{slots.label(propsState.label)}</span>
                </div>
                <div class="pl-from-item-body">
                    <div class="pl-form-item-content">
                        {slots.default()}
                    </div>
                    <div class="pl-form-item-suffix">
                        {slots.suffix()}
                    </div>
                </div>
            </div>
        )
    },
})