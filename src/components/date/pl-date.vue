<template>
    <pl-input
            ref="plInput"
            :class="inputBinding.class"
            v-bind="inputBinding.props"
            v-on="inputBinding.on">
        <div class="pl-input-custom-inner" :range="range">
            <template v-if="panel === 'dates'">
                <pl-input-inner-tags :data="formatData.datesString||[]" :collapseTags="collapseTags">
                    <template slot-scope="{item,index}">
                        <span>{{item}}</span>
                        <pl-icon icon="el-icon-close" @click.native.stop.prevent="onClickItemCloseIcon(item,index)"/>
                    </template>
                </pl-input-inner-tags>
            </template>
            <template v-else-if="!range">
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

<script lang="ts">
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
            collapseTags: {type: Boolean, default: true},
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
                props: {
                    ...(Object.keys(Panel.props).reduce((ret, key) => {
                        ret[key] = this[key]
                        return ret
                    }, {})),
                    value: this.p_value,
                    start: this.p_start,
                    end: this.p_end,
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
                    'mousedown-panel': async (e, type) => {
                        this.focusCounter++
                        await this.$plain.utils.delay(0)

                        if (this.panel === 'dates') {
                            this.plInput.focus()
                        } else if (!this.range) {
                            this.valueInput.focus()
                        } else {
                            if (type === 'start') {
                                this.startInput.focus()
                            } else {
                                this.endInput.focus()
                            }
                        }
                    },
                }
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

                if (this.panel === 'dates') {
                    let value = this.p_value || []
                    value = value.map(item => new PlainDate(item, displayFormat, valueFormat))
                    const datesString = value.map(item => item.displayString)
                    return {
                        value,
                        datesString,
                    }
                }

                const value = new PlainDate(this.p_value, displayFormat, valueFormat)
                const start = new PlainDate(this.p_start, displayFormat, valueFormat)
                const end = new PlainDate(this.p_end, displayFormat, valueFormat)

                return {
                    value, start, end
                }
            },
            inputBinding() {
                const {panel} = this
                const isDates = panel === 'dates'
                return {
                    class: [
                        'pl-date',
                        {
                            'pl-input-custom': !isDates,
                            'pl-input-tags': isDates,
                        },
                    ],
                    props: {
                        value: this.inputValue,
                        suffixIcon: 'el-icon-date',
                        clearIcon: true,
                        isFocus: this.focusCounter > 0,
                        width: isDates ? undefined : null,
                        inputInnerTabindex: isDates ? 0 : null,
                        clearHandler: this.clearHandler,
                    },
                    on: {
                        'click-input': this.onClickInput,
                        focus: this.onCustomInnerInputFocus,
                        blur: this.onCustomInnerInputBlur,
                    },
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
                const {value, start, end} = this.formatData as { value: PlainDate, start: PlainDate, end: PlainDate }

                if (this.panel === 'dates') {
                    this.p_value = val
                    this.emitInput(this.p_value)
                }

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

                        if (end.isNull || (!!this.datetime ? start.YMDHms > end.YMDHms : start.YMD > end.YMD)) {
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

                        if (start.isNull || (!!this.datetime ? start.YMDHms > end.YMDHms : start.YMD > end.YMD)) {
                            this.p_start = this.p_end
                            this.emitUpdateStart(this.p_end)
                        }

                        break
                }
            },
            onClickItemCloseIcon(item, index) {
                if (!this.isEditable) {
                    return
                }
                this.p_value.splice(index, 1)
                this.p_value = [...this.p_value]
                this.emitInput(this.p_value)
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
        }
    }
</style>