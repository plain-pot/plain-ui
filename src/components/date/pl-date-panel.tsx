import {EmitMixin} from "../../utils/mixins";
import {DatePublicProps} from "./subs";

export const enum DatePanelType {
    year = 'year',
    month = 'month',
    date = 'date',
    datetime = 'datetime',
    week = 'week',
    dates = 'dates',
}

const enum DateEmitType {
    start = 'start',
    end = 'end'
}

export default {
    name: 'pl-date-panel',
    mixins: [
        EmitMixin,
    ],
    emitters: {
        emitInput: Function,
        emitUpdateStart: Function,
        emitUpdateEnd: Function,
    },
    props: {
        ...DatePublicProps,
        panel: {type: String, default: DatePanelType.date},
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

        return {
            p_value,
            p_start,
            p_end,
        }
    },
    computed: {
        panelBinding() {
            const {p_value: value, p_start: start, p_end: end, range, max, min, displayFormat, valueFormat} = this

            switch (this.panel as DatePanelType) {
                case DatePanelType.year:
                    return {
                        props: {
                            range,
                            value,
                            start,
                            end,
                            max,
                            min,
                            displayFormat: displayFormat || 'YYYY',
                            valueFormat: valueFormat || 'YYYY',
                        },
                        on: {
                            change: (val, type) => {
                                if (!range) {
                                    this.p_value = val
                                    this.emitInput(this.p_value)
                                } else {
                                    if (type === DateEmitType.start) {
                                        this.p_start = val
                                        this.emitUpdateStart(this.p_start)
                                    } else {
                                        this.p_end = val
                                        this.emitUpdateEnd(this.p_end)
                                    }

                                    this.emitInput(val, type)
                                }
                            },
                        },
                    }
                case DatePanelType.date:
                    return {}
                default:
                    return {}
            }
        },
    },
    render(h) {
        const panel = {
            year: 'pl-date-base-panel-year',
            month: 'pl-date-base-panel-month',
            date: 'pl-date-base-panel-date',
            datetime: 'pl-date-base-panel-date',
            week: 'pl-date-base-panel-week',
            dates: 'pl-date-base-panel-dates',
        }
        const Component = panel[this.panel]

        return <Component {...this.panelBinding}/>
    }
}