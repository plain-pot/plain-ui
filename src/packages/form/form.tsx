import {defineComponent} from "@vue/composition-api";
import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";
import {getReturnType} from "@/util/util";
import {EditProps} from "@/use/useEdit";
import {StyleProps} from "@/use/useStyle";
import {useSlots} from "@/use/useSlots";


const Props = {
    ...EditProps,
    ...StyleProps,

    value: {type: Object},                                              // model绑定表单对象
    rules: {type: Object},                                              // 表单验证规则
    validateResult: {type: Object},                                     // 校验结果信息

    hideRequiredAsterisk: {type: Boolean, default: null},               // 是否隐藏文本旁边的红色必填星号
    hideValidateMessage: {type: Boolean, default: null},                // 是否隐藏校验失败的信息
    validateOnRulesChange: {type: Boolean, default: null},              // 是否当rules属性改变之后立即触发一次验证

    column: {type: [String, Number], default: 1},                       // 多列表单的列数
    labelWidth: {type: [String, Number]},                               // formItem 文本宽度
    contentWidth: {type: [String, Number]},                             // formItem 内容宽度
    disabledFields: {type: Object},                                     // 禁用的字段
    readonlyFields: {type: Object},                                     // 只读的字段
    labelAlign: {type: Boolean},                                        // 文本对其方式
    width: {type: [String, Number], default: '100%'},                   // 表单宽度
    centerWhenSingleColumn: {type: Boolean},                            // 单列的时候会使得表单内容居中，表单文本标题不计宽度，设置该属性为true则使得文本宽度参与计算居中
    loadingMask: {type: [Boolean, Object]},                             // 是否展示loading遮罩
}

function formSetup(props: ExtractPropTypes<typeof Props>) {

    const refer = {}

    return refer
}

const FormSetupValue = getReturnType(formSetup)
export type FormContextType = typeof FormSetupValue

export default defineComponent({
    name: 'pl-form',
    props: {
        ...Props,
    },
    setup(props) {

        const {slots} = useSlots()

        return () => (
            <div>
                pl-form
                <div class="pl-form-body">
                    {slots.default()}
                </div>
            </div>
        )
    },
})