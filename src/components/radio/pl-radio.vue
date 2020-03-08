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
        <div class="pl-radio-label" v-if="label">
            {{label}}
        </div>
    </div>
</template>

<script>
    import {EditMixin,EmitMixin} from "../../utils/mixins";
    import ClickWave from "../../directives/ClickWave";

    export default {
        name: "pl-radio",
        directives: {ClickWave},
        mixins: [EditMixin, EmitMixin],
        inject: {
            plRadioGroup: {default: null}
        },
        emitters: {
            emitInput: null,
            emitChange: null,
        },
        props: {
            value: {},
            val: {},
            label: {type: String},
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
                    this.emitChange(this.p_value)
                }
            },
        },
    }
</script>

<style lang="scss">
</style>