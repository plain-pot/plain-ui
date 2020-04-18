<template>
    <pl-input
            class="pl-date pl-input-custom"
            :value="inputValue"
            suffixIcon="el-icon-date"
            clearIcon
            :isFocus="focusCounter>0"
            :width="null"
            :inputInnerTabindex="null"
            :clearHandler="clearHandler"
            @click-input="onClickInput"
    >
        <div class="pl-input-custom-inner" :range="range">
            <template v-if="!range">
                <pl-datetime-input-inner :value="formatData.value.displayString"
                                         @change="val=>onInputChange(val,'value')"
                                         :displayFormat="formatString.displayFormat"
                                         ref="valueInput"
                                         @focus="onCustomInnerInputFocus"
                                         @blur="onCustomInnerInputBlur"
                />
            </template>
            <template v-else>
                <pl-datetime-input-inner width="100"
                                         :value="formatData.start.displayString"
                                         @change="val=>onInputChange(val,'start')"
                                         :displayFormat="formatString.displayFormat"
                                         ref="startInput"
                                         @focus="onCustomInnerInputFocus"
                                         @blur="onCustomInnerInputBlur"
                />
                <span>~</span>
                <pl-datetime-input-inner width="100"
                                         :value="formatData.end.displayString"
                                         @change="val=>onInputChange(val,'end')"
                                         :displayFormat="formatString.displayFormat"
                                         ref="endInput"
                                         @focus="onCustomInnerInputFocus"
                                         @blur="onCustomInnerInputBlur"
                />
            </template>
        </div>
    </pl-input>
</template>

<script>
    import {TimePublicProps} from "../time/subs";
    import {DefaultFormatString} from "./subs";
    import {PlainDate} from "../../utils/PlainDate";
    import Panel from './pl-date-panel'
    import DatetimeMixin from "../time/DatetimeMixin";

    export default {
        name: "pl-date",
        mixins: [
            DatetimeMixin,
        ],
        props: {
            ...Panel.props,
            panel: {type: String, default: 'date'},
        },
        emitters: {
            emitInput: Function,
            emitBlur: Function,
            emitFocus: Function,
            emitUpdateStart: Function,
            emitUpdateEnd: Function,
        },

        data() {

            const {value: p_value, start: p_start, end: p_end} = this
            const serviceOption = () => ({
                props: (Object.keys(TimePublicProps).reduce((ret, key) => {
                    ret[key] = this[key]
                    return ret
                }, {})),
                popperProps: {
                    reference: this.$el,
                },
                listener: (val, type) => {
                    console.log(val)
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
            })

            return {
                p_value,
                p_start,
                p_end,
                serviceOption,
            }
        },
        computed: {
            formatString() {
                let {displayFormat, valueFormat} = this
                displayFormat = displayFormat || DefaultFormatString[this.panel]
                valueFormat = valueFormat || DefaultFormatString[this.panel]
                return {
                    displayFormat,
                    valueFormat,
                }
            },
            formatData() {
                const {displayFormat, valueFormat} = this.formatString
                const value = new PlainDate(this.p_value, displayFormat, valueFormat)
                const start = new PlainDate(this.p_start, displayFormat, valueFormat)
                const end = new PlainDate(this.p_end, displayFormat, valueFormat)

                return {
                    value, start, end
                }
            },
        },
        methods: {
            /*---------------------------------------utils-------------------------------------------*/
            CreateService(option) {
                return this.$plain.$date(option)
            },
            /*---------------------------------------handler-------------------------------------------*/
            onInputChange(val, type) {

            },
        },
    }
</script>

<style lang="scss">
    @include themify {
        .pl-date-service {
            .plain-popper-content {
                padding: 0 !important;

                & > .pl-date-base-panel {
                    border: none;
                }
            }
        }
        .pl-date {
            .pl-date-inner {
                display: flex;
                align-items: stretch;
                height: 100%;

                & > span {
                    color: $icc;
                }

                .pl-date-input-inner {
                    border: none;
                    outline: none;
                    width: 90px;
                    height: 100%;
                    background: transparent;
                }
            }

            &.pl-date-range {
                .pl-date-input-inner {
                    text-align: center;
                }
            }

            .pl-input-inner {
                width: auto !important;
            }
        }
    }
</style>