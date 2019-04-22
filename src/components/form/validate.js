import $utils from "../../scripts/utils";

const ruleSeparator = ':';
const paramSeparator = ',';

/**
 * 校验规则对象
 * @author  韦胜健
 * @date    2018/11/28 15:23
 */
const validate = {
    /**
     * 所有的校验规则
     * @author  韦胜健
     * @date    2018/11/28 15:23
     */
    rules: [
        {
            /*必输校验*/
            name: 'required',
            execute(val, params) {
                return {isValid: val != null, validMsg: '必填',}
            },
        },
        {
            /*长度校验 length:5,10*/
            name: 'length',
            execute(val, params) {
                if (!params) {
                    console.error('length校验必须指定最大长度或者最小长度！')
                    return
                }
                let [min = '?', max = '?'] = params
                if (min !== '?' && (!val || val.length < (min - 0))) return {isValid: false, validMsg: `长度不能小于${min}`}
                if (max !== '?' && !!val && val.length > (max - 0)) return {isValid: false, validMsg: `长度不能大于${max}`}
                return {isValid: true}
            },
        },
        {
            /*邮箱校验*/
            name: 'email',
            execute(val, params) {
                if (!val) return {isValid: true}
                const regexp = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
                const flag = regexp.test(val)
                return {isValid: flag, validMsg: flag ? null : '邮箱格式不正确',}
            },
        },
        {
            /*手机号码*/
            name: 'phone',
            execute(val, params) {
                if (!val) return {isValid: true}
                const regexp = /^1[3456789]\d{9}$/;
                const flag = regexp.test(val)
                return {isValid: flag, validMsg: flag ? null : '电话号码格式不正确',}
            },
        },
        {
            /*qq号码*/
            name: 'qq',
            execute(val, params) {
                if (!val) return {isValid: true}
                const regexp = /^[1-9][0-9]{4,9}$/;
                const flag = regexp.test(val)
                return {isValid: flag, validMsg: flag ? null : 'qq号码格式不正确',}
            },
        },
        {
            /*身份证号*/
            name: 'cardId',
            execute(val, params) {
                if (!val) return {isValid: true}
                const regexp15 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/;
                const regexp18 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

                const flag = regexp15.test(val) || regexp18.test(val)
                return {isValid: flag, validMsg: flag ? null : '身份证号格式不正确',}
            },
        },
        {
            /*自定义正则表达式*/
            name: 'regexp',
            execute(val, params) {
                if (!val) return {isValid: true}
                const regexp = new RegExp(...params.slice(1))
                const flag = regexp.test(val)
                return {isValid: flag, validMsg: flag ? null : params[0],}
            },
        },
    ],
    /**
     * 校验规则名称数组
     * @author  韦胜健
     * @date    2018/11/28 15:23
     */
    get ruleNames() {
        return this.rules.reduce((ret, item) => {
            ret.push(item.name)
            return ret
        }, [])
    },
    /**
     * 解析校验规则名称，解析出名称以及校验参数
     * @author  韦胜健
     * @date    2018/11/28 17:54
     * @param ruleName 校验规则名称，形如length:5,10
     */
    analysisRuleName(ruleName) {
        let [name, params] = ruleName.split(ruleSeparator)
        const ruleIndex = this.ruleNames.indexOf(name)
        if (ruleIndex === -1) {
            console.error(`[${name}]校验规则不存在`)
            return null
        }
        return (val) => this.rules[ruleIndex].execute(val, !!params ? params.split(paramSeparator) : null)
    },
    /**
     * 对值按照校验规则进行校验
     * @author  韦胜健
     * @date    2018/11/28 17:54
     * @param val 要校验的值
     * @param ruleNames 校验规则名称或者校验规则数组，形如 'required' 或者 ['required','length:5,10']
     */
    validate(val, ruleNames) {
        ruleNames = typeOf(ruleNames) === 'array' ? ruleNames : [ruleNames]
        for (let i = 0; i < ruleNames.length; i++) {
            const result = this.analysisRuleName(ruleNames[i])(val)
            if (!!result && !result.validate) {
                return result
            }
        }
        return null
    }
}

export default validate
