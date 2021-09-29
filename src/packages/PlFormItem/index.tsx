import {computed, ComputedRef,InheritHtmlElement, designComponent, PropType, useClasses, useStyles} from "plain-ui-composition";
import {EditProps, useEdit} from "../../use/useEdit";
import {StyleProps, StyleStatus, useStyle} from "../../use/useStyle";
import {FormContentAlign, FormLabelAlign} from "../PlForm/form.utils";
import {FormValidateUtils, tFormRuleItem} from "../PlForm/form.validate";
import {FormCollector} from "../PlForm";
import {unit} from "plain-utils/string/unit";
import {removeUnit} from "plain-utils/string/removeUnit";
import PlIcon from "../PlIcon";
import PlTooltip from "../PlTooltip";

export const PlFormItem = designComponent({
    name: 'pl-form-item',
    props: {
        ...EditProps,
        ...StyleProps,

        field: {type: [String, Array] as PropType<string | string[]>},      // 绑定的属性字段名
        rules: {type: [Array, Object] as PropType<tFormRuleItem | tFormRuleItem[]>},  // 校验规则
        required: {type: Boolean},                                          // 不能为空

        label: {type: String, default: ' '},                                // 显示文本
        labelWidth: {type: [String, Number]},                               // 显示文本宽度
        column: {type: [String, Number], default: 1},                       // 多列表单的列数
        block: {type: Boolean},                                             // 占用一行
        colon: {type: Boolean, default: null},                              // label的冒号
        labelAlign: {type: String as PropType<FormLabelAlign | keyof typeof FormLabelAlign>},// label 对齐方式
        contentAlign: {type: String as PropType<FormContentAlign | keyof typeof FormContentAlign>},// content 对齐方式
    },
    emits: {
        onBlur: () => true,
        onChange: () => true,
    },
    provideRefer: true,
    slots: ['labelContent', 'suffix', 'default'],
    inheritPropsType: InheritHtmlElement,
    setup({props, slots, event: {emit}}) {

        const form = FormCollector.child()
        const {styleComputed} = useStyle({
            adjust: ret => {
                !!invalidate.value && (ret.status = StyleStatus.error)
            }
        })

        const handler = {
            onEditChange: () => form.validateHandler.onEditChange(props.field),
            onEditBlur: () => form.validateHandler.onBlurChange(props.field),
        }
        useEdit({
            adjust: ret => {
                ret.onChange = handler.onEditChange
                ret.onBlur = handler.onEditBlur

                if (!!form.props.disabledFields && !!props.field) {
                    const fields = FormValidateUtils.getFieldArray(props.field)
                    if (!!fields && !!fields.find(f => form.props.disabledFields![f])) {
                        ret.disabled = true
                    }
                }
                if (!!form.props.readonlyFields && !!props.field) {
                    const fields = FormValidateUtils.getFieldArray(props.field)
                    if (!!fields && !!fields.find(f => form.props.disabledFields![f])) {
                        ret.readonly = true
                    }
                }
            }
        })

        /*---------------------------------------state-------------------------------------------*/

        const targetProps = computed(() => {
            /*如果是单列，则不限制label宽度，如果是多列，则采用 form-item的宽度 || form设置的label宽度 || 120px*/
            const labelWidth: string | number | undefined = form.props.column === 1 ? undefined : (props.labelWidth || form.props.labelWidth || 120)

            /*如果设置了block，则占满整行*/
            const column = props.block ? form.props.column : props.column

            /*冒号*/
            const colon = props.colon != null ? props.colon : form.props.colon

            /*文本对齐方式*/
            const labelAlign = props.labelAlign || form.props.labelAlign || FormLabelAlign.right

            /*内容对齐方式*/
            const contentAlign = props.contentAlign || form.props.contentAlign || FormContentAlign["flex-start"]

            return {
                labelWidth,
                column,
                colon,
                labelAlign,
                contentAlign,
            }
        })

        /*---------------------------------------computed-------------------------------------------*/

        const classes = useClasses(() => [
            'pl-form-item',
            `pl-form-item-size-${styleComputed.value.size}`,
            `pl-form-item-label-align-${targetProps.value.labelAlign}`,
            `pl-form-item-content-align-${targetProps.value.contentAlign}`,
            {
                'pl-form-item-block': props.block,
                'pl-form-item-required': isRequired.value && !form.props.hideRequiredAsterisk,
                'pl-form-item-invalidate': !!invalidate.value && !form.props.hideValidateMessage,
            }
        ])

        const styles = useStyles((styles) => {
            if (form.props.column !== 1) {
                styles.width = `${Number(targetProps.value.column) / Number(form.props.column) * 100}%`
                styles.padding = `0 ${Number(removeUnit(form.props.columnGutter)) / 2}px`
            }
        })

        /*label节点宽度，如果有设置labelWidth的话*/
        const labelStyles = useStyles(style => {
            if (!!targetProps.value.labelWidth && !form.props.verticalLabel) {
                style.width = unit(targetProps.value.labelWidth)
                style.paddingLeft = unit(form.props.columnGutter)
            }
        })

        const bodyStyles = useStyles(styles => {
            if (form.props.column === 1) {
                styles.width = unit(form.props.contentWidthWhenSingleColumn)
                styles.flex = 'initial'
            }
        })

        /*---------------------------------------validate-------------------------------------------*/

        /*当前是否必填校验*/
        const isRequired = computed(() => {
            let fields = FormValidateUtils.getFieldArray(props.field)
            if (!!props.rules) {
                FormValidateUtils.getRuleArray(props.rules).forEach(r => {
                    !!r.field && fields.push(...FormValidateUtils.getFieldArray(r.field))
                })
            }
            return form.formRuleData.value.utils.isRequired(fields)
        }) as ComputedRef<boolean>

        /*当前是否校验不通过*/
        const invalidate = computed(() => {
            const {allErrors} = form.childState
            const fields = FormValidateUtils.getFieldArray(props.field)
            if (!fields) {
                return null
            }
            const fitErrors = allErrors.find(err => fields.indexOf(err.field) > -1)
            return !fitErrors ? null : {
                message: fitErrors.message,
                field: fitErrors.field,
            }
        })

        return {
            refer: {
                props,
            },
            render: () => (
                <div class={classes.value} style={styles.value}>
                    {(!!props.label || slots.labelContent.isExist()) && (
                        <div class="pl-form-item-label" style={labelStyles.value}>
                            {(() => {
                                const content = <>
                                    {isRequired.value && <span class="pl-form-item-required-dot">*</span>}
                                    {slots.labelContent(props.label)}
                                    {!!props.label && !!props.label.trim() && !!targetProps.value && '：'}
                                </>
                                return !props.label || form.props.column == 1 ? content : (
                                    <PlTooltip message={props.label} showWidth="100%">
                                    <span>
                                        {content}
                                    </span>
                                    </PlTooltip>
                                )
                            })()}
                        </div>
                    )}
                    <div class="pl-form-item-body" style={bodyStyles.value}>
                        {slots.default()}
                        {slots.suffix.isExist() && (
                            <div class="pl-form-item-suffix">
                                {slots.suffix()}
                            </div>
                        )}
                        {!!invalidate.value && !form.props.hideValidateMessage && (
                            <div class="pl-form-item-message">
                                <PlIcon icon="el-icon-warning" status="error"/>
                                <span>{invalidate.value.message}</span>
                            </div>
                        )}
                    </div>
                </div>
            )
        }
    },
})

export default PlFormItem
