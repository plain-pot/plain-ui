<template>
    <pl-input class="pl-number"
              :class="classes"
              :isFocus="isFocus"
              ref="input"
              :inputInnerTabindex="null"
              v-bind="inputProps">
        <div class="pl-number-prepend-button plain-click-node" @mousedown="intervalMinus" v-if="!hideButton" v-click-wave>
            <pl-icon icon="el-icon-minus"/>
        </div>
        <input type="text"
               :value="p_value"
               :disabled="isDisabled"
               :readonly="isReadonly"
               @focus="onFocus"
               @blur="onBlur"
               @input="onInput"
               @keydown.up.prevent="add"
               @keydown.down.prevent="minus"
               @keyup.enter="onEnter"
               ref="innerInput">
        <div class="pl-number-append-button plain-click-node" @mousedown="intervalAdd" v-if="!hideButton" v-click-wave>
            <pl-icon icon="el-icon-plus"/>
        </div>
    </pl-input>
</template>

<script lang="ts">
    import {EditMixin, EmitMixin, PropsMixinFactory, RefsMixinFactory, StyleMixin} from "../../utils/mixins";
    import ClickWave from "../../directives/ClickWave";

    const NAN = 'NAN';

    export default {
        name: "pl-number",
        directives:{ClickWave},
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
            emitEnter: Function,
        },
        props: {
            value: {type: [String, Object]},                            // 双向绑定值
            min: {type: [String, Number]},                              // 最小值
            max: {type: [String, Number]},                              // 最大值
            step: {type: [String, Number], default: 1},                 // 计数器步长
            stepStrictly: {type: Boolean},                              // 是否只能输入 step 的倍数
            precision: {type: Number},                                  // 数值精度
            hideButton: {type: Boolean},                                // 隐藏操作按钮

            /*---------------------------------------input-------------------------------------------*/
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
            /**
             * 根节点样式
             * @author  韦胜健
             * @date    2020/3/20 10:36
             */
            classes() {
                return {
                    'pl-number-hide-button': this.hideButton,
                    'pl-number-disabled': this.isDisabled,
                }
            },
            /**
             * 格式化 this.p_value
             * @author  韦胜健
             * @date    2020/3/20 10:32
             */
            formatPValue(): null | number | 'NAN' {
                return this.getValue(this.p_value)
            },
            /**
             * 格式化 this.value
             * @author  韦胜健
             * @date    2020/3/20 10:32
             */
            formatValue(): null | number | 'NAN' {
                return this.getValue(this.value)
            },
        },
        methods: {
            /*---------------------------------------methods-------------------------------------------*/
            /**
             * 计步器增加
             * @author  韦胜健
             * @date    2020/3/20 10:33
             */
            add() {
                if (!this.isEditable) return
                let value = this.getEffectiveValue()
                if (value == null) {
                    value = 0
                }
                value += this.p_step
                value = this.checkValue(value)
                this.p_value = value
                this.emitInput(this.p_value)
            },
            /**
             * 计步器减少
             * @author  韦胜健
             * @date    2020/3/20 10:33
             */
            minus() {
                if (!this.isEditable) return
                let value = this.getEffectiveValue()
                if (value == null) {
                    value = 0
                }
                value -= this.p_step
                value = this.checkValue(value)
                this.p_value = value
                this.emitInput(this.p_value)
            },
            /*---------------------------------------utils-------------------------------------------*/
            /**
             * 将任意值转化，得到 null、number或者 NAN字符串供判断
             * @author  韦胜健
             * @date    2020/3/20 10:33
             */
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
            /**
             * 根据当前 this.p_value 或者 props.value 获取当前有效值
             * @author  韦胜健
             * @date    2020/3/20 10:34
             */
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
            /**
             * 检查值是否符合约束
             * @author  韦胜健
             * @date    2020/3/20 10:34
             */
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
                    if (this.stepStrictly && value % this.p_step !== 0) {
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
            /**
             * input获取焦点事件
             * @author  韦胜健
             * @date    2020/3/20 10:34
             */
            onFocus(e): void {
                this.isFocus = true
                this.emitFocus(e)
            },
            /**
             * input失去焦点事件
             * @author  韦胜健
             * @date    2020/3/20 10:34
             */
            onBlur(e) {
                this.p_value = this.checkValue(this.getEffectiveValue())
                this.isFocus = false
                this.emitInput(this.p_value)
                this.emitBlur(e)
            },
            /**
             * 输入框输入文本事件
             * @author  韦胜健
             * @date    2020/3/20 10:35
             */
            onInput(e) {
                this.p_value = e.target.value
            },
            /**
             * 输入框enter按键事件
             * @author  韦胜健
             * @date    2020/3/20 11:25
             */
            onEnter(e) {
                this.p_value = this.checkValue(this.getEffectiveValue())
                this.emitInput(this.p_value)
                this.emitEnter(e)
            },
            /**
             * 点击计步器按钮，开启interval执行add
             * @author  韦胜健
             * @date    2020/3/20 10:35
             */
            intervalAdd() {
                this.add()
                this.interval = setInterval(() => this.add(), 100)
                window.addEventListener('mouseup', this.clearInterval)
            },
            /**
             * 点击计步器按钮，开启interval执行minus
             * @author  韦胜健
             * @date    2020/3/20 10:35
             */
            intervalMinus() {
                this.minus()
                this.interval = setInterval(() => this.minus(), 100)
                window.addEventListener('mouseup', this.clearInterval)
            },
            clearHandler() {
                this.p_value = null
                this.emitInput(this.p_value)
            },
        },
    }
</script>

<style lang="scss">

</style>