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

function getListValue<T>(val: T | T[] | null | undefined): T[] | null {
    if (!val) {
        return null
    }
    return Array.isArray(val) ? val : [val]
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
            const fields = getListValue(field)
            if (!!fields) {
                !!label && (fields.forEach(item => fieldToLabel[item] = label));
                required && (resultRules.push({field, label, required: true,}))
            } else {
                if (required) {
                    /*如果 form-item设置了required，但是没有设置field，这里给出警告！*/
                    console.error("form-item's props.field is required when props.required is true!")
                }
            }
            const formItemRules = getListValue(rules)
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
                const value = getListValue(formComponentRules[f])
                !!value && value.forEach(r => formComponentRulesList.push({...r, field: r.field || f}))
            })
        }
        resultRules.push(...formComponentRulesList)
    }

    console.log({
        fieldToLabel,
        resultRules,
    })
}