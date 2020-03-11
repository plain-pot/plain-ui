<template>
    <div class="pl-form-item">
        <div class="pl-form-item-label" ref="labelEl" :style="labelStyles" v-if="!!p_label || !!$slots.default">
            <slot name="label">{{p_label}}</slot>
        </div>
        <div class="pl-form-item-content">
            <slot></slot>
        </div>
        <div class="pl-form-item-suffix" v-if="!!$slots.suffix">
            <slot name="suffix"></slot>
        </div>
    </div>
</template>

<script>
    import {EditMixin, PropsMixin, RefsMixinFactory} from "../../utils/mixins";

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
            PropsMixin({
                label: PropsMixin.Promise,
                labelWidth: PropsMixin.Number,
            })
        ],
        props: {
            field: {type: String},                                              // 绑定的属性字段名
            label: {type: String},                                              // 显示文本
            labelWidth: {type: [String, Number]},                               // 显示文本宽度
        },
        refs: {
            labelEl: null,
        },
        data() {
            return {}
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
                    return {width: `${this.plForm.targetLabelWidth + 10}px`}
                } else if (!!this.p_labelWidth) {
                    return {width: `${this.p_labelWidth}px`}
                }
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

        },
    }
</script>

<style lang="scss">
</style>