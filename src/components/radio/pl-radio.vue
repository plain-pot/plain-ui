<template>
    <div class="pl-radio"
         :class="classes"
         v-click-wave="{disabled:!isEditable}"
         tabindex="1"
         @click="onClick"
         @keydown.space="onClick">
         <span class="plain-click-node">
            <transition name="pl-transition-fade" mode="out-in">
                <slot name="radio-inner">
                    <pl-radio-inner status="check" v-if="isChecked" key="check" :disabled="disabled"/>
                    <pl-radio-inner status="uncheck" v-else key="uncheck" :disabled="disabled"/>
                </slot>
            </transition>
        </span>
        <div class="pl-radio-label" v-if="label" :style="labelStyle">
            {{label}}
        </div>
    </div>
</template>

<script>
    import {EditMixin, EmitMixin, PropsMixinFactory} from "../../utils/mixins";
    import ClickWave from "../../directives/ClickWave";

    export default {
        name: "pl-radio",
        directives: {ClickWave},
        mixins: [
            EditMixin,
            EmitMixin,
            PropsMixinFactory({
                labelWidth: PropsMixinFactory.Number,
            })
        ],
        inject: {
            plRadioGroup: {default: null}
        },
        emitters: {
            emitInput: null,
        },
        props: {
            value: {},
            val: {},
            label: {type: String},
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
                if (!!this.plRadioGroup && !!this.plRadioGroup.status) return this.plRadioGroup.status
                return this.status
            },
            targetSize() {
                if (!!this.plRadioGroup && !!this.plRadioGroup.size) return this.plRadioGroup.size
                return this.size
            },
            targetLabelWidth() {
                if (!!this.p_labelWidth) return this.p_labelWidth
                if (!!this.plRadioGroup && !!this.plRadioGroup.p_labelWidth) return this.plRadioGroup.p_labelWidth
                return null
            },
            classes() {
                return [
                    `pl-radio-status-${this.targetStatus}`,
                    `pl-radio-size-${this.targetSize}`,
                    {
                        'pl-radio-checked': this.isChecked,
                        'pl-radio-disabled': this.isDisabled,
                    },
                ]
            },
            isChecked() {
                if (!!this.plRadioGroup) {
                    return this.plRadioGroup.isChecked(this.val)
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

                if (!!this.plRadioGroup) {
                    if (this.isChecked) return;
                    this.plRadioGroup.onClickRadio(this)
                } else {
                    this.p_value = this.isChecked ? this.falseValue : this.trueValue
                    this.emitInput(this.p_value)
                }
            },
        },
    }
</script>

<style lang="scss">
</style>