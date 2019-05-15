import $utils from "../../scripts/utils";

const ruleSeparator = ':';
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
            execute(val) {
                return {isValid: val != null && val !== '', validMsg: '必填',}
            },
        },
        {
            /*长度校验 length:5,10*/
            name: 'length',
            execute(val, {max, min} = {}) {
                if (max == null && min == null) {
                    console.error('length校验必须指定最大长度或者最小长度！')
                    return
                }
                if (min !== '?' && (!val || val.length < (min - 0))) return {isValid: false, validMsg: `长度不能小于${min}`}
                if (max !== '?' && !!val && val.length > (max - 0)) return {isValid: false, validMsg: `长度不能大于${max}`}
                return {isValid: true}
            },
        },
        {
            /*邮箱校验*/
            name: 'email',
            execute(val) {
                if (!val) return {isValid: true}
                const regexp = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
                const flag = regexp.test(val)
                return {isValid: flag, validMsg: flag ? null : '邮箱格式不正确',}
            },
        },
        {
            /*手机号码*/
            name: 'phone',
            execute(val) {
                if (!val) return {isValid: true}
                const regexp = /^1[3456789]\d{9}$/;
                const flag = regexp.test(val)
                return {isValid: flag, validMsg: flag ? null : '电话号码格式不正确',}
            },
        },
        {
            /*qq号码*/
            name: 'qq',
            execute(val) {
                if (!val) return {isValid: true}
                const regexp = /^[1-9][0-9]{4,9}$/;
                const flag = regexp.test(val)
                return {isValid: flag, validMsg: flag ? null : 'qq号码格式不正确',}
            },
        },
        {
            /*身份证号*/
            name: 'cardId',
            execute(val) {
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
            execute(val, {reg, msg}) {
                if (!val) return {isValid: true}
                let regExp;
                switch ($utils.typeOf(reg)) {
                    case 'regExp':
                        regExp = reg
                        break
                    case 'string':
                        regExp = new RegExp(reg)
                        break
                    default:
                        console.log('reg is invalid:', reg)
                }
                if (!!regExp) {
                    const flag = regExp.test(val)
                    return {isValid: flag, validMsg: flag ? null : msg,}
                } else {
                    return {isValid: true}
                }

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
     * @param rule 校验规则名称，形如length:5,10
     */
    analysisRule(rule) {
        let ret;
        if ($utils.typeOf(rule) === 'object') {
            ret = rule
            const ruleNameIndex = this.ruleNames.indexOf(ret.rule)
            if (ruleNameIndex === -1) {
                console.error(`校验规则不存在“${ret.rule}”`)
                return () => ({})
            }
            ret = {
                rule: ret.rule,
                param: Object.keys(ret).reduce((r, key) => {
                    key !== 'rule' && (r[key] = ret[key])
                    return r
                }, {})
            }
        } else {
            let name, params, ruleSeparatorIndex;
            ruleSeparatorIndex = rule.indexOf(ruleSeparator)
            name = ruleSeparatorIndex > -1 ? rule.substring(0, ruleSeparatorIndex) : rule
            const ruleNameIndex = this.ruleNames.indexOf(name)
            if (ruleNameIndex === -1) {
                console.error(`校验规则不存在“${name}”`)
                return () => ({})
            }
            const paramString = rule.substring(ruleSeparatorIndex + 1, rule.length)
            try {
                params = ruleSeparatorIndex > -1 ? $utils.parseJson(paramString) : {}
            } catch (e) {
                console.log('json解析错误：', paramString)
                console.error(e)
            }
            ret = {
                rule: name,
                param: params,
            }
        }
        return ret
    },
    /**
     * 对值按照校验规则进行校验
     * @author  韦胜健
     * @date    2018/11/28 17:54
     * @param val 要校验的值
     * @param required 是否必输
     * @param rules 校验规则名称或者校验规则数组，形如 'required' 或者 ['required','length:5,10']
     */
    validate(val, required, rules) {
        rules = rules || []
        rules = $utils.typeOf(rules) === 'array' ? rules : [rules]
        !!required && rules.push('required')
        rules = rules.map(rule => this.analysisRule(rule))

        for (let i = 0; i < rules.length; i++) {
            const item = rules[i]
            const index = this.ruleNames.indexOf(item.rule)
            const result = this.rules[index].execute(val, item.param)
            if (!!result && !result.isValid) {
                return result
            }
        }
        return {isValid: true, validMsg: null}
    }
}

export default validate
