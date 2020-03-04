<template>
    <div class="pl-checkbox"
         :class="classes"
         v-click-wave="{disabled:isDisabled}"
         tabindex="1"
         @click="onClick"
         @keydown.space="onClick">
        <span class="plain-click-node">
            <transition name="pl-transition-fade" mode="out-in">
                <pl-checkbox-inner status="check" v-if="isChecked" key="check" :disabled="disabled"/>
                <pl-checkbox-inner status="uncheck" v-else key="uncheck" :disabled="disabled"/>
            </transition>
        </span>
        <div class="pl-checkbox-label" v-if="label">
            {{label}}
        </div>
    </div>
</template>

<script>
    import RCheckboxInner from "./pl-checkbox-inner";
    import ClickWave from "../../directives/ClickWave";
    import {EmitMixin} from "../../utils/EmitMixin";
    import {EditMixin} from "../../utils/mixins";

    export default {
        name: "pl-checkbox",
        directives: {ClickWave},
        components: {RCheckboxInner},
        mixins: [EmitMixin, EditMixin],
        props: {
            value: {},
            label: {type: String},
            trueValue: {default: true},
            falseValue: {default: false},
            status: {type: String, default: 'primary'},                 // primary,success,warn,error,info
            size: {type: String, default: 'default'},                   // large,default,small
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
            classes() {
                return [
                    `pl-checkbox-status-${this.status}`,
                    `pl-checkbox-size-${this.size}`,
                    {
                        'pl-checkbox-checked': this.p_value,
                        'pl-checkbox-disabled': this.isDisabled,
                    },
                ]
            },
            isChecked() {
                return this.p_value === this.trueValue
            },
        },
        methods: {
            onClick() {
                if (!this.isEditable) return
                this.p_value = this.isChecked ? this.falseValue : this.trueValue
                this.$emit('input', this.p_value)
            },
        },
    }
</script>

<style lang="scss">
</style>