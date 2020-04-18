<template>
    <pl-input
            class="pl-date"
            :class="{'pl-date-range':range}"
            :value="inputValue"
            suffixIcon="el-icon-date"
            clearIcon
            :isFocus="focusCounter>0"
            :width="null"
            :inputInnerTabindex="null"
            :clearHandler="clearHandler"
            @click-input="onClickInput"
    >
        <div class="pl-date-inner">
        </div>
    </pl-input>
</template>

<script>
    import {AgentMixin} from "../service/service";
    import {EditMixin, EmitMixin, RefsMixinFactory} from "../../utils/mixins";
    import {TimePublicProps} from "../time/subs";
    import {DefaultFormatString} from "./subs";
    import {PlainDate} from "../../utils/PlainDate";

    export default {
        name: "pl-date",
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
            panel: {type: String, default: 'date'},
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

            const {value: p_value, start: p_start, end: p_end} = this
            const serviceOption = () => ({
                props: (Object.keys(TimePublicProps).reduce((ret, key) => {
                    ret[key] = this[key]
                    return ret
                }, {})),
                popperProps: {
                    reference: this.$el,
                },
                listener: (val) => {
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
            inputValue() {
                return !this.range ? this.p_value : ((this.p_start || '') + (this.p_end || ''))
            },
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