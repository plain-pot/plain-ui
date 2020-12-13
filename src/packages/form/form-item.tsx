import {designComponent} from "../../use/designComponent";
import {EditProps} from "../../use/useEdit";
import {StyleProps, useStyle} from "../../use/useStyle";
import {useSlots} from "../../use/useSlots";
import {useRefs} from "../../use/useRefs";
import {useNumber} from "../../use/useNumber";
import {FormCollector} from "./form";
import {useStyles} from "../../use/useStyles";
import {unit} from "plain-utils/string/unit";
import {reactive, onMounted, computed, PropType, ComputedRef} from 'vue';
import {useClass} from "../../use/useClasses";
import {FormContentAlign, FormLabelAlign} from "./form.utils";
import {FormComponentItemRules, FormRule, FormValidateUtils} from "./form.validate";

export default designComponent({
    name: 'pl-form-item',
    props: {
        ...EditProps,
        ...StyleProps,

        field: {type: [String, Array] as PropType<string | string[]>},      // 绑定的属性字段名
        rules: {type: [Array, Object] as PropType<FormRule | FormRule[]>},  // 校验规则
        required: {type: Boolean},                                          // 不能为空

        label: {type: String, default: ' '},                                // 显示文本
        labelWidth: {type: [String, Number]},                               // 显示文本宽度
        column: {type: [String, Number], default: 1},                       // 多列表单的列数
        block: {type: Boolean},                                             // 占用一行
        colon: {type: Boolean, default: null},                              // label的冒号
        labelAlign: {type: String as PropType<FormLabelAlign>},             // label 对齐方式
        contentAlign: {type: String as PropType<FormContentAlign>},         // content 对齐方式
    },
    emits: {},
    provideRefer: true,
    setup({props, event: {emit}}) {

        const form = FormCollector.child()
        const {slots} = useSlots(['label', 'suffix'], true)
        const {refs} = useRefs({label: HTMLDivElement,})
        const {styleComputed} = useStyle()

        /*---------------------------------------state-------------------------------------------*/

        const {numberState} = useNumber(props, ['labelWidth', 'column'])
        const state = reactive({
            /*当前 form item的label宽度*/
            labelWidth: 0,
        })

        /*---------------------------------------computed-------------------------------------------*/

        /*是否显示冒号*/
        const colon = computed(() => props.colon == null ? form.props.colon : props.colon)
        /*label的目标宽度*/
        const labelWidth = computed(() => numberState.labelWidth || form.numberState.labelWidth)
        /*是否设置了label宽度*/
        const staticWidth = computed(() => !!labelWidth.value)
        /*是否存在label节点*/
        const hasLabel = computed(() => !!props.label || slots.label.isExist())

        const classes = useClass(() => [
            'pl-form-item',
            `pl-form-item-size-${styleComputed.value.size}`,
            `pl-form-item-label-align-${props.labelAlign || form.childState.align.label}`,
            `pl-form-item-content-align-${props.contentAlign || form.childState.align.content}`,
            {
                'pl-form-item-static-width': staticWidth.value,
                'pl-form-item-required': isRequired.value,
                'pl-form-item-invalidate': !!invalidate.value,
            }
        ])

        /*form-item的宽度，与下一个form-item的gutter*/
        const styles = useStyles(style => {
            const {col} = form.childState.width
            if (!!col) {
                style.width = unit(col * numberState.column)
            }
            if (form.numberState.column > 1) {
                style.marginRight = unit(form.numberState.columnGutter * numberState.column)
            }
        })

        /*label节点宽度，如果有设置labelWidth的话*/
        const labelStyles = useStyles(style => {
            if (!!labelWidth.value) {
                style.width = unit(labelWidth.value)
            }
        })

        /*如果没有label的话，body应该占用百分百宽度，否则宽度为占用列数x列宽 - label宽度*/
        const bodyStyles = useStyles(style => {
            if (!hasLabel.value) {
                style.width = '100%'
            } else {
                const {label, col} = form.childState.width
                if (!!label) {
                    style.width = unit(col! * numberState.column - label)
                }
            }
        })

        /*---------------------------------------hook-------------------------------------------*/

        /**
         * 如果没有写死labelWidth，这mounted的时候计算label节点宽度
         * @author  韦胜健
         * @date    2020/12/11 21:32
         */
        if (!staticWidth.value && hasLabel.value) {
            onMounted(() => {
                state.labelWidth = refs.label.scrollWidth
            })
        }

        /*---------------------------------------validate-------------------------------------------*/

        const formItemComponentRules = computed((): FormComponentItemRules => ({
            label: props.label,
            field: props.field,
            required: props.required,
            rules: props.rules,
        }))

        /*当前是否必填校验*/
        const isRequired = computed(() => {
            const {fieldToRequired} = form.childState.formValidate
            const fields = FormValidateUtils.getListValue(props.field)
            if (!fields) {
                return false
            }
            return !!fields.find(f => !!fieldToRequired[f])
        }) as ComputedRef<boolean>

        /*当前是否校验不通过*/
        const invalidate = computed(() => {
            const {validateResultMap} = form.childState
            const fields = FormValidateUtils.getListValue(props.field)
            if (!fields) {
                return null
            }
            const invalidField = fields.find(f => !!validateResultMap[f])
            return !invalidField ? null : validateResultMap[invalidField]!
        })

        return {
            refer: {
                state,
                formItemComponentRules,
            },
            render: () => (
                <div class={classes.value} style={styles.value}>
                    {(!!props.label || slots.label.isExist()) && (
                        <div class="pl-form-item-label" style={labelStyles.value} ref="label">
                            {slots.label(props.label)} {!!props.label && !!props.label.trim() && !!colon.value && ':'}
                        </div>
                    )}
                    <div class="pl-form-item-body" style={bodyStyles.value}>
                        {slots.default()}

                        {!!invalidate.value && (<div class="pl-form-item-message">
                            {invalidate.value.message}
                        </div>)}
                    </div>
                </div>
            )
        }
    },
})