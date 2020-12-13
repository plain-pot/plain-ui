/**
 * 校验触发动作类型
 * @author  韦胜健
 * @date    2020/12/12 15:41
 */
import {toArray} from "../../utils/toArray";

/**
 * 校验触发器类型
 * @author  韦胜健
 * @date    2020/12/12 22:02
 */
export enum FormValidateTrigger {
    change = 'change',
    blur = 'blur',
    all = 'all',
}

/**
 * 校验的值类型
 * @author  韦胜健
 * @date    2020/12/12 22:02
 */
export enum FormValueType {
    string = 'string',
    number = 'number',
    boolean = 'boolean',
    array = 'array',
}

/**
 * form以及formItem的rules属性类型
 * @author  韦胜健
 * @date    2020/7/18 12:39
 */
export interface FormRule {

    field?: string | string[]                                                               // 绑定的字段
    label?: string                                                                          // form item 的文本
    options?: any | any[]                                                                   // 选项值校验

    max?: number,                                                                           // 最大长度（字符串），最大值（数字），最大长度（数组）
    min?: number,                                                                           // 最小长度（字符串），最小值（数字），最小长度（数组）
    message?: string,                                                                       // 检验事变提示信息
    pattern?: RegExp,                                                                       // 校验的正则表达式
    required?: boolean,                                                                     // 是否必填
    transform?: (val?: any) => any,                                                         // 将字段值转换成目标值之后校验
    type?: FormValueType,                                                                   // 数据的类型
    trigger?: FormValidateTrigger,                                                          // 触发器
    validator?: (rule: FormRule, value: any, formData: object) => void | string | Promise<void | string>,// 自定义校验器

}

/**
 * pl-form组件 rules 属性对象类型
 * @author  韦胜健
 * @date    2020/12/12 15:59
 */
export type FormComponentRules = FormRule[] | ({ [field: string]: FormRule | FormRule[] })

/**
 * pl-form-item 组件rules属性对象类型
 * @author  韦胜健
 * @date    2020/12/12 15:59
 */
export interface FormComponentItemRules {
    label?: string,
    field?: string | string[]
    required?: boolean,
    rules?: FormRule | FormRule[]
}

/**
 * 校验单个字段的结果
 * @author  韦胜健
 * @date    2020/12/12 22:24
 */
export interface FormValidateResult {
    label?: string,
    message: string,
    rule: FormRule,
    value: any,
}

/**
 * 校验结果
 * @author  韦胜健
 * @date    2020/12/12 22:24
 */
export interface FormValidateResultMap {[k: string]: FormValidateResult | undefined}

/**
 * 表单校验工具对象
 * @author  韦胜健
 * @date    2020/12/13 14:53
 */
export const FormValidateUtils = {
    /**
     * 获取max校验失败信息
     * @author  韦胜健
     * @date    2020/12/13 14:54
     */
    getMaxMessage({value, max, type,}: { value: any, max: number, type?: FormValueType, }) {
        if (Array.isArray(value)) {
            return `最多选择 ${max} 个选项`
        }
        if (type == "number") {
            return `最大值 ${max}`
        }
        return `最大文本长度 ${max} 个字符`
    },
    /**
     * 获取min校验失败信息
     * @author  韦胜健
     * @date    2020/12/13 14:54
     */
    getMinMessage({value, min, type,}: { value: any, min: number, type?: FormValueType, }) {
        if (Array.isArray(value)) {
            return `最少选择 ${min} 个选项`
        }
        if (type == "number") {
            return `最小值 ${min}`
        }
        return `最小文本长度 ${min} 个字符`
    },
    /**
     * 获取有效值列表。如果值不存在则返回null
     * @author  韦胜健
     * @date    2020/12/13 14:55
     */
    getListValue<T>(val: T | T[] | null | undefined): T[] | null {
        if (!val) {
            return null
        }
        return Array.isArray(val) ? val : [val]
    },
    /**
     * 执行校验规则
     * @author  韦胜健
     * @date    2020/12/13 14:56
     * @param   rule                要校验的FormRule
     * @param   formData            表单数据对象
     * @param   fieldToLabel        字段映射label的对象
     */
    async checkRule({rule, formData, fieldToLabel,}: { formData: Record<string, any> | null, rule: FormRule, fieldToLabel: Record<string, string>, }): Promise<null | FormValidateResult> {
        const {
            transform, type,
            field, label, message,
            required, options, max, min, pattern, validator
        } = rule
        const fields = toArray(field!)
        const values = fields.map(f => {
            const v = !formData ? null : formData[f]
            return {
                field: f,
                value: !!transform ? transform(v) : v,
            }
        })

        /*---------------------------------------required 必填校验-------------------------------------------*/

        if (required) {
            const invalidValues = values.filter(({value}) => {
                if (value == null) {
                    return true
                }
                if (Array.isArray(value) && value.length === 0) {
                    return true
                }
                if (typeof value === 'string') {
                    return !!value
                } else {
                    return false
                }
            })
            if (invalidValues.length > 0) {
                const {field, value} = invalidValues[0]!
                return {
                    rule,
                    value,
                    label: label || fieldToLabel[field],
                    message: message || '必填，不能为空！',
                }
            }
        }

        /*---------------------------------------options 选项值校验-------------------------------------------*/

        if (options) {
            const invalidValues = values.filter(({value}) => {
                if (value == null) {
                    /*没有值，不校验*/
                    return false
                }
                if (!Array.isArray(value)) {
                    /*不是数组，判断值是否存在数组中*/
                    const isExist = options.indexOf(value) > -1
                    if (!isExist) {
                        return transform
                    }
                } else {
                    /*是数组，判断value数组中是否存在值，不符合options*/
                    return (value as any[]).find(v => options.indexOf(v) === -1)
                }
            })
            if (invalidValues.length > 0) {
                const {field, value} = invalidValues[0]!
                return {
                    rule,
                    value,
                    label: label || fieldToLabel[field],
                    message: message || '不符合特定选项！',
                }
            }
        }

        /*---------------------------------------max-------------------------------------------*/

        if (max != null) {
            const invalidValues = values.filter(({value}) => {
                if (value == null) {
                    /*没有值，不校验*/
                    return false
                }
                if (Array.isArray(value)) {
                    const len = value.length
                    if (len > max) {
                        return true
                    }
                }
                if (type == "number") {
                    if (Number(value) > max) {
                        return true
                    }
                }
                return String(value).length > max
            })
            if (invalidValues.length > 0) {
                const {field, value} = invalidValues[0]!
                return {
                    rule,
                    value,
                    label: label || fieldToLabel[field],
                    message: message || FormValidateUtils.getMaxMessage({value, max, type}),
                }
            }
        }

        /*---------------------------------------min-------------------------------------------*/

        if (min != null) {
            const invalidValues = values.filter(({value}) => {
                if (value == null) {
                    /*没有值，不校验*/
                    return false
                }
                if (Array.isArray(value)) {
                    const len = value.length
                    if (len < min) {
                        return true
                    }
                }
                if (type == "number") {
                    if (Number(value) < min) {
                        return true
                    }
                }
                return String(value).length > min
            })
            if (invalidValues.length > 0) {
                const {field, value} = invalidValues[0]!
                return {
                    rule,
                    value,
                    label: label || fieldToLabel[field],
                    message: message || FormValidateUtils.getMinMessage({value, min, type}),
                }
            }
        }

        /*---------------------------------------pattern-------------------------------------------*/

        if (!!pattern) {
            const invalidValues = values.filter(({value}) => {
                if (value == null) {
                    /*没有值，不校验*/
                    return false
                }
                return !pattern.test(value)
            })
            if (invalidValues.length > 0) {
                const {field, value} = invalidValues[0]!
                return {
                    rule,
                    value,
                    label: label || fieldToLabel[field],
                    message: message || '不符合特定模式',
                }
            }
        }

        /*---------------------------------------validator-------------------------------------------*/

        if (!!validator) {
            const validateResultList = (await Promise.all(fields.map(async field => {
                const value = !formData ? null : formData[field]
                const message = await validator(rule, value, formData || {})
                if (!message) {
                    return null
                }
                return {
                    rule,
                    message,
                    value,
                    label: label || fieldToLabel[field],
                }
            }))).filter(Boolean) as FormValidateResult[]
            if (validateResultList.length > 0) {
                return validateResultList[0]!
            }
        }

        return null
    }
}

/**
 * 获取总的FormRules数组
 * @author  韦胜健
 * @date    2020/12/12 21:45
 */
export function formatFormRules(
    formComponentRules?: FormComponentRules,
    formItems?: { formItemComponentRules: { value: FormComponentItemRules } }[]
) {

    /*field 转化为 label的映射*/
    let fieldToLabel = {} as Record<string, string>
    /*返回值，总的校验规则数组*/
    let resultRules: FormRule[] = []

    if (!!formItems && formItems.length > 0) {
        formItems.forEach(formItem => {
            const {formItemComponentRules: {value: {label, field, required, rules}}} = formItem
            const fields = FormValidateUtils.getListValue(field)
            if (!!fields) {
                !!label && (fields.forEach(item => fieldToLabel[item] = label));
                required && (resultRules.push({field, label, required: true,}))
            } else {
                if (required) {
                    /*如果 form-item设置了required，但是没有设置field，这里给出警告！*/
                    console.error("form-item's props.field is required when props.required is true!")
                }
            }
            const formItemRules = FormValidateUtils.getListValue(rules)
            if (!!formItemRules && formItemRules.length > 0) {
                formItemRules.forEach(r => {resultRules.push({...r, label: r.label || label, field: r.field || field,})})
            }
        })
    }

    if (!!formComponentRules) {
        let formComponentRulesList: FormRule[] = []
        if (Array.isArray(formComponentRules)) {
            formComponentRulesList = formComponentRules
        } else {
            Object.keys(formComponentRules).forEach(f => {
                const value = FormValidateUtils.getListValue(formComponentRules[f])
                !!value && value.forEach(r => formComponentRulesList.push({...r, field: r.field || f}))
            })
        }
        resultRules.push(...formComponentRulesList)
    }

    async function validateField(
        {
            field,
            formData,
            trigger,
            formValidateResultMap,
        }: {
            field: string,
            formData: Record<string, any> | null,
            trigger: FormValidateTrigger,
            formValidateResultMap: FormValidateResultMap,
        }) {

        const rules = resultRules.filter(r => {
            const matchField = Array.isArray(r.field) ? r.field.indexOf(field) > -1 : r.field == field
            if (!matchField) {
                return false
            }
            if (trigger !== FormValidateTrigger.all) {
                return r.trigger === trigger
            }
        })

        if (rules.length === 0) {
            // todo 没有匹配的规则
            formValidateResultMap[field] = undefined
        } else {
            const validateResult = (await Promise.all(rules.map(r => FormValidateUtils.checkRule({rule: r, formData, fieldToLabel}))))
                .filter(Boolean) as FormValidateResult[];
            formValidateResultMap[field] = validateResult[0]
        }

        return formValidateResultMap[field]
    }

    async function validate(formData: Record<string, any> | null): Promise<{ validateResultMap: FormValidateResultMap, validateMessage: string | undefined }> {
        const validateResultList = (await Promise.all(resultRules.map(r => FormValidateUtils.checkRule({rule: r, formData, fieldToLabel}))))
            .filter(Boolean) as FormValidateResult[];
        const validateResultMap = validateResultList.reduce((prev, next) => {
            const {rule: {field}} = next
            const fields = FormValidateUtils.getListValue(field)
            if (!!fields) {
                fields.forEach(f => prev[f] = next)
            }
            return prev
        }, {} as FormValidateResultMap)
        let validateMessage: string | undefined;
        if (validateResultList.length > 0) {
            const {label, message} = validateResultList[0]!
            validateMessage = `“${label}” 校验不通过，${message}`
        }
        return {
            validateResultMap,
            validateMessage,
        }
    }

    const fieldToRequired = resultRules.reduce((prev, next) => {
        if (!!next.required) {
            const fields = FormValidateUtils.getListValue(next.field)!
            fields.forEach(f => prev[f] = true)
        }
        return prev
    }, {} as Record<string, boolean>)

    return {
        /*通过field映射label文本*/
        fieldToLabel,
        /*所有的校验规则*/
        resultRules,
        /*通过field映射required*/
        fieldToRequired,
        methods: {
            /*校验单个字段*/
            validateField,
            /*校验所有规则*/
            validate,
        },
    }
}