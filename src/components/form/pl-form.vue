<template>
    <div class="pl-form" :class="classes" :style="styles">
        <div class="pl-form-body" :style="bodyStyles">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
    import {EditMixin, EmitMixin, PropsMixinFactory, StyleMixin} from "../../utils/mixins";
    import {FormRule, FormTrigger} from "./form";
    import {typeOf} from "../../../submodules/plain-loading/src/utils/utils";

    export default {
        name: "pl-form",
        mixins: [
            EmitMixin,
            EditMixin,
            StyleMixin,
            PropsMixinFactory.create({
                labelWidth: PropsMixinFactory.Number,
                contentWidth: PropsMixinFactory.Number,
                column: PropsMixinFactory.Number,
                width: PropsMixinFactory.Number,
            })
        ],
        emitters: {
            emitUpdateValidateResult: Function,                                 // validateResult属性更新
        },
        props: {
            value: {type: Object},                                              // model绑定表单对象
            rules: {type: Object},                                              // 表单验证规则
            validateResult: {type: Object},                                     // 校验结果信息

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

        },
        provide() {
            return {
                plForm: this,
            }
        },
        watch: {
            validateResult: {
                immediate: true,
                handler(val) {
                    this.p_validateResult = val || {}
                },
            },
            p_validateResult(val) {
                this.emitUpdateValidateResult(val)
            },
        },
        data() {

            let validateFieldRules: (field: string, validateTrigger: FormTrigger) => string | null | Promise<string>
            validateFieldRules = async (field, validateTrigger) => {
                const rules = this.allRules[field]
                const value = this.value[field]

                if (!!rules && rules.length > 0) {
                    for (let i = 0; i < rules.length; i++) {
                        const rule = rules[i] as FormRule;
                        let {trigger, required, min, max, regexp, message, validator} = rule
                        trigger = trigger || FormTrigger.CHANGE
                        if (validateTrigger === trigger) {

                            const getValidateMessage = async () => typeof message === 'function' ? await message(value, rule) : message

                            /*required*/
                            if (required && (value !== 0 && !value)) return await getValidateMessage() || '不能为空'

                            /*min*/
                            if (min != null && value != null) {
                                /*array*/
                                if (Array.isArray(value) && value.length < min) return await getValidateMessage() || `不能少于 ${min} 个`
                                /*string*/
                                if (typeof value === 'string' && value.length < min) return await getValidateMessage() || `字符长度不能小于 ${min}`
                                /*number*/
                                if (typeof value === 'number' && value < min) return await getValidateMessage() || `不能小于 ${min}`
                            }
                            /*max*/
                            if (max != null && value != null) {
                                /*array*/
                                if (Array.isArray(value) && value.length > max) return await getValidateMessage() || `不能多于 ${max} 个`
                                /*string*/
                                if (typeof value === 'string' && value.length > max) return await getValidateMessage() || `字符长度不能大于 ${max}`
                                /*number*/
                                if (typeof value === 'number' && value > max) return await getValidateMessage() || `不能大于 ${max} 个`
                            }
                            /*regexp*/
                            if (regexp != null) {
                                if (!(regexp as RegExp).test(String(value))) return await getValidateMessage()
                            }
                            /*validator*/
                            if (validator) {
                                const validateResult = await validator()
                                if (!!validateResult) return validateResult
                            }

                        }
                    }
                }
                return null
            }
            /*校验字段*/
            const validateField = async (field: string, validateTrigger: FormTrigger) => {
                const validateMessage = await validateFieldRules(field, validateTrigger)
                this.$set(this.p_validateResult, field, validateMessage)
            }

            return {

                formItems: [],                                                  // form-item子组件
                maxLabelWidth: null,                                            // 自动计算最大formItem文本宽度
                p_validateResult: null,                                         // 校验结果信息
                validateField: this.$plain.utils.throttle(validateField, 300, {leading: true, trailing: true})
            }
        },
        computed: {
            /**
             * label宽度
             * @author  韦胜健
             * @date    2020/3/18 14:32
             */
            targetLabelWidth(): number | null {
                if (!!this.p_labelWidth) return this.p_labelWidth
                if (!!this.maxLabelWidth) return this.maxLabelWidth
                return null
            },
            /**
             * 内容宽度
             * @author  韦胜健
             * @date    2020/3/18 14:32
             */
            targetContentWidth(): number | null {
                return this.p_contentWidth || 300
            },
            /**
             * 整个form-item宽度
             * @author  韦胜健
             * @date    2020/3/18 14:32
             */
            targetItemWidth(): number | null {
                if (!this.targetLabelWidth) return null
                if (!this.targetContentWidth) return null
                return this.targetLabelWidth + this.targetContentWidth
            },
            /**
             * .pl-form-body的样式
             * @author  韦胜健
             * @date    2020/3/18 14:32
             */
            bodyStyles(): null | object {
                if (!this.targetItemWidth) return null
                return {
                    width: `${this.p_column * (this.targetItemWidth)}px`,
                    left: `${this.p_column === 1 ? -this.targetLabelWidth : 0}px`
                }
            },
            /**
             * 表单尺寸
             * @author  韦胜健
             * @date    2020/3/18 14:32
             */
            p_size(): null | string {
                if (!!this.size) return this.size
                if (!!this.plParentStyler && !!this.plParentStyler.p_size) return this.plParentStyler.p_size
                // return this.p_column === 1 ? 'large' : null
                return null
            },
            /**
             * 根节点class
             * @author  韦胜健
             * @date    2020/3/18 14:33
             */
            classes(): any[] {
                return [
                    `pl-form-label-align-${this.labelAlign}`,
                    `pl-form-column-${this.p_column || 1}`,
                    `pl-form-size-${this.p_size || 'normal'}`
                ]
            },
            /**
             * 根节点style
             * @author  韦胜健
             * @date    2020/3/18 14:33
             */
            styles(): object {
                return {
                    width: this.$plain.utils.suffixPx(this.p_width)
                }
            },
            /**
             * 所有的校验规则
             * @author  韦胜健
             * @date    2020/3/18 14:33
             */
            allRules(): object {
                let allRules = !this.rules ? {} : Object.keys(this.rules).reduce((ret, field) => {
                    let rule = this.rules[field]
                    rule = Array.isArray(rule) ? [...rule] : [rule]
                    ret[field] = rule
                    return ret
                }, {});
                this.formItems.forEach(formItem => {
                    let {rules, field, required} = formItem
                    if (!!field && (!!rules || !!required)) {
                        rules = rules || []
                        let rule = allRules[field] || []
                        rule = [...(Array.isArray(rules) ? rules : [rules]), ...rule]
                        if (!!required) {
                            rule.push({required: true, message: '不能为空！'})
                        }
                        allRules[field] = rule
                    }
                })
                return allRules
            },
            /**
             * 字段是否必填
             * @author  韦胜健
             * @date    2020/3/18 14:33
             */
            allFieldRequired(): { [key: string]: boolean } {
                return Object.keys(this.allRules).reduce((ret, field) => {
                    ret[field] = this.allRules[field].some((rule) => !!rule.required)
                    return ret
                }, {})
            },
        },
        methods: {
            /*---------------------------------------methods-------------------------------------------*/
            /*---------------------------------------handler-------------------------------------------*/
            /**
             * 添加 form-item
             * @author  韦胜健
             * @date    2020/3/18 14:51
             */
            addItem(formItem): void {
                this.formItems.push(formItem)

                if (this.p_labelWidth == null && formItem.labelEl) {
                    const labelWidth = formItem.labelEl.offsetWidth
                    if (!this.maxLabelWidth || this.maxLabelWidth < labelWidth) {
                        this.maxLabelWidth = labelWidth
                    }
                }
            },
            /**
             *  移除form-item
             * @author  韦胜健
             * @date    2020/3/18 14:51
             */
            removeItem(formItem): void {
                const index = this.formItems.indexOf(formItem)
                if (index > -1) {
                    this.formItems.splice(index, 1)
                }
            },
            /**
             * 处理子组件 change 事件
             * @author  韦胜健
             * @date    2020/3/18 14:52
             */
            onChange(field: string): void {
                this.validateField(field, FormTrigger.CHANGE)
            },
            /**
             * 处理子组件blur事件
             * @author  韦胜健
             * @date    2020/3/18 14:52
             */
            onBlur(field: string): void {
                this.validateField(field, FormTrigger.BLUR)
            },

        },
    }
</script>

<style lang="scss">
</style>