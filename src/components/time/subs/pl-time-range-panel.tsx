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

        emitMousedownStartPanel: Function,
        emitMousedownEndPanel: Function,
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
                ret[key] = this[key]
                return ret
            }, {})

            const {max, min} = this

            const startBinding = {
                props: {
                    value: this.p_start,
                    ...publicProps,
                    max,
                    min,
                },
                on: {
                    change: (value) => {
                        this.p_start = value
                        this.emitUpdateStart(value)
                        this.emitInput(value, 'start')

                        const {end, start} = this.formatData as { start: PlainDate, end: PlainDate }

                        if (end.isNull || start.greaterThan(end, PlainDate.CompareMode.time) > 0) {
                            this.p_end = this.p_start
                            this.emitUpdateEnd(this.p_start)
                            this.emitInput(this.p_end, 'end')
                        }
                    },
                    'mousedown-panel': this.emitMousedownStartPanel,
                }
            }

            const endBinding = {
                props: {
                    value: this.p_end,
                    ...publicProps,
                    max,
                    min,
                },
                on: {
                    change: (value) => {
                        this.p_end = value
                        this.emitUpdateEnd(value)
                        this.emitInput(value, 'end')

                        const {end, start} = this.formatData as { start: PlainDate, end: PlainDate }

                        if (start.isNull || end.lessThan(start, PlainDate.CompareMode.time) > 0) {
                            this.p_start = this.p_end
                            this.emitUpdateStart(this.p_start)
                            this.emitInput(this.p_start, 'start')
                        }
                    },
                    'mousedown-panel': this.emitMousedownEndPanel,
                }
            }

            return {
                start: startBinding,
                end: endBinding,
            }
        },
    },
}