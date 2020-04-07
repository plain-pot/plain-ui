<template>
    <pl-input ref="input"
              class="pl-color-picker"
              :value="p_inputValue"
              :suffixIcon="suffixIcon"

              @click-input="onClickInput"
              @change="onInputChange"
              @keydown.enter="onEnter"
              @keydown.esc="onEsc"
              @blur="onBlur"
              @focus="onFocus"
    />
</template>

<script>
    import {EditMixin, EmitMixin, RefsMixinFactory} from "../../utils/mixins";
    import {isEffectiveColorString} from "./ColorUtils";

    const opacityBg = require('./sub/opacity.png')

    export default {
        name: "pl-color-picker",
        mixins: [
            EmitMixin,
            EditMixin,
            RefsMixinFactory({
                input: Object
            }),
        ],
        props: {
            value: {type: String},                                  // 当前颜色值
            enableAlpha: {type: Boolean, default: true},            // 是否启用透明度
            format: {type: String, default: 'hex'},                 // 颜色格式
        },
        emitters: {
            emitInput: Function,
            emitBlur: Function,
            emitFocus: Function,
        },
        data() {
            return {
                p_value: this.value,
                p_inputValue: this.value,

                p_focusTimer: 0,
                p_blurTimer: 0,

                colorService: null,
                colorOption: () => {
                    return {
                        value: this.p_value,
                        reference: this.$el,
                        enableAlpha: this.enableAlpha,
                        format: this.format,
                        on: {
                            change: (val) => {
                                this.p_inputValue = val
                                this.emitValue(val)
                            },
                            mousedownPopper: async () => {
                                this.p_focusTimer++
                                this.p_blurTimer++
                                this.input.focus()
                            },
                            clickPopper: () => {
                                this.input.focus()
                            },
                        },
                    }
                }
            }
        },
        methods: {
            /*---------------------------------------methods-------------------------------------------*/
            async show() {
                if (!this.isEditable) {
                    return
                }

                if (!this.colorService) {
                    this.colorService = await this.$plain.$cs(this.colorOption)
                }
                this.colorService.show()
            },
            async hide() {
                if (!this.colorService) {
                    return
                }
                this.colorService.hide()
            },
            async toggle() {
                if (!this.colorService) {
                    this.show()
                } else {
                    this.colorService.toggle()
                }
            },
            /*---------------------------------------utils-------------------------------------------*/
            suffixIcon(h) {
                return (
                    <div class="pl-color-picker-suffix" style={{backgroundImage: `url(${opacityBg})`}}>
                        <div class="pl-color-picker-suffix-inner" style={{backgroundColor: this.p_value}}></div>
                    </div>
                )
            },
            emitValue(val) {
                this.p_value = val
                this.emitInput(val)
            },

            /*---------------------------------------handler-------------------------------------------*/
            onInputChange(val) {
                this.p_inputValue = val
                if (isEffectiveColorString(val)) {
                    this.emitValue(val)
                }
            },
            onClickInput() {
                this.toggle()
            },
            onEnter() {
                if (!!this.p_inputValue && this.p_inputValue !== this.p_value) {
                    this.$plain.$message('请输入有效的颜色值')
                    this.p_inputValue = this.p_value
                }
            },
            onEsc() {
                this.hide()
            },
            onBlur() {
                if (this.p_blurTimer === 0) {
                    this.hide()
                    this.emitBlur()
                } else {
                    this.p_blurTimer--
                }
            },
            onFocus() {
                if (this.p_focusTimer === 0) {
                    this.emitFocus()
                } else {
                    this.p_focusTimer--
                }
            },
        },
    }
</script>

<style lang="scss">
    @include themify {
        .pl-color-picker {
            .pl-color-picker-suffix {
                border-radius: 2px;

                .pl-color-picker-suffix-inner {
                    /*background-color: rgba(0, 0, 0, 0.5);*/
                    border-radius: 2px;
                    height: 100%;
                    width: 100%;

                }
            }

            @include sizeMixin(input) {
                .pl-color-picker-suffix {
                    height: $value/2;
                    width: $value/2;
                    background-size: $value/4, $value/4;
                }
            }

        }
    }
</style>