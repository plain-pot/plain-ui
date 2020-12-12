import './form.scss'
import {computed, reactive, ComputedRef, PropType, onMounted} from 'vue'
import {designComponent} from "../../use/designComponent";
import {StyleProps, useStyle} from "../../use/useStyle";
import {EditProps, useEdit} from "../../use/useEdit";
import {FormContentAlign, FormLabelAlign, FormValidateMode} from "./form.utils";
import {useNumber} from "../../use/useNumber";
import {useSlots} from "../../use/useSlots";
import {useStyles} from "../../use/useStyles";
import {unit} from "plain-utils/string/unit";
import {useCollect} from "../../use/useCollect";
import FormItem from './form-item'
import {formatFormRules} from "./form.validate";

const Form = designComponent({
    name: 'pl-form',
    props: {
        ...EditProps,
        ...StyleProps,
        disabledFields: {type: Object},                                     // 禁用的字段
        readonlyFields: {type: Object},                                     // 只读的字段

        modelValue: {type: Object},                                         // model绑定表单对象
        rules: {type: Object},                                              // 表单验证规则
        validateResult: {type: Object},                                     // 校验结果信息
        validateMode: {type: String, default: FormValidateMode.form},       // 校验模式
        associateFields: {type: Object},                                    // 校验关联字段，一个对象，key为字段名，value为字段字符串或者字符串数组。当key变化时，会自动校验value中所列的字段

        hideRequiredAsterisk: {type: Boolean, default: null},               // 是否隐藏文本旁边的红色必填星号
        hideValidateMessage: {type: Boolean, default: null},                // 是否隐藏校验失败的信息
        validateOnRulesChange: {type: Boolean, default: null},              // 是否当rules属性改变之后立即触发一次验证

        column: {type: [String, Number], default: 1},                       // 多列表单的列数
        labelWidth: {type: [String, Number]},                               // formItem 文本宽度
        contentWidth: {type: [String, Number]},                             // formItem 内容宽度

        labelAlign: {type: String as PropType<FormLabelAlign>},             // 文本对其方式
        contentAlign: {type: String as PropType<FormContentAlign>, default: FormLabelAlign.left},// content 对齐方式
        width: {type: [String, Number], default: '100%'},                   // 表单宽度
        centerWhenSingleColumn: {type: Boolean},                            // 单列的时候会使得表单内容居中，表单文本标题不计宽度，设置该属性为true则使得文本宽度参与计算居中
        colon: {type: Boolean, default: true},                              // label的冒号
        columnGutter: {type: [Number, String], default: 16},                // 列之间的间距
    },
    emits: {
        /*校验结果变化绑定事件*/
        updateValidateResult: () => true,
        /*字段值变化事件*/
        fieldValueChange: (field: string, newVal: any, oldVal: any) => true,
    },
    setup({props, event: {emit}}) {

        const {slots} = useSlots()

        /*---------------------------------------state-------------------------------------------*/

        /*收集的子组件*/
        const items = FormCollector.parent()

        const {styleComputed} = useStyle()
        const {editComputed} = useEdit({adjust: data => {data.loading = false}})
        const {numberState} = useNumber(props, ['labelWidth', 'contentWidth', 'column', 'width', 'columnGutter'])

        /*---------------------------------------compute-------------------------------------------*/

        /*form-item中最大的label节点宽度*/
        const maxLabelWidth = computed(() => items.reduce((prev: number, next) => Math.max(next.state.labelWidth, prev), 0)) as ComputedRef<number>

        /*form-item所需要的对齐方式信息*/
        const align = computed(() => {
            return {
                label: props.labelAlign || (numberState.column === 1 ? FormLabelAlign.right : FormLabelAlign.left),
                content: props.contentAlign,
            }
        })

        /*form-item所需要的宽度信息*/
        const width = computed(() => {
            /*
            *  如果没有设置contentWidth
            *  如果是单列，默认contentWidth是400
            *  多了则是220
            */
            const content = !!numberState.contentWidth ? numberState.contentWidth : numberState.column === 1 ? 400 : 220
            const label = numberState.labelWidth || maxLabelWidth.value

            if (!!label) {
                return {
                    col: label + content,
                    label,
                    content,
                }
            } else {
                return {
                    content,
                }
            }
        })

        const classes = computed(() => [
            'pl-form',
            `pl-form-column-${numberState.column}`,
            `pl-form-size-${styleComputed.value.size}`
        ])

        /*设置form宽度*/
        const styles = useStyles((style) => {
            style.width = unit(props.width)
        })

        /*body节点宽度。如果是单列，则左偏移 label/2 个像素，确保content在屏幕中间*/
        const bodyStyles = useStyles(style => {
            const {label, col} = width.value
            if (!label) {return}
            const {column} = numberState
            style.width = `calc(${col! * column}px ${column > 1 ? `+ ${numberState.columnGutter * column}px` : ''})`
            style.left = `${(!props.centerWhenSingleColumn && column === 1) ? -label! / 2 : 0}px`
        })

        const childState = reactive({
            align,
            width,
        })

        /*---------------------------------------validate-------------------------------------------*/

        const formatRules = computed(() => {
            formatFormRules(props.rules, items)
        })

        onMounted(() => {
            console.log(formatRules.value)
        })

        return {
            refer: {
                props,
                childState,
                numberState,
            },
            render: () => {
                return (<div class={classes.value} style={styles.value}>
                    <div class="pl-form-body" style={bodyStyles.value}>
                        {slots.default()}
                    </div>
                </div>)
            }
        }
    },
})

export default Form

export const FormCollector = useCollect(() => ({
    parent: Form,
    child: FormItem,
}))