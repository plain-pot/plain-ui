import {TimePublicProps} from "./index";
import {EmitMixin} from "../../../utils/mixins";
import {PlainDate} from "../../../utils/PlainDate";

export default {
    name: 'pl-time-range-panel',
    mixins: [
        EmitMixin,
    ],
    emitters: {
        emitUpdateStart: Function,
        emitUpdateEnd: Function,
        emitInput: Function,
    },
    props: {
        start: {type: String},
        end: {type: String},
        ...TimePublicProps,
    },
    watch: {
        start(val) {
            this.p_start = val
        },
        end(val) {
            this.p_end = val
        },
    },
    data() {
        return {
            p_start: this.start,
            p_end: this.end,
        }
    },
    render(h) {
        const {start, end} = this.binding
        return (
            <div class="pl-time-range-panel">
                <pl-time-base-panel {...start}/>
                <pl-time-base-panel {...end}/>
            </div>
        )
    },
    computed: {
        formatData() {
            let {p_start: start, p_end: end, max, min, displayFormat, valueFormat} = this
            start = new PlainDate(start, displayFormat, valueFormat)
            end = new PlainDate(end, displayFormat, valueFormat)
            max = new PlainDate(max, displayFormat, valueFormat)
            min = new PlainDate(min, displayFormat, valueFormat)

            return {
                start, end, max, min
            }
        },
        binding() {
            const publicProps = Object.keys(TimePublicProps).reduce((ret, key) => {
                ret[key] = this.key
                return ret
            }, {})

            const {start, end, max, min} = this.formatData as { start: PlainDate, end: PlainDate, max: PlainDate, min: PlainDate }

            let startMax = null, startMin = min.valueString, endMax = max.valueString, endMin = null

            if (!end.isNull && !max.isNull) {
                startMax = end.lessThan(max, PlainDate.CompareMode.time) > 0 ? end.valueString : max.valueString
            } else {
                if (!end.isNull) {
                    startMax = end.valueString
                }
                if (!max.isNull) {
                    startMax = max.valueString
                }
            }

            if (!start.isNull && !min.isNull) {
                endMin = start.greaterThan(min, PlainDate.CompareMode.time) > 0 ? start.valueString : min.valueString
            } else {
                if (!start.isNull) {
                    endMin = start.valueString
                }
                if (!min.isNull) {
                    endMin = min.valueString
                }
            }

            const startBinding = {
                props: {
                    value: this.p_start,
                    ...publicProps,
                    max: startMax,
                    min: startMin,
                },
                on: {
                    change: (value) => {
                        this.p_start = value
                        this.emitUpdateStart(value)
                        this.emitInput(value, 'start')

                        if (end.isNull) {
                            this.p_end = value
                            this.emitUpdateEnd(value)
                            this.emitInput(value, 'end')
                        }
                    }
                }
            }

            const endBinding = {
                props: {
                    value: this.p_end,
                    ...publicProps,
                    max: endMax,
                    min: endMin,
                },
                on: {
                    change: (value) => {
                        this.p_end = value
                        this.emitUpdateEnd(value)
                        this.emitInput(value, 'end')

                        if (end.isNull) {
                            this.p_start = value
                            this.emitUpdateStart(value)
                            this.emitInput(value, 'start')
                        }
                    }
                }
            }

            return {
                start: startBinding,
                end: endBinding,
            }
        },
    },
}