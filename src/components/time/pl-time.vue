<template>
    <pl-input class="pl-time"
              :class="{'pl-time-range':range}"
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
        <div class="pl-time-inner">
            <template v-if="!range">
                <pl-time-input-inner :value="formatData.value.displayString"
                                     @change="val=>onInputChange(val,'value')"
                                     :displayFormat="displayFormat"
                                     ref="valueInput"
                                     @focus="onTimeInputInnerFocus"
                                     @blur="onTimeInputInnerBlur"
                />
            </template>
            <template v-else>
                <pl-time-input-inner width="100"
                                     :value="formatData.start.displayString"
                                     @change="val=>onInputChange(val,'start')"
                                     :displayFormat="displayFormat"
                                     ref="startInput"
                                     @focus="onTimeInputInnerFocus"
                                     @blur="onTimeInputInnerBlur"
                />
                <span>至</span>
                <pl-time-input-inner width="100"
                                     :value="formatData.end.displayString"
                                     @change="val=>onInputChange(val,'end')"
                                     :displayFormat="displayFormat"
                                     ref="endInput"
                                     @focus="onTimeInputInnerFocus"
                                     @blur="onTimeInputInnerBlur"
                />
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
                valueInput: Object,
                startInput: Object,
                endInput: Object,
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
        watch: {
            value(val) {
                this.p_value = val
            },
            start(val) {
                this.p_start = val
            },
            end(val) {
                this.p_end = val
            },
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
            inputValue() {
                return !this.range ? this.p_value : ((this.p_start || '') + (this.p_end || ''))
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

                        if (end.isNull || start.greaterThan(end, PlainDate.CompareMode.time) > 0) {
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

                        if (start.isNull || end.lessThan(start, PlainDate.CompareMode.time) > 0) {
                            this.p_start = this.p_end
                            this.emitUpdateStart(this.p_end)
                        }

                        break
                }
            },
            onTimeInputInnerFocus(e) {
                this.onFocus(e)
            },
            async onTimeInputInnerBlur(e) {
                if (!this.range) {
                    this.onBlur(e)
                } else {
                    await this.$plain.utils.delay(0)
                    if ([
                        this.startInput.$el,
                        this.endInput.$el,
                    ].indexOf(document.activeElement) === -1) {
                        this.focusCounter--
                        if (this.focusCounter === 0) {
                            this.emitBlur()
                            this.hide()
                        }
                    }
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
                width: initial !important;
            }
        }

        .pl-form-item-content {
            .pl-time-inner {
                display: flex;
                align-items: center;

                .pl-time-input-inner {
                    flex: 1;
                }
            }
        }
    }
</style>