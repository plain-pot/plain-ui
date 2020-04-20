<template>
    <pl-input class="pl-time pl-input-custom"
              :value="inputValue"
              suffixIcon="el-icon-time"
              clearIcon
              :isFocus="focusCounter>0"
              :width="null"
              :inputInnerTabindex="null"

              :clearHandler="clearHandler"
              @click-input="onClickInput"
              @keydown.enter="onEnter"
              @keydown.esc="onEsc">
        <div class="pl-input-custom-inner" :range="range">
            <template v-if="!range">
                <pl-datetime-input-inner :value="formatData.value.displayString"
                                         @change="val=>onInputChange(val,'value')"
                                         :displayFormat="displayFormat"
                                         ref="valueInput"
                                         @focus="onCustomInnerInputFocus"
                                         @blur="onCustomInnerInputBlur"
                />
            </template>
            <template v-else>
                <pl-datetime-input-inner width="100"
                                         :value="formatData.start.displayString"
                                         @change="val=>onInputChange(val,'start')"
                                         :displayFormat="displayFormat"
                                         ref="startInput"
                                         @focus="onCustomInnerInputFocus"
                                         @blur="onCustomInnerInputBlur"
                />
                <span>~</span>
                <pl-datetime-input-inner width="100"
                                         :value="formatData.end.displayString"
                                         @change="val=>onInputChange(val,'end')"
                                         :displayFormat="displayFormat"
                                         ref="endInput"
                                         @focus="onCustomInnerInputFocus"
                                         @blur="onCustomInnerInputBlur"
                />
            </template>
        </div>
    </pl-input>
</template>

<script lang="ts">
    import {TimePublicProps} from "./subs";
    import {PlainDate} from "../../utils/PlainDate";
    import DatetimeMixin from "./DatetimeMixin";

    export default {
        name: "pl-time",
        mixins:[
            DatetimeMixin
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
                    'mousedown-base-panel': async () => {
                        this.focusCounter++
                        await this.$plain.utils.delay(0)
                        this.valueInput.focus()
                    },
                    'mousedown-start-panel': async () => {
                        this.focusCounter++
                        await this.$plain.utils.delay(0)
                        this.startInput.focus()
                    },
                    'mousedown-end-panel': async () => {
                        this.focusCounter++
                        await this.$plain.utils.delay(0)
                        this.endInput.focus()
                    },
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
            onInputChange(val, type) {
                const {value, start, end} = this.formatData as { value: PlainDate, start: PlainDate, end: PlainDate }
                switch (type) {
                    case 'value':

                        if (!val) {
                            value.setValue(null)
                            this.p_value = null
                            this.emitInput(this.p_value)
                            return;
                        }
                        if (value.format(value.parseDisplayString(val)) != val) {
                            return;
                        }

                        value.setDisplayValue(val)
                        this.p_value = value.valueString
                        this.emitInput(this.p_value)

                        break
                    case 'start':

                        if (!val) {
                            return;
                        }
                        if (start.format(start.parseDisplayString(val)) != val) {
                            return;
                        }

                        start.setDisplayValue(val)
                        this.p_start = start.valueString
                        this.emitUpdateStart(this.p_start)

                        if (end.isNull || start.Hms > end.Hms) {
                            this.p_end = this.p_start
                            this.emitUpdateEnd(this.p_start)
                        }

                        break
                    case 'end':

                        if (!val) {
                            return;
                        }
                        if (end.format(end.parseDisplayString(val)) != val) {
                            return;
                        }

                        end.setDisplayValue(val)
                        this.p_end = end.valueString
                        this.emitUpdateEnd(this.p_end)

                        if (start.isNull || end.Hms < start.Hms) {
                            this.p_start = this.p_end
                            this.emitUpdateStart(this.p_end)
                        }

                        break
                }
            },
        },
    }
</script>

<style lang="scss">
    @include themify {
        .pl-time-base-panel {
            border: solid $ibc 1px;
            border-radius: $popperRadius;
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
            border-radius: $popperRadius;
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

                .pl-time-input-inner {
                    border: none;
                    outline: none;
                    width: 90px;
                    height: 100%;
                    background: transparent;
                }
            }

            &.pl-time-range {
                .pl-time-input-inner {
                    text-align: center;
                }
            }

            .pl-input-inner {
                width: auto !important;
            }
        }
    }
</style>