/**
 * 校验触发动作类型
 * @author  韦胜健
 * @date    2020/12/12 15:41
 */
export enum FormValidateTrigger {
    change = 'change',
    blur = 'blur',
    all = 'all',
}

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

    field?: string                                                                          // 绑定的字段
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
export type FormComponentRules = FormRule[] | ({ [field: string]: FormRule })

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

export function formatFormRules(
    formComponentRules?: FormComponentRules,
    formItems?: { formItemComponentRules: { value: FormComponentItemRules } }[]
) {
    console.log({
        formComponentRules,
        formItems,
    })
}