<template>
    <pl-input ref="input"
              class="pl-time"
              :value="inputValue"
              suffixIcon="el-icon-time"
              clearIcon
              :isFocus="isOpen"
              :width="null"

              :clearHandler="clearHandler"
              @click-input="onClickInput"
              @keydown.enter="onEnter"
              @keydown.esc="onEsc"
              @blur="onBlur"
              @focus="onFocus"
    >
        <div class="pl-time-inner">
            <template v-if="!range">
                <pl-time-input-inner :value="formatData.value.displayString"/>
            </template>
            <template v-else>
                <pl-time-input-inner width="100" :value="formatData.start.displayString"/>
                <span>至</span>
                <pl-time-input-inner width="100" :value="formatData.end.displayString"/>
            </template>
        </div>
    </pl-input>
</template>

<script lang="ts">
    import {EditMixin, EmitMixin, RefsMixinFactory} from "../../utils/mixins";
    import {TimePublicProps} from "./subs";
    import {Agent, AgentMixin} from "../service/service";
    import PlTimeInputInner from "./pl-time-input-inner.vue";
    import {PlainDate} from "../../utils/PlainDate";

    export default {
        name: "pl-time",
        components: {PlTimeInputInner},
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
            const serviceOption = () => ({
                props: {
                    value: this.p_value,
                    start: this.p_start,
                    end: this.p_end,
                    range: this.range,
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
                            this.emitInput(val)
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
                    'hide': () => {

                    },
                },
            })

            return {
                p_value,
                p_start,
                p_end,
                p_inputValue,
                serviceOption,
            }
        },
        computed: {
            inputValue() {
                return !this.range ? this.p_value : ((this.p_start || '') || (this.p_end || ''))
            },
            formatData() {
                const value = new PlainDate(this.p_value, this.displayFormat, this.valueFormat)
                const start = new PlainDate(this.p_start, this.displayFormat, this.valueFormat)
                const end = new PlainDate(this.p_end, this.displayFormat, this.valueFormat)

                return {
                    value, start, end
                }
            },
        },
        methods: {
            /*---------------------------------------utils-------------------------------------------*/
            CreateService(option) {
                return this.$plain.$time(option)
            },
            /*---------------------------------------handler-------------------------------------------*/
            clearHandler() {
                if (!this.range) {
                    this.p_value = null
                    this.emitInput(this.p_value)
                } else {
                    this.p_start = null
                    this.p_end = null
                    this.emitUpdateStart(this.p_start)
                    this.emitUpdateEnd(this.p_end)
                }
            },
            onClickInput() {
                if (!this.range) {
                    this.toggle()
                } else {
                    this.show()
                }
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


        .pl-time {
            .pl-time-inner {
                display: flex;
                align-items: stretch;
                height: 100%;

                & > span {
                    color: $icc;
                }
            }

            .pl-input-inner {
                width: initial !important;
            }
        }
    }
</style>