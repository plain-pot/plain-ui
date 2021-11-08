import Schema from 'async-validator'
import {deepcopy} from "plain-utils/object/deepcopy";
import {defer} from "plain-utils/utils/defer";
import {PlainObject} from 'plain-utils/utils/event';
import {iRuleItem} from "./async.validator.utils";

const logError = (msg: string) => {console.error(`PlForm:${msg}`)}

/**
 * 触发校验的动作类型
 * @author  韦胜健
 * @date    2021/5/30 12:27
 */
export enum FormValidateTrigger {
    change = 'change',
    blur = 'blur',
}

/**
 * 校验器函数validator的类型
 * @author  韦胜健
 * @date    2021/5/30 12:25
 */
export type tFormRuleValidator = (val: any, row: PlainObject, rule: tFormRuleItem) => tFormRuleValidatorResult | Promise<tFormRuleValidatorResult>;

/**
 * 校验器函数validator函数的返回结果类型
 * @author  韦胜健
 * @date    2021/5/30 12:26
 */
export type tFormRuleValidatorResult = string | null | undefined | void

/**
 * 校验的结果对象类型
 * @author  韦胜健
 * @date    2021/5/30 12:27
 */
export type tFormRuleItem = Omit<iRuleItem, 'required'> & {
    required?: boolean | tFormRuleValidator,

    trigger?: string,
    label?: string,
    field?: string | string[],
}

/**
 * PlFormItem组件，从props中获取的校验相关属性类型
 * @author  韦胜健
 * @date    2021/5/30 12:27
 */
export interface iFormItemPropRules {
    label?: string,
    field?: string | string[]
    required?: boolean | tFormRuleValidator,
    rules?: tFormRuleItem | tFormRuleItem[]
}

/**
 * PlForm组件props.rules的类型
 * @author  韦胜健
 * @date    2021/5/30 18:55
 */
export type tFormPropRules = Record<string, tFormRuleItem | tFormRuleItem[]>

/**
 * 关联校验字段
 * @author  韦胜健
 * @date    2020/12/28 12:07
 */
export type FormAssociateFields = Record<string, string | string[]>

export type FormValidateError = {
    field: string,
    message: string,
    label: string,
}

export const FormValidateUtils = {
    getFieldArray: (field: string | string[] | undefined): string[] => {
        if (!field) return []
        return Array.isArray(field) ? [...field] : [field]
    },
    getRuleArray: (rule: tFormRuleItem | tFormRuleItem[]): tFormRuleItem[] => {
        return deepcopy(Array.isArray(rule) ? rule : [rule])
    },
    getValueByField(field: string, formData: Record<string, any> | undefined | null, transform?: (val: any, value: any) => any) {
        if (!formData) {
            return null
        }
        let val: any;
        if (field.indexOf('.') === -1) {
            val = formData[field]
        } else {
            const fields = field.split('.')
            let index = 0, len = fields.length
            let value = formData[fields[index]]

            while (index < len - 1 && value != null) {
                value = value[fields[++index]]
            }
            val = index == len - 1 ? value : null
        }
        return !transform ? val : transform(val, formData)
    },
}

/**
 * 根据 PlForm以及PlFormItem接收到的
 * @author  韦胜健
 * @date    2021/5/30 13:18
 */
export function getFormRuleData({formProps, formItems, requiredMessage}: {
    formProps: { rules?: tFormPropRules, },
    formItems: { value: { props: iFormItemPropRules }[] },
    requiredMessage: string,
}) {

    type StateRules = Omit<tFormRuleItem, 'field'> & { field: string | string[] }

    const state = {
        /*所有的校验规则*/
        stateRules: [] as StateRules[],
        /*字段转显示文本*/
        fieldToLabel: {} as Record<string, string | undefined>,
        /*用于判断字段是否必填*/
        fieldRequired: {} as Record<string, boolean | undefined>,
    }

    const utils = {
        /*判断某个字段是否有必填标识*/
        isRequired: (field?: string | string[]) => {
            if (!field) {return false}
            const fields = [...FormValidateUtils.getFieldArray(field)]
            return fields.some(f => !!state.fieldRequired[f])
        },
        /*添加一个stateRule*/
        addStateRule: (stateRule: StateRules) => {
            state.stateRules.push(stateRule)
        },
        /*添加一个label*/
        addLabel: (field?: string | string[], label?: string) => {
            if (!field || !label) {return}
            FormValidateUtils.getFieldArray(field).forEach((f) => {
                state.fieldToLabel[f] = label
            })
        },
        /*添加一个required*/
        addRequired: (field: string | string[], required: boolean | tFormRuleValidator | undefined) => {
            FormValidateUtils.getFieldArray(field).forEach(f => {
                if (required == null) {return}
                state.fieldRequired[f] = typeof required !== "function" && !!required
            })
        }
    }

    if (!!formProps.rules) {
        Object.entries(formProps.rules).forEach(([f, r]) => {
            FormValidateUtils.getRuleArray(r!).forEach((rule) => {
                utils.addLabel(rule.field || f, rule.label)
                utils.addRequired(rule.field || f, rule.required)
                utils.addStateRule({
                    ...rule,
                    field: rule.field || f,
                })
            })
        })
    }

    formItems.value.forEach(({props: {label, field, required, rules}}) => {
        utils.addLabel(field, label)

        if (required) {
            if (!field) {
                /*如果没有field，但是设置了required，提示警告信息*/
                console.error({label, field, required, rules})
                logError('PlFormItem.props.field is required when PlForm.props.required is working!')
            } else {
                utils.addRequired(field, required)
                const requiredRule: StateRules = {
                    field,
                    required,
                }
                utils.addStateRule(requiredRule)
            }
        }
        if (rules) {
            FormValidateUtils.getRuleArray(rules).forEach(r => {
                if (!!r.label) {utils.addLabel(r.field || field, r.label)}

                if (!r.field) {
                    if (!field) {
                        /*如果没有field，但是设置了rule，提示警告信息*/
                        console.error(r)
                        logError('PlFormItem.props.field is required when PlForm.props.rules[].field is working!')
                    } else {
                        r.field = field
                        if (r.required) {utils.addRequired(r.field || field, r.required)}
                    }
                }
                !!r.field && utils.addStateRule({
                    ...r,
                    field: r.field!,
                })
            })
        }
    })

    const rules = state.stateRules.reduce((prev, rule) => {
        const {field, trigger, label, required, message, transform: prevTransform, ...leftRule} = rule

        const errorMessage = (typeof message === "function" ? message() : message) || requiredMessage

        const requiredValidation: iRuleItem["asyncValidator"] = async (rule, value, callback, source) => {
            if (typeof required === "function") {return callback(await required(value, source, rule) || undefined)}
            if (value == null) {return callback(errorMessage)}
            if (typeof value === "string" && !value.trim()) {return callback(errorMessage)}
            if (Array.isArray(value) && value.length === 0) {return callback(errorMessage)}
            return callback()
        }

        FormValidateUtils.getFieldArray(field).forEach(f => {
            if (!prev[f]) {prev[f] = []}
            let transform: any = f.indexOf('.') === -1 ? prevTransform : (val: any, source: any) => FormValidateUtils.getValueByField(f, source, prevTransform)

            if (required) {
                // console.log(f, 'asyncValidator')
                prev[f].push({trigger, transform, asyncValidator: requiredValidation})
            }
            if (Object.keys(leftRule).length > 0) {
                prev[f].push({
                    ...leftRule,
                    message,
                    trigger,
                    transform,
                })
            }
        })
        return prev
    }, {} as Record<string, (iRuleItem & { trigger?: string })[]>)

    const methods = {
        getRules({field, trigger, associateFields}: {
            field: string | string[],
            trigger: FormValidateTrigger | undefined,
            associateFields?: FormAssociateFields,
        }) {
            const fs = (() => {
                const fields = FormValidateUtils.getFieldArray(field)
                !!associateFields && fields.forEach((f) => {
                    if (associateFields[f]) {
                        fields.push(...FormValidateUtils.getFieldArray(associateFields[f]))
                    }
                })
                return fields
            })();

            const fitRuleList = [] as (iRuleItem & { trigger?: string })[]
            const fitRuleMap = {} as Record<string, (iRuleItem & { trigger?: string })[]>
            Object.entries(rules).forEach(([f, rs]) => {
                if (fs.indexOf(f) > -1) {
                    if (!fitRuleMap[f]) {fitRuleMap[f] = []}
                    const fitRules = !trigger ? rs : rs.filter(i => (i.trigger || FormValidateTrigger.change) === trigger)
                    fitRuleMap[f]!.push(...fitRules)
                    fitRuleList.push(...fitRules)
                }
            })
            return {
                fitRuleList,
                fitRuleMap,
            }
        },
        validateField: (
            {
                rules,
                allErrors,
                formData,
            }: {
                rules: Record<string, iRuleItem[]>,
                allErrors: FormValidateError[],
                formData: any,
            }) => {

            const validation = new Schema(rules as any)
            const dfd = defer<FormValidateError[]>()
            // console.log('fitRuleMap', fitRuleMap, rules)
            const ruleKeys = Object.keys(rules)
            validation.validate(formData, undefined, (errors) => {
                const newErrors = allErrors.filter(e => ruleKeys.indexOf(e.field) === -1)
                dfd.resolve([...newErrors, ...errors || []].map(i => ({
                    ...i,
                    label: state.fieldToLabel[i.field]!,
                })))
            }).then()

            return dfd.promise
        },
        validate: (formData: any) => {
            const validation = new Schema(rules as any)
            const dfd = defer<FormValidateError[]>()
            validation.validate(formData, undefined, (errors) => {
                dfd.resolve((errors || []).map(i => ({
                    ...i,
                    label: state.fieldToLabel[i.field]!
                })))
            }).then()
            return dfd.promise
        },
    }

    return {
        utils,
        rules,
        ...state,
        methods,
    }
}

export type tFormRuleData = ReturnType<typeof getFormRuleData>


