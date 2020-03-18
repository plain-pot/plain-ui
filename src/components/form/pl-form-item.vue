<template>
    <div class="pl-form-item" :class="classes">
        <div class="pl-form-item-label" ref="labelEl" :style="labelStyles" v-if="hasLabel">
            <span><slot name="label">{{p_label}}</slot></span>
        </div>
        <div class="pl-form-item-body" :style="bodyStyles">
            <div class="pl-form-item-content">
                <slot></slot>
            </div>
            <div class="pl-form-item-suffix" v-if="!!$slots.suffix">
                <slot name="suffix"></slot>
            </div>
        </div>
        <div class="pl-form-item-message">
            <span>{{validateMessage}}</span>
        </div>
    </div>
</template>

<script>
    import {EditMixin, PropsMixinFactory, RefsMixinFactory, StyleMixin} from "../../utils/mixins";

    export default {
        name: "pl-form-item",
        inject: {
            plForm: {}
        },
        mixins: [
            EditMixin,
            RefsMixinFactory({
                labelEl: null,
            }),
            StyleMixin,
            PropsMixinFactory.create({
                label: PropsMixinFactory.Promise,
                labelWidth: PropsMixinFactory.Number,
                column: PropsMixinFactory.Number,
            })
        ],
        props: {
            field: {type: String},                                              // 绑定的属性字段名
            rules: {type: [Array, Object]},                                     // 校验规则
            required: {type: Boolean},                                          // 不能为空
            hideRequiredAsterisk: {type: Boolean, default: null},               // 是否隐藏文本旁边的红色必填星号
            hideValidateMessage: {type: Boolean, default: null},                // 是否隐藏校验失败的信息
            validateOnRulesChange: {type: Boolean, default: null},              // 是否当rules属性改变之后立即触发一次验证

            label: {type: String, default: ' '},                                // 显示文本
            labelWidth: {type: [String, Number]},                               // 显示文本宽度
            column: {type: [String, Number]},                                   // 多列表单的列数
            block: {type: Boolean},                                             // 占用一行
        },
        refs: {
            labelEl: null,
        },
        data() {
            return {
                isFormItem: true,                                               // 标记变量，用来给子组件判断其父组件是否为 form-item
            }
        },
        computed: {
            /**
             * 当前是否禁用
             * @author  韦胜健
             * @date    2020/3/18 14:49
             */
            isDisabled() {
                if (this.disabled !== null) return this.disabled
                else if (!!this.field && !!this.plForm.disabledFields && !!this.plForm.disabledFields[this.field]) return true
                else if (!!this.plParentEditor) return this.plParentEditor.isDisabled
                return false
            },
            /**
             * 当前是否只读
             * @author  韦胜健
             * @date    2020/3/18 14:49
             */
            isReadonly() {
                if (this.readonly !== null) return this.readonly
                else if (!!this.field && !!this.plForm.readonlyFields && !!this.plForm.readonlyFields[this.field]) return true
                else if (!!this.plParentEditor) return this.plParentEditor.isReadonly
                return false
            },
            /**
             * label文本样式
             * @author  韦胜健
             * @date    2020/3/18 14:49
             */
            labelStyles() {
                if (this.plForm.targetLabelWidth != null) {
                    return {width: `${this.plForm.targetLabelWidth}px`}
                } else if (!!this.p_labelWidth) {
                    return {width: `${this.p_labelWidth}px`}
                }
                return null
            },
            /**
             * .pl-form-item-body样式
             * @author  韦胜健
             * @date    2020/3/18 14:50
             */
            bodyStyles() {
                let width;
                if (this.block) {
                    if (!this.plForm.targetItemWidth) {
                        width = null
                    } else {
                        width = this.plForm.p_column * (this.plForm.targetItemWidth) - this.plForm.targetLabelWidth
                    }
                } else {
                    const column = this.p_column || 1

                    if (!this.plForm.targetItemWidth) {
                        width = null
                    } else {
                        width = column * (this.plForm.targetItemWidth) - this.plForm.targetLabelWidth
                    }
                }

                if (!width) {
                    return null
                } else {
                    return {
                        width: `${width}px`
                    }
                }
            },
            /**
             * 当前是否存在label
             * @author  韦胜健
             * @date    2020/3/18 14:50
             */
            hasLabel() {
                if (!!this.p_label || !!this.$slots.label) return true
                if (!this.$slots.default && !this.$slots.suffix) return true
                return false
            },
            /**
             * 根节点class
             * @author  韦胜健
             * @date    2020/3/18 14:50
             */
            classes() {
                return {
                    'pl-form-item-required': this.isRequired,
                    'pl-form-item-invalidate': !!this.validateMessage,
                }
            },
            /**
             * 根据校验规则判断当前是否必填
             * @author  韦胜健
             * @date    2020/3/18 14:50
             */
            isRequired() {
                if (!this.plForm || !this.field) return false
                return this.plForm.allFieldRequired[this.field]
            },
            /**
             * 校验信息
             * @author  韦胜健
             * @date    2020/3/18 16:06
             */
            validateMessage() {
                if (!this.plForm) return null
                return this.plForm.p_validateResult[this.field]
            },
            /**
             *  当前校验状态
             * @author  韦胜健
             * @date    2020/3/18 16:48
             */
            p_status() {
                if (!!this.status) return this.status
                if (!!this.validateMessage) return 'error'
                if (!!this.plParentStyler && this.plParentStyler.p_status) return this.plParentStyler.p_status
                return null
            },
        },
        mounted() {
            this.plForm.addItem(this)
        },
        beforeDestroy() {
            this.plForm.removeItem(this)
        },
        methods: {
            /*---------------------------------------handler-------------------------------------------*/
            onChange() {
                if (!!this.field && !!this.plForm) this.plForm.onChange(this.field);
            },
            onBlur() {
                if (!!this.field && !!this.plForm) this.plForm.onBlur(this.field);
            },
        },
    }
</script>

<style lang="scss">
    @include themify {
        .pl-form {
            @include public-style;
            font-size: 14px;
            text-align: center;
            display: inline-block;

            .pl-form-body {
                position: relative;
                display: inline-block;
                text-align: left;
            }

            &.pl-form-size-large {
                font-size: 16px;
            }

            .pl-form-item {
                display: inline-block;
                padding-bottom: 24px;
                text-align: left;
                position: relative;

                & > * {
                    display: inline-block;
                    vertical-align: top;
                }

                .pl-form-item-label {
                    text-align: right;
                    padding-right: 10px;
                    padding-top: 5px;
                    padding-left: 32px;

                    span {
                        position: relative;
                    }
                }

                .pl-form-item-suffix {
                    padding-left: 10px;
                    padding-top: 5px;
                }

                .pl-form-item-body {
                    display: inline-flex;

                    .pl-form-item-content {
                        flex: 1;
                        display: inline-flex;
                        align-items: center;

                        .pl-input, .pl-textarea, .pl-checkbox-group, .pl-radio-group {
                            flex: 1;

                            .pl-input-inner, .pl-textarea-inner {
                                width: 100% !important;
                            }
                        }

                        .pl-button + .pl-button {
                            margin-left: 10px;
                        }

                        .pl-radio, .pl-checkbox {
                            padding-top: 5px;
                        }
                    }
                }

                .pl-form-item-message {
                    position: absolute;
                    bottom: 4px;
                    right: 0;
                    font-size: 12px;
                    color: $colorError;
                }

                &.pl-form-item-required {
                    .pl-form-item-label {
                        span {
                            &:before {
                                position: absolute;
                                content: '*';
                                color: $colorError;
                                left: -1em;
                                top: 2px;
                            }
                        }
                    }
                }
            }

            &.pl-form-size-mini {
                font-size: 12px;
            }

            &.pl-form-label-align-left {
                .pl-form-item-label {
                    text-align: left;
                }
            }

            &.pl-form-label-align-center {
                .pl-form-item-label {
                    text-align: center;
                }
            }

            &.pl-form-label-align-right {
                .pl-form-item-label {
                    text-align: right;
                }
            }
        }
    }
</style>