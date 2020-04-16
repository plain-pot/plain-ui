import {DatePublicMixin, DateView} from "./index";
import {PlainDate} from "../../../utils/PlainDate";
import {DateBasePanelItemData} from "./pl-date-base-panel-item";
import {EmitMixin} from "../../../utils/mixins";

export default {
    name: 'pl-date-panel-week',
    mixins: [
        EmitMixin,
        DatePublicMixin,
    ],
    emitters: {
        emitInput: Function,
        emitUpdateStart: Function,
        emitUpdateEnd: Function,
    },
    props: {},
    watch: {
        value(val) {
            this.p_value = val
        },
    },
    data() {
        const {value: p_value, start: p_start, end: p_end} = this
        const {displayFormat, valueFormat} = this.getFormatString()

        const startPd = new PlainDate(p_start, displayFormat, valueFormat)
        const endPd = new PlainDate(p_end, displayFormat, valueFormat)

        const hoverRange: [PlainDate, PlainDate] = null
        const valueRange = [startPd, endPd]

        const hoverPd: PlainDate = null

        return {
            p_value,
            p_start,
            p_end,

            hoverRange,
            valueRange,
            hoverPd,
        }
    },
    render(h) {
        return (
            <pl-date-base-panel-date {...this.datePanelBinding}/>
        )
    },
    computed: {
        formatData() {
            let {p_value: value, p_start: start, p_end: end, max, min} = this
            const {displayFormat, valueFormat} = this.formatString

            value = new PlainDate(value, displayFormat, valueFormat)
            start = new PlainDate(start, displayFormat, valueFormat)
            end = new PlainDate(end, displayFormat, valueFormat)
            max = new PlainDate(max, displayFormat, valueFormat)
            min = new PlainDate(min, displayFormat, valueFormat)

            return {
                value,
                start,
                end,
                max,
                min,
            }
        },
        datePanelBinding() {
            const {displayFormat, valueFormat} = this.formatString
            return {
                class: 'pl-date-panel-week',
                props: {
                    range: true,
                    displayFormat,
                    valueFormat,
                    dateListBinding: {
                        nativeOn: {
                            'mouseleave': () => {
                                this.hoverPd = null
                            }
                        },
                    },
                },
                on: {
                    'mouseenter-item': ({ipd}: DateBasePanelItemData) => {
                        this.hoverPd = ipd
                    },
                    'click-item': this.onClickItem
                },
            }
        },
    },
    methods: {
        /*---------------------------------------utils-------------------------------------------*/
        getWeekPdByPlainDate(pd: PlainDate): { start: PlainDate, end: PlainDate } {
            let day = pd.day
            let firstWeekDay = this.firstWeekDay
            let startPd = pd.copy()
            startPd.setMonthDate(startPd.month, startPd.date - (day - firstWeekDay))
            let endPd = startPd.copy()
            endPd.setMonthDate(endPd.month, endPd.date + 6)
            return {
                start: startPd, end: endPd
            }
        },
        /**
         * ipd是否处于weekPd所在的周范围之内
         * @author  韦胜健
         * @date    2020/4/16 16:07
         */
        isHover(weekPd: PlainDate, ipd: PlainDate) {
            const {start, end} = this.getWeekPdByPlainDate(weekPd)
            return ipd.greaterThan(start, PlainDate.CompareMode.date) >= 0 && ipd.lessThan(end, PlainDate.CompareMode.date) >= 0
        },

        getActive(ipd: PlainDate | number, type: DateView) {
            if (type === DateView.date) {
                ipd = ipd as PlainDate
                if (!this.range) {
                    const {value} = this.formatData as { [key: string]: PlainDate }
                    if (!value.isNull) {
                        const {start, end} = this.getWeekPdByPlainDate(value)
                        return (ipd.greaterThan(start, PlainDate.CompareMode.date) === 0) || (ipd.lessThan(end, PlainDate.CompareMode.date) === 0)
                    }
                }
            }
        },
        getHoverStart(ipd: PlainDate | number, type: DateView) {

        },
        getHover(ipd: PlainDate | number, type: DateView) {
            if (type === DateView.date) {
                ipd = ipd as PlainDate
                if (!!this.hoverPd) {
                    if (this.isHover(this.hoverPd, ipd)) {
                        return true
                    }
                }
                const {value, start, end} = this.formatData as { [key: string]: PlainDate }
                if (!this.range) {
                    if (!value.isNull) {
                        return this.isHover(value, ipd)
                    }
                } else {

                }
            }
        },
        getHoverEnd(ipd: PlainDate | number, type: DateView) {

        },
        /*---------------------------------------handler-------------------------------------------*/
        onClickItem({ipd}: DateBasePanelItemData) {
            const {start} = this.getWeekPdByPlainDate(ipd)
            this.p_value = start.valueString
            this.emitInput(this.p_value)
        },
    },
}