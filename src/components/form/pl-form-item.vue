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
    import {PropsMixin, RefsMixin, RefsMixinFactory} from "../../utils/mixins";

    export default {
        name: "pl-form-item",
        inject: {
            plForm: {}
        },
        mixins: [
            RefsMixinFactory({
                labelEl: null,
            }),
            PropsMixin({
                label: {type: String, check: PropsMixin.Promise},
                labelWidth: {type: [String, Number], check: PropsMixin.Number},
            })
        ],
        props: {},
        refs: {
            labelEl: null,
        },
        data() {
            return {}
        },
        computed: {
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