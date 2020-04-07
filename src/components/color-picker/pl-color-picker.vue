<template>
    <pl-input class="pl-color-picker"
              :value="p_inputValue"
              :suffixIcon="suffixIcon"

              @change="onInputChange"
              @click-input="onClickInput"
              @keydown.enter="onEnter"
              @keydown.esc="onEsc"
              @blur="onBlur"
              @focus="onFocus"
    />
</template>

<script>
    import {EditMixin, EmitMixin} from "../../utils/mixins";
    import {isEffectiveColorString} from "./ColorUtils";

    const opacityBg = require('./sub/opacity.png')

    export default {
        name: "pl-color-picker",
        mixins: [
            EmitMixin,
            EditMixin,
        ],
        props: {
            value: {type: String},                                  // 当前颜色值
            enableAlpha: {type: Boolean, default: true},            // 是否启用透明度
            format: {type: String, default: 'rgb'},                 // 颜色格式
        },
        emitters: {
            emitInput: Function,
        },
        data() {
            return {
                p_value: this.value,
                p_inputValue: this.value,

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
                        },
                    }
                }
            }
        },
        methods: {
            /*---------------------------------------methods-------------------------------------------*/
            async show() {
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
            async onClickInput() {
                if (!this.isEditable) {
                    return
                }
                this.toggle()
            },
            onInputChange(val) {
                this.p_inputValue = val
                if (isEffectiveColorString(val)) {
                    this.emitValue(val)
                }
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
                // this.hide()
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