<template>
    <div class="pl-form" :class="classes" :style="styles">
        <div class="pl-form-body" :style="bodyStyles">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import {EditMixin, PropsMixinFactory, StyleMixin} from "../../utils/mixins";


    export default {
        name: "pl-form",
        mixins: [
            EditMixin,
            StyleMixin,
            PropsMixinFactory.create({
                labelWidth: PropsMixinFactory.Number,
                contentWidth: PropsMixinFactory.Number,
                column: PropsMixinFactory.Number,
                width: PropsMixinFactory.Number,
            })
        ],
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
        data() {
            return {

                formItems: [],                                                  // form-item子组件
                maxLabelWidth: null,                                            // 自动计算最大formItem文本宽度
            }
        },
        computed: {
            /**
             * label宽度
             * @author  韦胜健
             * @date    2020/3/18 14:32
             */
            targetLabelWidth() {
                if (!!this.p_labelWidth) return this.p_labelWidth
                if (!!this.maxLabelWidth) return this.maxLabelWidth
                return null
            },
            /**
             * 内容宽度
             * @author  韦胜健
             * @date    2020/3/18 14:32
             */
            targetContentWidth() {
                return this.p_contentWidth || 300
            },
            /**
             * 整个form-item宽度
             * @author  韦胜健
             * @date    2020/3/18 14:32
             */
            targetItemWidth() {
                if (!this.targetLabelWidth) return null
                if (!this.targetContentWidth) return null
                return this.targetLabelWidth + this.targetContentWidth
            },
            /**
             * .pl-form-body的样式
             * @author  韦胜健
             * @date    2020/3/18 14:32
             */
            bodyStyles() {
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
            p_size() {
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
            classes() {
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
            styles() {
                return {
                    width: this.$plain.utils.suffixPx(this.p_width)
                }
            },
            /**
             * 所有的校验规则
             * @author  韦胜健
             * @date    2020/3/18 14:33
             */
            allRules() {
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
            allFieldRequired() {
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
            addItem(formItem) {
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
            removeItem(formItem) {
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
            onChange(field) {
                console.log(`${field} change ==>> `, this.value[field])
            },
            /**
             * 处理子组件blur事件
             * @author  韦胜健
             * @date    2020/3/18 14:52
             */
            onBlur(field) {
                console.log(`${field} blur ==>> `, this.value[field])
            },
        },
    }
</script>

<style lang="scss">
</style>