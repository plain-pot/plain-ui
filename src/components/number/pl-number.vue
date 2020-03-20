<template>
    <pl-input class="pl-number" :isFocus="isFocus" ref="input" :inputInnerTabindex="null">
        <div class="pl-number-prepend-button" @mousedown="intervalMinus">
            <pl-icon icon="el-icon-minus"/>
        </div>
        <input type="text"
               :value="p_value"
               @focus="onFocus"
               @blur="onBlur"
               @input="onInput"
               ref="innerInput">
        <div class="pl-number-append-button" @mousedown="intervalAdd">
            <pl-icon icon="el-icon-plus"/>
        </div>
    </pl-input>
</template>

<script lang="ts">
    import {EditMixin, EmitMixin, PropsMixinFactory, RefsMixinFactory, StyleMixin} from "../../utils/mixins";

    const NAN = 'NAN';

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
            step: {type: [String, Number], default: 1},                 // 计数器步长
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
                p_value: this.value,                                    // model 绑定缓存值
                interval: null,
                clearInterval: () => {
                    clearInterval(this.interval)
                    window.removeEventListener('mouseup', this.clearInterval)
                },
            }
        },
        computed: {
            formatPValue(): null | number | 'NAN' {
                return this.getValue(this.p_value)
            },
            formatValue(): null | number | 'NAN' {
                return this.getValue(this.value)
            },
        },
        methods: {
            /*---------------------------------------methods-------------------------------------------*/
            add() {
                let value = this.getEffectiveValue()
                if (value == null) {
                    value = 0
                }
                value += this.step
                value = this.checkValue(value)
                this.p_value = value
                this.emitInput(this.p_value)
            },
            minus() {
                let value = this.getEffectiveValue()
                if (value == null) {
                    value = 0
                }
                value -= this.step
                value = this.checkValue(value)
                this.p_value = value
                this.emitInput(this.p_value)
            },
            /*---------------------------------------utils-------------------------------------------*/
            getValue(value: any): null | number | 'NAN' {
                if (value == null) return null
                value = String(value).trim()
                if (value === '') return null
                value = Number(value)
                if (isNaN(value)) {
                    return NAN
                } else {
                    return value
                }
            },
            getEffectiveValue(): number | null {
                let value = this.formatPValue
                if (value === NAN) {
                    value = this.formatValue
                    if (value === NAN) {
                        if (this.p_min != null) return this.p_min
                        else if (this.p_max != null) return this.p_max
                        else if (this.stepStrictly) return this.p_step
                        else return 0
                    }
                }
                return value
            },
            checkValue(value: number | null): number | null {
                if (value != null) {
                    // min
                    if (this.p_min != null && value < this.p_min) {
                        value = this.p_min
                    }
                    // max
                    if (this.p_max != null && value > this.p_max) {
                        value = this.p_max
                    }
                    // stepStrictly
                    if (this.stepStrictly && value % this.step !== 0) {
                        value = this.value
                    }
                    // precision
                    if (this.p_precision != null) {
                        value = Number(value.toFixed(this.p_precision))
                    }
                }
                return value
            },
            /*---------------------------------------listener-------------------------------------------*/
            onFocus(e) {
                this.isFocus = true
                this.emitFocus(e)
            },
            onBlur(e) {
                this.p_value = this.checkValue(this.getEffectiveValue())
                this.isFocus = false
                this.emitInput(this.p_value)
                this.emitBlur(e)
            },
            onInput(e) {
                this.p_value = e.target.value
            },
            intervalAdd() {
                this.add()
                this.interval = setInterval(() => this.add(), 100)
                window.addEventListener('mouseup', this.clearInterval)
            },
            intervalMinus() {
                this.minus()
                this.interval = setInterval(() => this.minus(), 100)
                window.addEventListener('mouseup', this.clearInterval)
            },
        },
    }
</script>

<style lang="scss">

</style>