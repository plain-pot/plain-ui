<template>
    <pl-input ref="input"
              class="pl-time"
              :value="p_inputValue"
              suffixIcon="'el-icon-time'"
              clearIcon
              :isFocus="isOpen"

              :clearHandler="clearHandler"
              @click-input="onClickInput"
              @change="onInputChange"
              @keydown.enter="onEnter"
              @keydown.esc="onEsc"
              @blur="onBlur"
              @focus="onFocus"
    />
</template>

<script lang="ts">
    import {EditMixin, EmitMixin, RefsMixinFactory} from "../../utils/mixins";
    import {TimePublicProps} from "./subs";
    import {Agent, AgentMixin} from "../service/service";

    export default {
        name: "pl-time",
        mixins: [
            AgentMixin,
            EmitMixin,
            EditMixin,
            RefsMixinFactory({
                input: Object
            }),
        ],
        props: {
            value: {type: String},
            start: {type: String},
            end: {type: String},
            range: {type: Boolean},
            ...TimePublicProps,
        },
        emitters: {
            emitInput: Function,
            emitBlur: Function,
            emitFocus: Function,
            emitUpdateStart: Function,
            emitUpdateEnd: Function,
        },
        data() {

            const p_value: string = this.value
            const p_start: string = this.start
            const p_end: string = this.end

            const p_inputValue = p_value
            const p_focusTimer: number = 0
            const p_blurTimer: number = 0

            const service: Agent = null
            const serviceOption = () => ({
                props: {
                    value: this.p_value,
                    start: this.p_start,
                    end: this.p_end,
                    range: this.p_range,
                    ...(Object.keys(TimePublicProps).reduce((ret, key) => {
                        ret[key] = this[key]
                        return ret
                    }, {}))
                },
                popperProps: {
                    reference: this.$el,
                },
                listener: {
                    change: (val, type) => {
                        /*this.p_inputValue = val
                        this.emitValue(val)*/
                        if (!this.range) {
                            this.p_value = val
                        } else {
                            if (type === 'start') {
                                this.p_start = val
                                this.emitUpdateStart(val)
                            } else {
                                this.p_end = val
                                this.emitUpdateEnd(val)
                            }
                        }
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
            })

            return {
                p_start,
                p_end,
                p_inputValue,
                p_focusTimer,
                p_blurTimer,
                service,
                serviceOption,
            }
        },
        beforeDestroy() {
            if (!!this.service) this.service.destroy()
        },
        computed: {
            isOpen() {
                if (!this.service) return false
                return this.service.isOpen
            },
            isShow() {
                if (!this.service) return false
                return this.service.isShow
            },
        },
        methods: {
            async show() {
                if (!this.isEditable) {
                    return
                }

                if (!this.service) {
                    this.service = await this.$plain.$time(this.serviceOption)
                }
                this.service.show()
            },
            async hide() {
                if (!this.service) {
                    return
                }
                this.service.hide()
            },
            async toggle() {
                if (!this.isShow) {
                    this.show()
                } else {
                    this.hide()
                }
            },

            /*---------------------------------------handler-------------------------------------------*/
            onClickInput() {
                this.toggle()
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
            clearHandler(){

            },
        },
    }
</script>

<style lang="scss">
    @include themify {
        .pl-time-base-panel {
            border: solid $ibc 1px;
            border-radius: 4px;
            display: inline-block;
            position: relative;
            color: $itc;

            $item_height: 24px;

            &:before {
                position: absolute;
                top: $item_height*3;
                left: 0;
                right: 0;
                height: 1px;
                background-color: rgba($ibc, 0.5);
                content: '';
                pointer-events: none;
            }

            &:after {
                position: absolute;
                bottom: $item_height*3 + 3;
                left: 0;
                right: 0;
                height: 1px;
                background-color: rgba($ibc, 0.5);
                content: '';
                pointer-events: none;
            }

            .pl-time-base-column {
                border: none;

                & + .pl-time-base-column {
                    border-left: dashed 1px $ibc;
                }
            }
        }

        .pl-time-range-panel {
            border: solid $ibc 1px;
            border-radius: 4px;
            display: inline-block;

            .pl-time-base-panel {
                border: none;

                &:first-child {
                    border-right: solid 1px $ibc;
                    border-radius: 0;
                }
            }
        }

        .pl-time-service-popper {
            .plain-popper-content {
                padding: 0 !important;

                & > .pl-time-base-panel, & > .pl-time-range-panel {
                    border: none;
                }
            }
        }
    }
</style>