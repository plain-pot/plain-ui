<template>
    <div class="pl-radio-group">
        <slot></slot>
    </div>
</template>

<script>
    import {EditMixin, EmitMixin, PropsMixinFactory, StyleMixin} from "../../utils/mixins";

    export default {
        name: "pl-radio-group",
        mixins: [
            EditMixin,
            EmitMixin,
            StyleMixin,
            PropsMixinFactory({
                itemWidth: PropsMixinFactory.Number,
            })
        ],
        provide() {
            return {
                plRadioGroup: this,
            }
        },
        emitters: {
            emitInput: null,
        },
        props: {
            value: {},
            itemWidth: {type: [String, Number]},                       // 文本宽度
            status: {type: String, default: 'primary'},                 // primary,success,warn,error,info
        },
        watch: {
            value(val) {
                this.p_value = val
            },
        },
        data() {
            return {
                p_value: this.value,
            }
        },
        methods: {
            onClickRadio(radio) {
                this.p_value = radio.val
                this.emitInput(this.p_value)
            },
            /**
             * 判断 checkbox是否选中
             * @author  韦胜健
             * @date    2020/3/4 18:50
             */
            isChecked(val) {
                return this.p_value === val
            },
        },
    }
</script>

<style lang="scss">
</style>