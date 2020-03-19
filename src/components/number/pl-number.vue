<template>
    <pl-input class="pl-number" :isFocus="isFocus" ref="input" :inputInnerTabindex="null">
        <div class="pl-number-prepend-button">
            <pl-icon icon="el-icon-minus"/>
        </div>
        <input type="text"
               :value="p_value"
               @focus="onFocus"
               @blur="onBlur"
               @input="onInput"
               ref="innerInput">
        <div class="pl-number-append-button">
            <pl-icon icon="el-icon-plus"/>
        </div>
    </pl-input>
</template>

<script lang="ts">
    import {EditMixin, EmitMixin, PropsMixinFactory, RefsMixinFactory, StyleMixin} from "../../utils/mixins";

    export default {
        name: "pl-number",
        mixins: [
            StyleMixin,
            EditMixin,
            EmitMixin,
            PropsMixinFactory.create({
                min: PropsMixinFactory.Number,
                max: PropsMixinFactory.Number,
                step: PropsMixinFactory.Number,
                precision: PropsMixinFactory.Number,
            }),
            RefsMixinFactory({
                innerInput: Object,
                input: Object
            })
        ],
        emitters: {
            emitFocus: Function,
            emitBlur: Function,
            emitInput: Function,
        },
        props: {
            value: {type: [String, Object]},                            // 双向绑定值
            min: {type: [String, Number]},                              // 最小值
            max: {type: [String, Number]},                              // 最大值
            step: {type: [String, Number]},                             // 计数器步长
            stepStrictly: {type: Boolean},                              // 是否只能输入 step 的倍数
            precision: {type: Number},                                  // 数值精度
            hideButton: {type: Boolean},                                // 隐藏操作按钮
            inputProps: {type: Object},                                 // pl-input属性配置对象
        },
        watch: {
            value(val) {
                this.p_value = val
            },
        },
        data() {
            return {
                isFocus: false,                                         // 当前input是否获取焦点
                p_value: this.value,
            }
        },
        methods: {
            onFocus(e) {
                this.isFocus = true
                this.emitFocus(e)
            },
            onBlur(e) {
                this.isFocus = false
                this.emitBlur(e)
            },
            onInput(e) {
                this.p_value = e.target.value
                this.emitInput(this.p_value)
            },
        },
    }
</script>

<style lang="scss">

</style>