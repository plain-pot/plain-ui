export const FormTrigger = {
    CHANGE: 'change',
    BLUR: 'blur',
    ALL: 'ALL',
}

/**
 * 根据表单校验规则以及所有的form-item对象获取所有的校验规则
 * @author  韦胜健
 * @date    2020/3/27 10:45
 */
export function getAllRules(formRules, formItems) {
    // 格式化所有的表单校验规则，表单校验规则是一个对象，每个key代表formData的字段，值可以是一个对象，也可以是一个数组；
    // 这里全部格式化为数组
    let allRules = !formRules ? {} : Object.keys(formRules).reduce((ret, field) => {
        let rule = formRules[field]
        rule = Array.isArray(rule) ? [...rule] : [rule]
        ret[field] = rule
        return ret
    }, {});

    // 因为form-item也可以设置校验规则，这里统计form-item的校验规则，全部合并到一起
    (formItems || []).forEach(formItem => {
        let {rules, field, required, label} = formItem

        rules = rules || []
        // form-item 的校验规则可能是一个对象，也可能是一个数组
        rules = Array.isArray(rules) ? rules : [rules]

        // form-item的校验规则可以不指定 field，当form-item的 field为一个单独的字符串时，自动填上field；否则要求开发者指定 field
        rules.forEach(item => {
            if (!item.field) {
                if (!field || Array.isArray(field)) {
                    console.error(`规则 ${label} : ${JSON.stringify(item)} 需要指定field`)
                } else {
                    item.field = field
                }
            }
        })

        rules = [...rules]

        // form-item必填
        if (required) {
            if (!field) {
                console.error(`规则 ${label} : 必填需要指定field`)
            } else {
                // 如果field是一个数组，则每个field都加一个必填校验规则
                if (Array.isArray(field)) {
                    field.forEach(itemField => {
                        rules.push({required: true, field: itemField})
                    })
                } else {
                    // field为单独一个字符串，只增加一个校验规则
                    rules.push({required: true, field})
                }
            }
        }

        // 合并所有的校验规则
        allRules[field] = allRules[field] || []
        allRules[field].push(...rules)
    })

    return allRules
}

/**
 * 获取所有字段的必填信息
 * @author  韦胜健
 * @date    2020/3/27 10:45
 */
export function getAllRequired(rules) {
    return Object.keys(rules).reduce((ret, field) => {
        ret[field] = rules[field].some((rule) => !!rule.required)
        return ret
    }, {})
}

/**
 * 获取所有字段对应的文本信息
 * @author  韦胜健
 * @date    2020/3/27 11:12
 */
export function allFieldLabels(formItems) {
    return (formItems || []).reduce((ret, item) => {
        let {field, label} = item
        if (!!field && !!label) {
            field = Array.isArray(field) ? field : [field]
            field.forEach(item => {
                ret[item] = label
            })
        }
        return ret
    }, {})
}

/**
 * 校验
 * @author  韦胜健
 * @date    2020/3/27 10:45
 */
export async function validateFieldByRules(rules, formData, field, trigger) {

    if (trigger === FormTrigger.ALL) {
        rules = rules[field]
    } else {
        /*筛选符合当前校验规则的 trigger*/
        rules = (rules[field] || []).filter(item => {
            let itemTrigger = item.trigger || FormTrigger.CHANGE
            if (itemTrigger !== FormTrigger.BLUR && itemTrigger !== FormTrigger.CHANGE) {
                console.error(`无法识别 trigger :${itemTrigger}`)
            }
            return itemTrigger === trigger
        })
    }

    if (rules.length === 0) {
        /* 没有符合 trigger 的规则，跳过*/
        return null
    }

    const value = formData

    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        let {required, min, max, regexp, message, options, validator} = rule

        const getValidateMessage = async () => typeof message === 'function' ? await message(value, rule) : message
        const reject = async (defaultMessage) => {
            return {
                message: await getValidateMessage() || defaultMessage,
                rule,
                field,
                trigger,
            }
        }

        /*required*/
        if (required && (value !== 0 && !value)) return await reject('不能为空！')

        if (value != null) {
            /*min*/
            if (min != null) {
                /*array*/
                if (Array.isArray(value) && value.length < min) return await reject(`不能少于 ${min} 个`)
                /*string*/
                if (typeof value === 'string' && value.length < min) return await reject(`字符长度不能小于 ${min}`)
                /*number*/
                if (typeof value === 'number' && value < min) return await reject(`不能小于 ${min}`)
            }
            /*max*/
            if (max != null) {
                /*array*/
                if (Array.isArray(value) && value.length > max) return await reject(`不能多于 ${max} 个`)
                /*string*/
                if (typeof value === 'string' && value.length > max) return await reject(`字符长度不能大于 ${max}`)
                /*number*/
                if (typeof value === 'number' && value > max) return await reject(`不能大于 ${max} 个`)
            }
            /*regexp*/
            if (regexp != null) {
                if (!(regexp).test(String(value))) return await reject()
            }

            /*options*/
            if (!!options) {
                if (Array.isArray(options)) {
                    if (options.indexOf(value) === -1) return await reject('校验不通过')
                } else {
                    if (options !== value) {
                        return await reject('校验不通过')
                    }
                }
            }
        }

        /*validator*/
        if (validator) {
            const validateResult = await validator()
            if (!!validateResult) return await reject(validateResult)
        }
    }
    // 所有校验规则通过
    return true
}

/**
 * 校验字段
 * @author  韦胜健
 * @date    2020/3/27 10:46
 */
export async function validateField(context, validateResult, rules, formData, field, trigger) {

    console.log(field, trigger)

    const result = await validateFieldByRules(rules, formData, field, trigger)
    if (result === true) {
        context.$set(validateResult, field, null)
    } else if (result != null) {
        context.$set(validateResult, field, result.message)
    }
    return result
}

export async function validateAsync(context, validateResult, rules, formData, callback, onStart, onEnd) {
    const dfd = {
        promise: null,
        resolve: null,
        reject: null,
    }
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve
        dfd.reject = reject
    })

    if (!!callback) {
        dfd.resolve = dfd.reject = (...args) => callback(...args)
    }

    const validateFields = Object.keys(rules)
    const validateTasks = validateFields.reduce((ret, field) => {
        ret.push(validateField(context, validateResult, rules, formData, field, FormTrigger.ALL))
        return ret
    }, [])

    if (!!onStart) onStart()

    Promise.all(validateTasks).then(
        () => {
            for (let i = 0; i < validateFields.length; i++) {
                const field = validateFields[i];
                if (!!validateResult[field]) {
                    const message = validateResult[field]
                    if (!!message) return dfd.reject({message, field})
                }
            }
            return dfd.resolve()
        },
        (e) => {
            return dfd.reject({message: String(e)})
        }
    ).finally(() => {
        if (!!onEnd) {
            onEnd()
        }
    })

    return dfd.promise

}