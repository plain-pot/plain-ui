import {set} from "@vue/composition-api";
import {toArray} from "@/util/util";

/**
 * 触发器类型
 * @author  韦胜健
 * @date    2020/7/18 12:38
 */
export enum FormTrigger {
    CHANGE = 'change',
    BLUR = 'blur',
    ALL = 'all',
}

/**
 * 校验的时候，值的类型
 * @author  韦胜健
 * @date    2020/7/18 12:38
 */
export enum FormValueType {
    string = 'string',
    number = 'number',
    array = 'array',
}

/**
 * 校验字段的结果
 * @author  韦胜健
 * @date    2020/7/18 12:39
 */
export interface ValidateResult {
    message: string,
    rule: TargetRule
}

/**
 * 校验信息对象
 * @author  韦胜健
 * @date    2020/7/18 12:39
 */
export interface ValidateResultMap {
    [k: string]: ValidateResult
}

/**
 * form以及formItem的rules属性类型
 * @author  韦胜健
 * @date    2020/7/18 12:39
 */
interface Rule {
    validator?: (rule: Rule, value: any) => void | string | Promise<void | string>,         // 校验器
    required?: boolean,                                                                     // 是否必填
    trigger?: FormTrigger,                                                                  // 触发器
    message?: string,                                                                       // 检验事变提示信息
    type?: FormValueType,                                                                   // 数据的类型
    max?: number,                                                                           // 最大长度（字符串），最大值（数字），最大长度（数组）
    min?: number,                                                                           // 最小长度（字符串），最小值（数字），最小长度（数组）
    field?: string                                                                          // 绑定的字段
    label?: string                                                                          // form item 的文本
    regexp?: RegExp                                                                         // 校验的正则表达式
    options?: any | any[]                                                                   // 选项值校验
}

/**
 * FormItem对象需要的类型
 * @author  韦胜健
 * @date    2020/7/18 12:41
 */
interface FormItemType {
    label?: string,
    field?: string | string[]
    required?: boolean,
    rules?: Rule | Rule[]
}

/**
 * 目标校验规则对象类型
 * @author  韦胜健
 * @date    2020/7/18 12:41
 */
export interface TargetRule {
    field: string,
    trigger: FormTrigger,
    validator: Rule["validator"] | null,
    required: boolean,                          // 是否有必填检验属性
    message: string | null,
    type: FormValueType,
    max: number | null,
    min: number | null,
    label: string | null,
    regexp: RegExp | null,
    options: any | any[] | null,
}

/**
 * 将rule转化为targetRule
 * @author  韦胜健
 * @date    2020/7/18 12:41
 */
function getTargetRule(rule: Rule): TargetRule | null {
    if (!rule.field) {
        return null
    }
    return {
        field: rule.field,
        trigger: rule.trigger || FormTrigger.CHANGE,
        required: rule.required != null ? rule.required : false,
        message: rule.message || null,
        type: rule.type || FormValueType.string,
        max: rule.max || null,
        min: rule.min || null,
        validator: rule.validator || null,
        label: rule.label || null,
        regexp: rule.regexp || null,
        options: rule.options || null,
    }
}


/**
 * 根据表单校验规则以及所有的form-item对象获取所有的校验规则
 * @author  韦胜健
 * @date    2020/3/27 10:45
 */
export function getAllRules(
    formRules: { [k: string]: Rule | Rule[] } | undefined,                      // form 接收得到的rules属性
    formItems: FormItemType[],                                                  // form 收集得到的 form item 对象类型
    allFieldLabels: Readonly<{ [k: string]: string | undefined }>,              // 根据 form item收集得到的field对应label的映射
): TargetRule[] {

    const targetRules: TargetRule[] = []

    // 将formRules转化为targetRule，其中如果没有配置label，则从allFieldLabels中查找；
    formRules = formRules || {}
    Object.keys(formRules).forEach(field => {
        const rules = toArray(formRules![field])
        targetRules.push(...rules.map(rule => getTargetRule({
            ...rule,
            label: rule.label || allFieldLabels[field],
            field,
        })).filter(Boolean) as TargetRule[])
    })

    // 将 formItem中的信息转化为TargetRule
    formItems = formItems || []
    formItems.forEach(formItem => {
        if (!formItem.field) {
            return
        }
        let {field, label, rules, required} = formItem

        const fields = toArray(field)
        let formItemRules: Rule[] = []

        // 如果设置了 required必填，则给每一个field添加一个必填的rule
        if (required) {
            fields.forEach(field => {
                formItemRules.push({
                    field,
                    label: label || allFieldLabels[field],
                    required: true,
                })
            })
        }

        if (!!rules) {
            const ruleList = toArray(rules)
            ruleList.forEach(rule => {
                // 如果rule没有指定field，则给form item的每一个field添加一条这个rule的校验规则
                if (!rule.field) {
                    fields.forEach(field => {
                        formItemRules.push({
                            field,
                            label: label || allFieldLabels[field],
                            ...rule,
                        })
                    })
                } else {
                    // 否则仅天骄这条rule校验规则
                    formItemRules.push({
                        field: rule.field,
                        label: label || allFieldLabels[rule.field],
                        ...rule,
                    })
                }
            })
        }
        targetRules.push(...formItemRules.map(rule => getTargetRule(rule)).filter(Boolean) as TargetRule[])
    })

    return targetRules
}

/**
 * 获取所有字段的必填信息
 * @author  韦胜健
 * @date    2020/3/27 10:45
 */
export function getAllRequired(targetRules: TargetRule[]): { [k: string]: boolean } {
    return targetRules.reduce((ret: { [k: string]: boolean }, item: TargetRule) => {
        if (!!item.required) ret[item.field] = true
        return ret
    }, {})
}

/**
 * 获取所有字段对应的文本信息
 * @author  韦胜健
 * @date    2020/3/27 11:12
 */
export function getAllFieldLabels(formItems: FormItemType[]): { [k: string]: string | undefined } {
    return formItems.reduce((ret: { [k: string]: string | undefined }, item: FormItemType) => {
        const fields = toArray(item.field).filter(Boolean) as string[]
        fields.forEach(field => ret[field] = item.label || undefined)
        return ret
    }, {})
}

/**
 * 根据formItems以及formRule计算得到所有需要的校验信息
 * @author  韦胜健
 * @date    2020/7/19 11:47
 */
export function getValidateConfigData(
    formItems: { label?: string, field?: string | unknown[], required?: boolean, rules?: object | undefined[] }[],
    formRule: any
) {
    const allFieldLabels = getAllFieldLabels(formItems as any)
    const allRules = getAllRules(formRule, formItems as any, allFieldLabels)
    const allRequired = getAllRequired(allRules)

    return {
        allFieldLabels,
        allRules,
        allRequired,
    }
}


/**
 * 校验
 * @author  韦胜健
 * @date    2020/3/27 10:45
 */
export async function validateFieldByRules(targetRules: TargetRule[], formData: object, field: string, trigger: FormTrigger): Promise<null | ValidateResult> {

    const value = formData[field]

    for (let i = 0; i < targetRules.length; i++) {
        const rule = targetRules[i];
        let {required, min, max, regexp, message, validator, type, options} = rule

        const reject = (defaultMessage: string) => ({message: message || defaultMessage, rule})

        /*---------------------------------------required-------------------------------------------*/
        if (required) {
            switch (type) {
                case FormValueType.array:
                    if (!value) {
                        return reject('必填！')
                    } else if (value.length) {
                        return reject('至少选择一个选项！')
                    }
                    break
                case FormValueType.number:
                    if (!value && value != 0) {
                        return reject('必填！')
                    }
                    break
                case FormValueType.string:
                    if (!value) {
                        return reject('必填！')
                    }
                    break
            }
        }

        if (value != null) {
            if (max != null) {
                switch (type) {
                    case FormValueType.string:
                        if (value.length > max) return reject(`长度不能大于 ${max} 个字符！`)
                        break
                    case FormValueType.number:
                        if (value > max) return reject(`最大值 ${max}！`)
                        break
                    case FormValueType.array:
                        if (value.length > max) return reject(`最多选择 ${max} 个选项！`)
                        break
                }
            }
            if (min != null) {
                switch (type) {
                    case FormValueType.string:
                        if (value.length < min) return reject(`长度不能小于 ${min} 个字符！`)
                        break
                    case FormValueType.number:
                        if (value < min) return reject(`最小值 ${min}！`)
                        break
                    case FormValueType.array:
                        if (value.length < min) return reject(`最少选择 ${min} 个选项！`)
                        break
                }
            }
            if (regexp != null) {
                if (!regexp.test(value)) {
                    return reject('校验不通过！')
                }
            }
        }

        /*---------------------------------------validator-------------------------------------------*/
        if (validator) {
            const validateResult = await validator(rule as any, value)
            if (!!validateResult) return await reject(validateResult)
        }

        /*---------------------------------------options-------------------------------------------*/
        if (!!options) {
            if (Array.isArray(options)) {
                if (options.indexOf(value) === -1) {
                    return reject('校验不通过！')
                }
            } else {
                if (options != value) {
                    return reject('校验不通过！')
                }
            }
        }
    }
    // 所有校验规则通过
    return null
}

/**
 * 校验字段
 * @author  韦胜健
 * @date    2020/3/27 10:46
 */
export async function validateField(validateResult: ValidateResultMap, rules: TargetRule[], formData: object, field: string, trigger: FormTrigger): Promise<ValidateResult | null> {

    rules = rules.filter(rule => rule.field === field)
    rules = ((trigger === FormTrigger.ALL ? rules : rules.filter((rule) => rule.trigger === trigger)) as TargetRule[])

    if (rules.length === 0) {
        /* 没有符合 trigger 的规则，跳过*/
        return null
    }

    // 有targetRules校验，并且将校验结果存放在 validateResultMap中
    const result = await validateFieldByRules(rules, formData, field, trigger)
    set(validateResult, field, result)
    return result
}

/**
 * 校验所有信息
 * @author  韦胜健
 * @date    2020/7/18 11:14
 */
export async function validateAsync(config: { validateResult: ValidateResultMap, rules: TargetRule[], formData: object, onStart: Function, onEnd: Function })
    : Promise<null | { validateResult: ValidateResultMap | null, message: string }> {

    const {
        validateResult,
        rules,
        formData,
        onStart,
        onEnd,
    } = config

    !!onStart && onStart();
    try {
        // 对所有字段的校验结果
        const validateResultList = (await Promise.all(rules.map(rule => validateField(validateResult, rules, formData, rule.field, FormTrigger.ALL)))).filter(Boolean) as ValidateResult[]

        // 将所有字段的校验结果转化为对象，key为字段名，value为校验结果
        const newValidateResultMap = validateResultList.length == 0 ? null : validateResultList.reduce((ret: ValidateResultMap, item: ValidateResult) => {
            ret[item.rule.field] = item
            return ret
        }, {})

        if (!newValidateResultMap) {
            return null
        }

        // 默认提示信息为校验结果中的第一条校验结果提示
        const firstValidateResult = validateResultList[0]!

        return {
            validateResult: newValidateResultMap,
            message: `${firstValidateResult.rule.label} 校验不通过，${firstValidateResult.message}`,
        }
    } catch (e) {
        return {
            validateResult: null,
            message: String(e),
        }
    } finally {
        !!onEnd && onEnd();
    }
}
