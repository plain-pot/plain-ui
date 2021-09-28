import './form.scss'
import {computed, designComponent,InheritHtmlElement, PropType, reactive, useClasses, useNumber, useStyles, watch} from "plain-design-composition";
import {EditProps, useEdit} from "../../use/useEdit";
import {StyleProps, useStyle} from "../../use/useStyle";
import {FormAssociateFields, FormValidateError, FormValidateTrigger, getFormRuleData, iFormItemPropRules, tFormPropRules} from "./form.validate";
import {FormContentAlign, FormLabelAlign, FormValidateMode} from "./form.utils";
import {unit} from "plain-utils/string/unit";
import $$notice from "../$$notice";
import {debounce} from "plain-utils/utils/debounce";
import {useCollect} from "../../use/useCollect";
import {PlFormItem} from "../PlFormItem";
import {PlLoadingMask} from "../PlLoadingMask";
import {removeUnit} from "plain-utils/string/removeUnit";

export const PlForm = designComponent({
    name: 'pl-form',
    props: {
        ...EditProps,
        ...StyleProps,
        disabledFields: {type: Object as PropType<Record<string, boolean>>},// 禁用的字段
        readonlyFields: {type: Object as PropType<Record<string, boolean>>},// 只读的字段

        modelValue: {type: Object},                                         // model绑定表单对象
        rules: {type: Object as PropType<tFormPropRules>},                  // 表单验证规则
        validateMode: {type: String as PropType<keyof typeof FormValidateMode>, default: FormValidateMode.form},// 校验模式
        associateFields: {type: Object as PropType<FormAssociateFields>},   // 校验关联字段，一个对象，key为字段名，value为字段字符串或者字符串数组。当key变化时，会自动校验value中所列的字段
        requiredMessage: {type: String, default: '必填'},                    // 必填校验提示信息

        hideRequiredAsterisk: {type: Boolean, default: null},               // 是否隐藏文本旁边的红色必填星号
        hideValidateMessage: {type: Boolean, default: null},                // 是否隐藏校验失败的信息
        validateOnRulesChange: {type: Boolean, default: null},              // 是否当rules属性改变之后立即触发一次验证

        column: {type: [String, Number], default: 1},                       // 多列表单的列数
        columnGutter: {type: [Number, String], default: 16},                // 列之间的间距
        centerWhenSingleColumn: {type: Boolean},                            // 单列的时候会使得表单内容居中，表单文本标题不计宽度，设置该属性为true则使得文本宽度参与计算居中
        contentWidthWhenSingleColumn: {type: Number, default: 400},         // 单列的时候，内容的宽度
        labelWidth: {type: [String, Number]},                               // formItem 文本宽度
        labelAlign: {type: String as PropType<keyof typeof FormLabelAlign | FormLabelAlign>},// 文本对其方式
        contentAlign: {type: String as PropType<keyof typeof FormContentAlign | FormContentAlign>},// content 对齐方式
        width: {type: [String, Number], default: '100%'},                   // 表单宽度
        colon: {type: Boolean, default: true},                              // label的冒号
        verticalLabel: {type: Boolean},                                     // 纵向的表单
    },
    emits: {
        /*字段值变化事件*/
        onFieldValueChange: (field: string, newVal: any, oldVal: any) => true,
    },
    inheritPropsType: InheritHtmlElement,
    slots: ['default'],
    setup({props, slots, event: {emit}}) {

        /*---------------------------------------state-------------------------------------------*/

        /*收集的子组件*/
        const items = FormCollector.parent(true) as { value: { props: iFormItemPropRules }[] }

        useStyle();
        useEdit({adjust: data => {data.loading = false}});
        const {numberState} = useNumber(props, ['labelWidth', 'contentWidth', 'column', 'width', 'columnGutter'])

        /*---------------------------------------compute-------------------------------------------*/

        const classes = useClasses(() => [
            'pl-form',
            `pl-form-column-${numberState.column}`,
            {
                'pl-form-vertical-label': props.verticalLabel,
                'pl-form-center-when-single-column': props.centerWhenSingleColumn,
            }
        ])

        /*设置form宽度*/
        const styles = useStyles((style) => {
            if (props.column !== 1) {
                style.width = `calc(${unit(props.width)} + ${unit(props.columnGutter)})`
                style.marginLeft = `-${Number(removeUnit(props.columnGutter)) / 2}px`
            }
        })

        /*---------------------------------------validate-------------------------------------------*/

        const formRuleData = computed(() => {
            return getFormRuleData({
                formProps: props,
                formItems: items,
                requiredMessage: props.requiredMessage,
            })
        })

        const loading = (() => {
            let time: null | number;
            return {
                show: () => {
                    time = setTimeout(() => {
                        childState.loading = true
                        time = null
                    }, 500) as any as number
                },
                hide: () => {
                    if (!!time) {
                        clearTimeout(time)
                    } else {
                        childState.loading = false
                    }
                },
            }
        })();

        const validateMethods = {
            validate: async (config?: { autoLoading?: boolean, autoAlert?: boolean, }) => {
                config = config || {}
                if (config.autoLoading != false) {
                    loading.show()
                }
                childState.allErrors = await formRuleData.value.methods.validate(props.modelValue)
                loading.hide()
                if (childState.allErrors.length > 0) {
                    const {message, label} = childState.allErrors[0]

                    const errMsg = !label ? message : `"${label}" 校验不通过，${message}`
                    if (config.autoAlert !== false) {
                        $$notice.warn(errMsg)
                    }
                    throw {
                        validate: childState.allErrors[0],
                        message: errMsg,
                    }
                } else {
                    return null
                }
            },
            clearValidate: () => {
                childState.allErrors = []
            },
            showError: (error: any) => {
                if (!!error.message) {
                    $$notice.warn(error.message)
                } else {
                    $$notice.warn(String(error))
                }
            },
        }

        /*---------------------------------------end-------------------------------------------*/

        /*onMounted(() => {
            console.log('formValidate.value', formRuleData.value)
        })*/

        const childState = reactive({
            loading: false,
            allErrors: [] as FormValidateError[],
        })

        const freezeState = {
            oldFormData: {...(props.modelValue || {})},
        }

        const validateHandler = {
            validateChange: async (trigger: FormValidateTrigger, field: string | string[] | undefined) => {
                if (!field) {return}
                const {fitRuleList, fitRuleMap} = formRuleData.value.methods.getRules({
                    field,
                    trigger,
                    associateFields: props.associateFields,
                })
                if (fitRuleList.length === 0) {return}
                childState.allErrors = await formRuleData.value.methods.validateField({
                    formData: props.modelValue,
                    allErrors: childState.allErrors,
                    rules: fitRuleMap,
                })
            },
            onEditChange: async (field?: string | string[]) => {
                if (props.validateMode === FormValidateMode.form) {return}
                await validateHandler.validateChange(FormValidateTrigger.change, field)
            },
            onBlurChange: async (field?: string | string[]) => {
                await validateHandler.validateChange(FormValidateTrigger.blur, field)
            },
            onFieldChange: async (field: string | string[]) => {
                await validateHandler.validateChange(FormValidateTrigger.change, field)
            },
            onFormDataChange: debounce((val: any) => {
                const newFormData = val || {}
                const oldFormData = freezeState.oldFormData || {}
                const fields = Object.keys({...newFormData, ...oldFormData})
                const changeFields: string[] = []

                fields.forEach(field => {
                    let newVal = newFormData[field]
                    let oldVal = oldFormData[field]
                    if (newVal !== oldVal) {
                        changeFields.push(field)
                        emit.onFieldValueChange(field, newVal, oldVal)
                    }
                })
                freezeState.oldFormData = {...val || {}}
                if (changeFields.length > 0) {
                    validateHandler.onFieldChange(changeFields)
                }
            }, 150, false)
        }

        if (props.validateMode === FormValidateMode.form) {
            watch(() => props.modelValue, validateHandler.onFormDataChange, {deep: true})
        }

        return {
            refer: {
                props,
                childState,
                numberState,
                validateHandler,
                ...validateMethods,
                formRuleData,
            },
            render: () => {
                return (
                    <div class={classes.value} style={styles.value}>
                        {slots.default()}
                        <PlLoadingMask modelValue={childState.loading || !!props.loading}/>
                    </div>
                )
            }
        }
    },
})

export default PlForm

export const FormCollector = useCollect(() => ({
    parent: PlForm,
    child: PlFormItem,
}))
