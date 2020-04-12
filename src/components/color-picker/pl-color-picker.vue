<template>
    <pl-input ref="input"
              class="pl-color-picker"
              :value="p_inputValue"
              :suffixIcon="suffixIcon"
              :isFocus="isOpen"

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
    import {AgentMixin} from "../service/service";

    const opacityBg = require('./sub/opacity.png')

    export default {
        name: "pl-color-picker",
        mixins: [
            AgentMixin,
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

                service: null,
                serviceOption: () => {
                    return {
                        props: {
                            value: this.p_value,
                            enableAlpha: this.enableAlpha,
                            format: this.format,
                        },
                        popperProps: {
                            reference: this.$el,
                        },
                        listener: {
                            change: (val) => {
                                this.p_inputValue = val
                                this.emitValue(val)
                            },
                        },
                        popperListener: {
                            'mousedown-popper': async () => {
                                this.p_focusTimer++
                                this.p_blurTimer++
                            },
                            'click-popper': () => {
                                this.input.focus()
                            },
                        },
                    }
                }
            }
        },
        methods: {
            /*---------------------------------------utils-------------------------------------------*/
            CreateService(option) {
                return this.$plain.$cs(option)
            },
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
            onEnter() {
                if (!!this.p_inputValue && this.p_inputValue !== this.p_value) {
                    this.$plain.$message('请输入有效的颜色值')
                    this.p_inputValue = this.p_value
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