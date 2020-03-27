<template>
    <div class="pl-form" :class="classes" :style="styles" v-loading="loadingMask || p_loadingMask">
        <div class="pl-form-body" :style="bodyStyles">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
    import {EditMixin, EmitMixin, PropsMixinFactory, StyleMixin} from "../../utils/mixins";
    import {FormTrigger, allFieldLabels, getAllRequired, getAllRules, validateAsync, validateField} from "./validate";

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
            emitFieldChange: Function,                                          // 字段的值发生了变化
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
            centerWhenSingleColumn: {type: Boolean},                            // 单列的时候会使得表单内容居中，表单文本标题不计宽度，设置该属性为true则使得文本宽度参与计算居中
            loadingMask: {type: [Boolean, Object]},                             // 是否展示loading遮罩
        },
        provide() {
            return {
                plForm: this,
            }
        },
        watch: {
            value: {
                deep: true,
                handler(newFormData) {
                    let oldFormData = this.p_value
                    const fields = Array.from(new Set([...Object.keys(newFormData || {}), ...(Object.keys(oldFormData))]))
                    fields.forEach(field => {
                        let newVal = newFormData[field]
                        let oldVal = oldFormData[field]
                        if (!this.$plain.utils.deepEqual(newVal, oldVal)) {
                            this.emitFieldChange(field, newVal, oldVal)
                            this.onChange(field)
                        }
                    })
                    this.p_value = this.$plain.utils.deepcopy(this.value || {})
                },
            },
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

            const onChange = this.$plain.utils.throttle((field: string): void => {
                validateField(this, this.p_validateResult, this.allRules, this.value, field, FormTrigger.CHANGE)
            }, 300)
            const onBlur = this.$plain.utils.throttle((field: string): void => {
                validateField(this, this.p_validateResult, this.allRules, this.value, field, FormTrigger.BLUR)
            }, 300)

            return {
                p_value: this.$plain.utils.deepcopy(this.value || {}),

                formItems: [],                                                          // form-item子组件
                maxLabelWidth: null,                                                    // 自动计算最大formItem文本宽度
                p_validateResult: null,                                                 // 校验结果信息
                p_loadingMask: false,

                onChange,
                onBlur,
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
                return this.p_contentWidth || 400
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
                    left: `${(!this.centerWhenSingleColumn && this.p_column === 1) ? -this.targetLabelWidth / 2 : 0}px`
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
            }
            ,
            /**
             * 所有的校验规则
             * @author  韦胜健
             * @date    2020/3/18 14:33
             */
            allRules(): object {
                return getAllRules(this.rules, this.formItems.map((formItem) => {
                    return {
                        rules: formItem.rules,
                        field: formItem.field,
                        label: formItem.label,
                        required: formItem.required,
                    }
                }))
            },
            /**
             * 字段是否必填
             * @author  韦胜健
             * @date    2020/3/18 14:33
             */
            allFieldRequired(): { [key: string]: boolean } {
                return getAllRequired(this.allRules)
            },
            /**
             * 所有字段对应的文本
             * @author  韦胜健
             * @date    2020/3/27 11:13
             */
            allFieldLabels() {
                return allFieldLabels(this.formItems.map(item => {
                    return {label: item.label, field: item.field}
                }))
            },
        },
        methods: {
            /*---------------------------------------methods-------------------------------------------*/
            async validate(callback: Function, loadingMask: boolean = true) {

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

                const result = await validateAsync(this, this.p_validateResult, this.allRules, this.value, callback,
                    () => {
                        if (loadingMask) {
                            this.p_loadingMask = true
                        }
                    },
                    () => {
                        if (loadingMask) {
                            this.p_loadingMask = false
                        }
                    }
                )

                if (!!result) {
                    if (!!result.field) {
                        let label = this.allFieldLabels[result.field]
                        result.label = label
                    }
                    dfd.reject(result)
                } else {
                    dfd.resolve(null)
                }

                return dfd.promise
            },
            async validateWithoutMask(callback) {
                return this.validate(callback, false)
            },
            /**
             * 清除校验信息
             * @author  韦胜健
             * @date    2020/3/18 17:53
             */
            clearValidate() {
                this.p_validateResult = Object.keys(this.p_validateResult).reduce((ret, field) => {
                    ret[field] = null
                    return ret
                }, {})
            },
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
                        this.maxLabelWidth = labelWidth + 1
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
        },
    }
</script>

<style lang="scss">
</style>