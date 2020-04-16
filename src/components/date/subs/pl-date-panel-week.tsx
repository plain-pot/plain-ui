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
                    'mouseenter-item': this.onMouseenterItem,
                    'click-item': this.onClickItem
                },
            }
        },
        WeekGetData() {
            const {value} = this.formatData as { [key: string]: PlainDate }
            const [start, end] = this.valueRange as [PlainDate, PlainDate]
            const {hoverRange} = this
            const [hoverStart, hoverEnd] = (hoverRange || []) as [PlainDate, PlainDate]

            return {
                value: {
                    pd: value,
                    range: value.isNull ? null : this.getWeekPdByPlainDate(value),
                },
                start: {
                    pd: start,
                    range: start.isNull ? null : this.getWeekPdByPlainDate(start),
                },
                end: {
                    pd: end,
                    range: end.isNull ? null : this.getWeekPdByPlainDate(end),
                },
                hoverStart: {
                    pd: hoverStart,
                    range: !!hoverRange ? this.getWeekPdByPlainDate(hoverStart) : null,
                },
                hoverEnd: {
                    pd: hoverEnd,
                    range: !!hoverRange ? this.getWeekPdByPlainDate(hoverEnd) : null
                },
                hoverRange,
            }
        },
    },
    methods: {
        /*---------------------------------------utils-------------------------------------------*/
        getWeekPdByPlainDate(pd: PlainDate): { start: PlainDate, end: PlainDate } {
            let day = pd.day
            let firstWeekDay = this.firstWeekDay

            const weekDayDuration = day - firstWeekDay
            let offsetDay = weekDayDuration === 0 ? 0 : weekDayDuration > 0 ? weekDayDuration : 7 + weekDayDuration

            let startPd = pd.copy()
            startPd.setMonthDate(startPd.month, startPd.date - offsetDay)
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
                const {value, start, end} = this.WeekGetData as { [key: string]: { pd: PlainDate, range: { start: PlainDate, end: PlainDate } | null } }

                ipd = ipd as PlainDate
                if (!this.range) {
                    if (!value.pd.isNull) {
                        const {start: startPd, end: endPd} = value.range

                        return !startPd.isNull && ((ipd.greaterThan(startPd, PlainDate.CompareMode.date) === 0) || (ipd.lessThan(endPd, PlainDate.CompareMode.date) === 0))
                    }
                } else {
                    if (!start.pd.isNull) {
                        const {start: startPd, end: endPd} = start.range
                        if (startPd.greaterThan(ipd, PlainDate.CompareMode.date) === 0 || endPd.lessThan(ipd, PlainDate.CompareMode.date) === 0) {
                            return true
                        }
                    }
                    if (!end.pd.isNull) {
                        const {start: startPd, end: endPd} = end.range
                        if (startPd.greaterThan(ipd, PlainDate.CompareMode.date) === 0 || endPd.lessThan(ipd, PlainDate.CompareMode.date) === 0) {
                            return true
                        }
                    }
                }
            }
        },
        getHoverStart(ipd: PlainDate | number, type: DateView) {
            return false
        },
        getHover(ipd: PlainDate | number, type: DateView) {
            if (type === DateView.date) {
                ipd = ipd as PlainDate
                if (!!this.hoverPd) {
                    if (this.isHover(this.hoverPd, ipd)) {
                        return true
                    }
                }

                const {value, start, end, hoverStart, hoverEnd, hoverRange} = this.WeekGetData as { [key: string]: { pd: PlainDate, range: { start: PlainDate, end: PlainDate } | null } }

                if (!this.range) {
                    if (!value.pd.isNull) {
                        const {start: startPd, end: endPd} = value.range
                        return startPd.lessThan(ipd, PlainDate.CompareMode.date) >= 0 && endPd.greaterThan(ipd, PlainDate.CompareMode.date) >= 0
                    }
                } else {
                    if (!!hoverRange) {
                        let startPd = hoverStart.range.start
                        let endPd = hoverEnd.range.end
                        return startPd.lessThan(ipd, PlainDate.CompareMode.date) >= 0 && endPd.greaterThan(ipd, PlainDate.CompareMode.date) >= 0
                    } else {
                        if (!!start.range && !!end.range) {
                            let startPd = start.range.start
                            let endPd = end.range.end
                            return startPd.lessThan(ipd, PlainDate.CompareMode.date) >= 0 && endPd.greaterThan(ipd, PlainDate.CompareMode.date) >= 0
                        }
                    }
                }
            }
        },
        getHoverEnd(ipd: PlainDate | number, type: DateView) {
            return false
        },
        /*---------------------------------------handler-------------------------------------------*/
        onClickItem({ipd}: DateBasePanelItemData) {
            const {start} = this.getWeekPdByPlainDate(ipd)

            if (!this.range) {
                this.p_value = start.valueString
                this.emitInput(this.p_value)
            } else {
                if (!this.hoverRange) {
                    const {start: itemStart} = this.getWeekPdByPlainDate(ipd)

                    this.hoverRange = [itemStart, itemStart]
                    this.valueRange = [itemStart, itemStart]
                } else {
                    const [startPd, endPd] = this.hoverRange as [PlainDate, PlainDate]

                    this.p_start = startPd.valueString
                    this.p_end = endPd.valueString

                    this.hoverRange = null
                    this.valueRange = [startPd, endPd]

                    this.emitUpdateStart(this.p_start)
                    this.emitInput(this.p_start, 'start')
                    this.emitUpdateEnd(this.p_end)
                    this.emitInput(this.p_end, 'end')
                }
            }
        },
        onMouseenterItem({ipd}: DateBasePanelItemData) {
            const {start: itemStartPd} = this.getWeekPdByPlainDate(ipd)
            console.log(itemStartPd.valueString)

            if (!this.range) {
                this.hoverPd = itemStartPd
            } else {
                if (!!this.hoverRange) {
                    const {start: {range}} = this.WeekGetData
                    const midPd = range[0]
                    this.hoverRange = midPd.greaterThan(itemStartPd, PlainDate.CompareMode.yearmonth) > 0 ? [itemStartPd, midPd] : [midPd, itemStartPd]
                }
            }
        },
    },
}