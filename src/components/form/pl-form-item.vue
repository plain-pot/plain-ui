<template>
    <div class="pl-form-item">
        <div class="pl-form-item-label" ref="labelEl" :style="labelStyles" v-if="hasLabel">
            <slot name="label">{{p_label}}</slot>
        </div>
        <div class="pl-form-item-body" :style="bodyStyles">
            <div class="pl-form-item-content">
                <slot></slot>
            </div>
            <div class="pl-form-item-suffix" v-if="!!$slots.suffix">
                <slot name="suffix"></slot>
            </div>
        </div>
    </div>
</template>

<script>
    import {EditMixin, PropsMixinFactory, RefsMixinFactory} from "../../utils/mixins";

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
            PropsMixinFactory({
                label: PropsMixinFactory.Promise,
                labelWidth: PropsMixinFactory.Number,
                column: PropsMixinFactory.Number,
            })
        ],
        props: {
            field: {type: String},                                              // 绑定的属性字段名
            label: {type: String},                                              // 显示文本
            labelWidth: {type: [String, Number]},                               // 显示文本宽度
            column: {type: [String, Number]},                                   // 多列表单的列数
            block: {type: Boolean},                                             // 占用一行
        },
        refs: {
            labelEl: null,
        },
        data() {
            return {
                isFormItem: true,
            }
        },
        computed: {
            isDisabled() {
                if (this.disabled !== null) return this.disabled
                else if (!!this.field && !!this.plForm.disabledFields && !!this.plForm.disabledFields[this.field]) return true
                else if (!!this.plParentEditor) return this.plParentEditor.isDisabled
                return false
            },
            isReadonly() {
                if (this.readonly !== null) return this.readonly
                else if (!!this.field && !!this.plForm.readonlyFields && !!this.plForm.readonlyFields[this.field]) return true
                else if (!!this.plParentEditor) return this.plParentEditor.isReadonly
                return false
            },
            labelStyles() {
                if (this.plForm.targetLabelWidth != null) {
                    return {width: `${this.plForm.targetLabelWidth}px`}
                } else if (!!this.p_labelWidth) {
                    return {width: `${this.p_labelWidth}px`}
                }
                return null
            },
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
            hasLabel() {
                if (!!this.p_label || !!this.$slots.label) return true
                if (!this.$slots.default && !this.$slots.suffix) return true
                return false
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
            onChange(val) {
                console.log(`${this.field} change:${String(val)}`)
            },
            onBlur(val) {
                console.log(`${this.field} blur`)
            },
        },
    }
</script>

<style lang="scss">
    @include themify {
        .pl-form {
            @include public-style;
            text-align: center;

            .pl-form-body {
                display: inline-block;
                text-align: left;
            }

            .pl-form-item {
                display: inline-block;
                padding-bottom: 20px;
                text-align: left;

                & > * {
                    display: inline-block;
                    vertical-align: top;
                }

                .pl-form-item-label {
                    text-align: right;
                    padding-right: 10px;
                    padding-top: 5px;
                }

                .pl-form-item-body {
                    display: inline-flex;

                    .pl-form-item-suffix {
                        padding-left: 10px;
                        padding-top: 5px;
                    }

                    .pl-form-item-content {
                        flex: 1;
                        display: inline-flex;
                        align-items: center;

                        .pl-input, .pl-textarea {
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
            }
        }
    }
</style>