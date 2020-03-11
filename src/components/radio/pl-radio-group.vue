<template>
    <div class="pl-radio-group">
        <slot></slot>
    </div>
</template>

<script>
    import {EditMixin, EmitMixin, PropsMixin} from "../../utils/mixins";

    export default {
        name: "pl-radio-group",
        mixins: [
            EditMixin,
            EmitMixin,
            PropsMixin({
                labelWidth: PropsMixin.Number,
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
            labelWidth: {type: [String, Number]},                       // 文本宽度
            status: {type: String, default: 'primary'},                 // primary,success,warn,error,info
            size: {type: String, default: 'default'},                   // large,default,small
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