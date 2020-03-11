<template>
    <div class="pl-checkbox"
         :class="classes"
         v-click-wave="{disabled:!isEditable}"
         tabindex="1"
         @click="onClick"
         @keydown.space="onClick">
        <span class="plain-click-node">
            <transition name="pl-transition-fade" mode="out-in">
                <slot name="checkbox-inner">
                    <pl-checkbox-inner status="check" v-if="isChecked" key="check" :disabled="disabled"/>
                    <pl-checkbox-inner status="uncheck" v-else key="uncheck" :disabled="disabled"/>
                </slot>
            </transition>
        </span>
        <div class="pl-checkbox-label" v-if="p_label" :style="labelStyle">
            {{p_label}}
        </div>
    </div>
</template>

<script>
    import RCheckboxInner from "./pl-checkbox-inner";
    import ClickWave from "../../directives/ClickWave";
    import {EditMixin, EmitMixin, PropsMixinFactory} from "../../utils/mixins";

    export default {
        name: "pl-checkbox",
        directives: {ClickWave},
        components: {RCheckboxInner},
        mixins: [EmitMixin, EditMixin, PropsMixinFactory({
            label: PropsMixinFactory.Promise,
            labelWidth: PropsMixinFactory.Number,
        })],
        inject: {
            plCheckboxGroup: {default: null},
        },
        emitters: {
            emitInput: null,
        },
        props: {
            value: {},
            val: {},                                                    // 多选时选中值
            label: {type: String},                                      // 显示文本
            labelWidth: {type: [String, Number]},                       // 文本宽度
            trueValue: {default: true},
            falseValue: {default: false},
            status: {type: String, default: 'primary'},                 // primary,success,warn,error,info
            size: {type: String, default: 'default'},                   // large,default,small

            ignore: {type: Boolean},                                    // 忽略 plCheckboxGroup
        },
        data() {
            return {
                p_value: this.value
            }
        },
        watch: {
            value(val) {
                if (this.p_value === val) return
                this.p_value = val
            },
        },
        computed: {
            targetStatus() {
                if (!!this.plCheckboxGroup && !!this.plCheckboxGroup.status) return this.plCheckboxGroup.status
                return this.status
            },
            targetSize() {
                if (!!this.plCheckboxGroup && !!this.plCheckboxGroup.size) return this.plCheckboxGroup.size
                return this.size
            },
            targetLabelWidth() {
                if (!!this.p_labelWidth) return this.p_labelWidth
                if (!!this.plCheckboxGroup && !!this.plCheckboxGroup.p_labelWidth) return this.plCheckboxGroup.p_labelWidth
                return null
            },
            classes() {
                return [
                    `pl-checkbox-status-${this.targetStatus}`,
                    `pl-checkbox-size-${this.targetSize}`,
                    {
                        'pl-checkbox-checked': this.isChecked,
                        'pl-checkbox-disabled': this.isDisabled,
                    },
                ]
            },
            isChecked() {
                if (!!this.plCheckboxGroup && !this.ignore) {
                    return this.plCheckboxGroup.isChecked(this.val)
                } else {
                    return this.p_value === this.trueValue
                }
            },
            labelStyle() {
                if (!this.targetLabelWidth) return null
                return {width: `${this.targetLabelWidth}px`}
            },
        },
        methods: {
            onClick() {
                if (!this.isEditable) return

                if (!!this.plCheckboxGroup && !this.ignore) {
                    this.plCheckboxGroup.onClickCheckbox(this)
                } else {
                    this.p_value = this.isChecked ? this.falseValue : this.trueValue
                    this.emitInput(this.p_value)
                }
            },
        },
        created() {
            !!this.plCheckboxGroup && !this.ignore && this.plCheckboxGroup.addItem(this)
        },
        beforeDestroy() {
            !!this.plCheckboxGroup && !this.ignore && this.plCheckboxGroup.removeItem(this)
        },
    }
</script>

<style lang="scss">
</style>