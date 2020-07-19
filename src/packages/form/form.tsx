import {computed, defineComponent, provide, reactive, Ref, watch} from "@vue/composition-api";
import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";
import {EditProps, useEdit} from "@/use/useEdit";
import {StyleProps, useStyle} from "@/use/useStyle";
import {useSlots} from "@/use/useSlots";
import {useCollectParent} from "@/use/useCollect";
import {FORM_COLLECTOR, FORM_PROVIDER} from "@/packages/form/form-utils";
import {FormItemContextType, FormItemProps} from "@/packages/form/form-item";
import {FormatPropsType, useProps} from "@/use/useProps";
import {$plain} from "@/packages/base";
import {FormTrigger, getValidateConfigData, TargetRule, validateAsync, validateField, ValidateResultMap} from "@/packages/form/validate";
import {useModel} from "@/use/useModel";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {useRefer} from "@/use/useRefer";

const enum ValidateMode {
    form = 'form',
    table = 'table',
}

const Props = {
    ...EditProps,
    ...StyleProps,

    value: {type: Object},                                              // model绑定表单对象
    rules: {type: Object},                                              // 表单验证规则
    validateResult: {type: Object},                                     // 校验结果信息
    validateMode: {type: String, default: ValidateMode.form},           // 校验模式

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

    const {emit} = useEvent({
        updateValidateResult: EmitFunc,
        fieldValueChange: (field: string, newVal: any, oldVal: any) => undefined,
    })

    const items = useCollectParent({
        sort: false,
        provideString: FORM_COLLECTOR,
        onAdd: (item: FormItemContextType) => {
            if (propsState.labelWidth == null && !!item.refs.label) {
                const labelWidth = item.refs.label.offsetWidth
                if (!state.maxLabelWidth || state.maxLabelWidth < labelWidth) {
                    state.maxLabelWidth = labelWidth
                }
            }
        }
    }) as Ref<ExtractPropTypes<typeof FormItemProps>[]>

    const {styleComputed} = useStyle()

    /*---------------------------------------state-------------------------------------------*/

    const propsState = useProps(props, {
        labelWidth: FormatPropsType.number,
        contentWidth: FormatPropsType.number,
        column: FormatPropsType.number,
        width: FormatPropsType.number,
    })

    const state = reactive({
        maxLabelWidth: null as null | number,                                   // form item 最大文本宽度
        formData: $plain.utils.deepcopy(props.value || {}) as object,           // 绑定的表单数据对象
        loadingMask: false,                                                     // 内部loading标志
        loadingTimer: null as null | number,                                    // loading延时器
    })

    const validateResultModel = useModel(() => {
        return (props.validateResult || {}) as ValidateResultMap
    }, emit.updateValidateResult)

    /*---------------------------------------computer-------------------------------------------*/

    const targetLabelWidth = computed(() => {
        if (!!propsState.labelWidth) return propsState.labelWidth as number
        if (!!state.maxLabelWidth) return state.maxLabelWidth as number
        return null
    })

    const targetContentWidth = computed(() => {
        return propsState.contentWidth as number || 400
    })

    const targetItemWidth = computed(() => {
        if (!targetLabelWidth.value || !targetContentWidth.value) return null
        return targetContentWidth.value + targetLabelWidth.value
    })

    const bodyStyles = computed(() => {
        if (!targetItemWidth.value) return null
        return {
            width: `${propsState.column * (targetItemWidth.value)}px`,
            left: `${(!props.centerWhenSingleColumn && propsState.column === 1) ? -targetLabelWidth.value! / 2 : 0}px`
        }
    })

    /*---------------------------------------validate-------------------------------------------*/

    const {editComputed} = useEdit()

    const validateConfigData = computed(() => getValidateConfigData(
        items.value.map(({label, field, required, rules}) => ({label, field, required, rules})),
        props.rules,
    ))

    const allFieldLabels = computed(() => validateConfigData.value.allFieldLabels)
    const allRules = computed(() => validateConfigData.value.allRules) as { value: TargetRule[] }
    const allFieldRequired = computed(() => validateConfigData.value.allRequired)

    const validate = {
        valid: (field: string | string[], trigger: FormTrigger) => {
            field = Array.isArray(field) ? field : [field]
            field.forEach(item => validateField(validateResultModel.value, allRules.value, props.value || {}, item, trigger))
        },
        onChange: $plain.utils.throttle((field: string | string[]) => {
            validate.valid(field, FormTrigger.CHANGE)
        }, 300),
        onBlur: $plain.utils.throttle((field: string | string[]) => {
            validate.valid(field, FormTrigger.BLUR)
        }, 300)
    }

    const handler = {
        /**
         * 如果校验模式为 ValidateMode.table，则通过监听form-item中的edit组件的change事件来触发校验change校验规则，否则通过 深度watch formData对象并且通过
         * 对比来实现触发change校验。后者的优点是可以兼容任何双向绑定组件，缺点是要深度监听formData的值变化。前者的缺点是
         * 不兼容非edit组件（使用useEdit来控制编辑的组件），优点是不需要监听formData数据的变化，这个适用于表格中校验数据。
         * @author  韦胜健
         * @date    2020/7/18 17:25
         */
        onEditChange: (field: string | string[]) => {
            if (props.validateMode !== ValidateMode.table) return
            else validate.onChange(field)
        },
        onEditBlur: (field: string | string[]) => validate.onBlur(field)
    }

    if (props.validateMode === ValidateMode.form) {
        watch(() => props.value, (newFormData: any) => {
            let oldFormData = state.formData
            const fields = Array.from(new Set([...Object.keys(newFormData || {}), ...(Object.keys(oldFormData))]))
            fields.forEach(field => {
                let newVal = newFormData[field]
                let oldVal = oldFormData[field]
                if (!$plain.utils.deepEqual(newVal, oldVal)) {
                    emit.fieldValueChange(field, newVal, oldVal)
                    validate.onChange(field)
                }
            })
            state.formData = $plain.utils.deepcopy(newFormData || {})
        }, {deep: true, lazy: true})
    }

    /*---------------------------------------methods-------------------------------------------*/

    const methods = {
        setLoading(flag = true) {
            if (!!state.loadingTimer) {
                clearTimeout(state.loadingTimer)
            }
            state.loadingTimer = setTimeout(() => {
                state.loadingMask = flag
            }, 300)
        },
        async validate(callback: Function, loadingMask: boolean = true): Promise<null | { validateResult: ValidateResultMap | null, message: string }> {

            const dfd = {
                promise: null as any,
                resolve: null as any,
            }
            dfd.promise = new Promise((resolve) => {
                dfd.resolve = resolve
            })

            if (!!callback) {
                dfd.resolve = (...args) => callback(...args)
            }

            const result = await validateAsync({
                validateResult: validateResultModel.value,
                rules: allRules.value,
                formData: props.value || {},
                onStart: () => {
                    if (loadingMask) {
                        this.setLoading(true)
                    }
                },
                onEnd: () => {
                    if (loadingMask) {
                        this.setLoading(false)
                    }
                }
            })

            dfd.resolve(result)
            return dfd.promise
        },
        async validateWithoutMask(callback) {
            return methods.validate(callback, false)
        },
        showError(err: null | { validateResult: ValidateResultMap | null, message: string }) {
            if (!!err) {
                $plain.$message.error(err.message)
            }
        },
        /**
         * 清除校验信息
         * @author  韦胜健
         * @date    2020/3/18 17:53
         */
        clearValidate() {
            validateResultModel.value = {}
        },
    }

    const refer = {
        items,
        propsState,
        state,
        props,
        styleComputed,

        targetLabelWidth,
        targetContentWidth,
        targetItemWidth,
        bodyStyles,

        validateResultModel,
        allRules,
        allFieldRequired,
        allFieldLabels,
        editComputed,
        validate,
        methods,
        handler,
    }

    useRefer(refer)

    provide(FORM_PROVIDER, refer)

    return refer
}

export type FormContextType = ReturnType<typeof formSetup>

export default defineComponent({
    name: 'pl-form',
    props: {
        ...Props,
    },
    setup(props) {

        const {slots} = useSlots()

        const {
            propsState,
            state,
            styleComputed,
            bodyStyles,
        } = formSetup(props)

        const classes = computed(() => [
            'pl-form',
            `pl-form-label-align-${props.labelAlign}`,
            `pl-form-column-${propsState.column || 1}`,
            `pl-form-size-${styleComputed.value.size}`
        ])

        const styles = computed(() => ({
            width: $plain.utils.suffixPx(propsState.width)
        }))

        return () => (
            <div class={classes.value} style={styles.value} v-loading={state.loadingMask || props.loadingMask}>
                <div class="pl-form-body" style={bodyStyles.value}>
                    {slots.default()}
                </div>
            </div>
        )
    },
})