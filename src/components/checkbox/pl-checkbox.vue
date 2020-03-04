<template>
    <div class="pl-checkbox" @click="onClick" :class="classes" v-click-wave>
        <span class="plain-click-node">
            <transition name="pl-transition-fade" mode="out-in">
                <pl-checkbox-inner status="check" v-if="isChecked" key="check" :disabled="disabled"/>
                <pl-checkbox-inner status="uncheck" v-else key="uncheck" :disabled="disabled"/>
            </transition>
        </span>
        <span class="pl-checkbox-label" v-if="label">
            {{label}}
        </span>
    </div>
</template>

<script>
    import RCheckboxInner from "./pl-checkbox-inner";
    import ClickWave from "../../directives/ClickWave";

    export default {
        name: "pl-checkbox",
        directives: {ClickWave},
        components: {RCheckboxInner},
        props: {
            value: {},
            label: {type: String},

            trueValue: {default: true},
            falseValue: {default: false},

            status: {type: String, default: 'primary'},                 // primary,success,warn,error,info
            disabled: {type: Boolean},
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
                    {
                        'pl-checkbox-disabled': this.disabled,
                    },
                ]
            },
            isChecked() {
                return this.p_value === this.trueValue
            },
        },
        methods: {
            onClick() {
                this.p_value = this.isChecked ? this.falseValue : this.trueValue
                this.$emit('input', this.p_value)
            },
        },
    }
</script>

<style lang="scss">
</style>