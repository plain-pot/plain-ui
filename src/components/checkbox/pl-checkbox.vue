<template>
    <div class="pl-checkbox"
         :class="classes"
         :style="styles"
         v-click-wave="{disabled:!isEditable}"
         tabindex="0"
         @click="onClick"
         @keydown.space.stop.prevent="onClick">
        <span class="plain-click-node">
            <transition name="pl-transition-fade" mode="out-in">
                <slot name="checkbox-inner">
                    <pl-checkbox-inner status="check" v-if="isChecked" key="check" :disabled="isDisabled"/>
                    <pl-checkbox-inner status="uncheck" v-else key="uncheck" :disabled="isDisabled"/>
                </slot>
            </transition>
        </span>
        <div class="pl-checkbox-label" v-if="p_label">
            {{p_label}}
        </div>
    </div>
</template>

<script>
    import RCheckboxInner from "./pl-checkbox-inner";
    import ClickWave from "../../directives/ClickWave";
    import {EditMixin, EmitMixin, PropsMixinFactory, StyleMixin} from "../../utils/mixins";

    export default {
        name: "pl-checkbox",
        directives: {ClickWave},
        components: {RCheckboxInner},
        mixins: [
            EmitMixin,
            EditMixin,
            StyleMixin,
            PropsMixinFactory({
                label: PropsMixinFactory.Promise,
                width: PropsMixinFactory.Number,
            })
        ],
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
            width: {type: [String, Number]},                            // 宽度
            trueValue: {default: true},                                 // 选中实际值
            falseValue: {default: false},                               // 非选中值
            status: {type: String, default: 'primary'},                 // primary,success,warn,error,info

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
            targetWidth() {
                if (!!this.p_width) return this.p_width
                if (!!this.plCheckboxGroup && !!this.plCheckboxGroup.p_itemWidth) return this.plCheckboxGroup.p_itemWidth
                return null
            },
            classes() {
                return [
                    `pl-checkbox-status-${this.targetStatus}`,
                    `pl-checkbox-size-${this.p_size || 'normal'}`,
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
            styles() {
                return !!this.targetWidth ? {width: this.$plain.utils.suffixPx(this.targetWidth)} : null
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