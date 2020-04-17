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

            const publicProps = {
                range,
                value,
                start,
                end,
                max,
                min,
            }
            const publicChange = (val, type) => {
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
            }

            switch (this.panel as DatePanelType) {
                case DatePanelType.year:
                    return {
                        props: {
                            ...publicProps,
                            displayFormat: displayFormat || 'YYYY',
                            valueFormat: valueFormat || 'YYYY',
                        },
                        on: {change: publicChange,},
                    }
                case DatePanelType.month:
                    return {
                        props: {
                            ...publicProps,
                            displayFormat: displayFormat || 'YYYY-MM',
                            valueFormat: valueFormat || 'YYYY-MM',
                        },
                        on: {change: publicChange,},
                    }
                case DatePanelType.date:
                    return {
                        props: {
                            ...publicProps,
                            displayFormat: displayFormat || 'YYYY-MM-DD',
                            valueFormat: valueFormat || 'YYYY-MM-DD',
                        },
                        on: {change: publicChange,},
                    }
                case DatePanelType.datetime:
                    return {
                        props: {
                            ...publicProps,
                            displayFormat: displayFormat || 'YYYY-MM-DD',
                            valueFormat: valueFormat || 'YYYY-MM-DD',
                            datetime: true,
                        },
                        on: {change: publicChange,},
                    }
                default:
                    return {}
            }
        },
    },
    render(h) {

        const binding = this.panelBinding

        const panel = {
            year: 'pl-date-base-panel-year',
            month: 'pl-date-base-panel-month',
            date: binding.props.range ? 'pl-date-panel-date-range' : 'pl-date-base-panel-date',
            datetime: binding.props.range ? 'pl-date-panel-date-range' : 'pl-date-base-panel-date',
            week: 'pl-date-base-panel-week',
            dates: 'pl-date-base-panel-dates',
        }
        const Component = panel[this.panel]

        return <Component {...this.panelBinding}/>
    }
}