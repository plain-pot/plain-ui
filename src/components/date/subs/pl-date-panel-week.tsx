import {DatePublicMixin, DateView, PanelItemParam, PanelParentProvider} from "./index";
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
        emitMousedownPanel: Function,
    },
    props: {},
    watch: {
        value(val) {
            if (this.p_value != val) {
                this.p_value = val
                const vpd = new PlainDate(val, this.formatString.displayFormat, this.formatString.valueFormat)
                this.p_selectDate = vpd.isNull ? this.today.copy() : vpd.copy()
            }
        },
        start(val) {
            if (this.p_start != val) {
                this.p_start = val
                const {displayFormat, valueFormat} = this.formatString
                const startPd = new PlainDate(val, displayFormat, valueFormat)
                const endPd = new PlainDate(this.p_end, displayFormat, valueFormat)
                this.valueRange = [startPd, endPd]
                this.hoverRange = null

                this.p_selectDate = startPd.isNull ? this.today.copy() : startPd.copy()
            }
        },
        end(val) {
            if (this.p_end != val) {
                this.p_end = val
                const {displayFormat, valueFormat} = this.formatString
                this.valueRange = [new PlainDate(this.p_start, displayFormat, valueFormat), new PlainDate(val, displayFormat, valueFormat)]
                this.hoverRange = null
            }
        },
    },
    data() {
        const {value: p_value, start: p_start, end: p_end} = this
        const {displayFormat, valueFormat} = this.getFormatString()

        const vpd = new PlainDate(p_value, displayFormat, valueFormat)
        const startPd = new PlainDate(p_start, displayFormat, valueFormat)
        const endPd = new PlainDate(p_end, displayFormat, valueFormat)
        const today = PlainDate.today(displayFormat, valueFormat)

        const hoverRange: [PlainDate, PlainDate] = null
        const valueRange = [startPd, endPd]

        const hoverPd: PlainDate = null

        let p_selectDate = this.selectDate
        if (!p_selectDate) {
            if (!this.range) {
                p_selectDate = vpd.isNull ? today.copy() : vpd.copy()
            } else {
                p_selectDate = startPd.isNull ? today.copy() : startPd.copy()
            }
        }

        return {
            p_value,
            p_start,
            p_end,

            hoverRange,
            valueRange,
            hoverPd,

            today,
            p_selectDate,
        }
    },
    render(h) {
        return (
            <pl-date-base-panel-date {...this.datePanelBinding} {...{on: {'mousedown-panel': this.emitMousedownPanel}}}/>
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
                    value: this.p_start,
                    selectDate: this.p_selectDate,
                    firstWeekDay: this.firstWeekDay,

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
                    'click-item': this.onClickItem,
                    'select-date-change': val => {
                        this.p_selectDate = val
                    }
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
        provideData(): PanelParentProvider {
            const {value, hoverRange, valueRange, range} = this.panelItemParam as PanelItemParam
            return {
                year: {
                    range: true,
                    value: value,
                    hoverRange,
                    valueRange,
                },
                month: {
                    range: true,
                    value: value,
                    hoverRange,
                    valueRange,
                },
                date: {
                    range: true,
                    value: value,
                    hoverRange,
                    valueRange,
                },
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
            return ipd.YMD >= start.YMD && ipd.YMD <= end.YMD
        },
        getChildDisabled(ipd: number | PlainDate, type: DateView) {
            if (type === DateView.date) {
                ipd = ipd as PlainDate
                const {max, min} = this.formatData as { [key: string]: PlainDate }
                if (!max.isNull) {
                    if (ipd.YMD > max.YMD) {
                        return true
                    }
                }
                if (!min.isNull) {
                    if (ipd.YMD < min.YMD) {
                        return true
                    }
                }
            }
        },
        getChildActive(ipd: PlainDate | number, type: DateView) {
            const {value, start, end} = this.WeekGetData as { [key: string]: { pd: PlainDate, range: { start: PlainDate, end: PlainDate } | null } }

            if (type === DateView.year) {
                ipd = ipd as number

                if (!this.range) {
                    return !value.pd.isNull && (value.pd.year == ipd)
                } else {
                    return (!start.pd.isNull && start.pd.year == ipd) || (!end.pd.isNull && end.pd.year == ipd)
                }
            } else if (type === DateView.month) {
                ipd = ipd as PlainDate
                if (!this.range) {
                    return !value.pd.isNull && (value.pd.YM === ipd.YM)
                } else {
                    return (!start.pd.isNull && start.pd.YM === ipd.YM) || (!end.pd.isNull && end.pd.YM === ipd.YM)
                }
            } else if (type === DateView.date) {

                ipd = ipd as PlainDate
                if (!this.range) {
                    if (!value.pd.isNull) {
                        const {start: startPd, end: endPd} = value.range

                        return !startPd.isNull && ((ipd.YMD === startPd.YMD) || (ipd.YMD === endPd.YMD))
                    }
                } else {
                    if (!start.pd.isNull) {
                        const {start: startPd, end: endPd} = start.range
                        if (startPd.YMD === ipd.YMD || endPd.YMD === ipd.YMD) {
                            return true
                        }
                    }
                    if (!end.pd.isNull) {
                        const {start: startPd, end: endPd} = end.range
                        if (startPd.YMD === ipd.YMD || endPd.YMD === ipd.YMD) {
                            return true
                        }
                    }
                }
            }
        },
        getChildHoverStart(ipd: PlainDate | number, type: DateView) {
            const {start} = this.WeekGetData as { [key: string]: { pd: PlainDate, range: { start: PlainDate, end: PlainDate } | null } }

            if (type === DateView.year) {
                ipd = ipd as number
                return !!this.hoverRange ? false : (!start.pd.isNull && start.pd.year == ipd)
            } else if (type === DateView.month) {
                ipd = ipd as PlainDate
                return !!this.hoverRange ? false : (!start.pd.isNull && start.pd.YM === ipd.YM)
            }
        },
        getChildHover(ipd: PlainDate | number, type: DateView) {
            const {value, start, end, hoverStart, hoverEnd, hoverRange} = this.WeekGetData as { [key: string]: { pd: PlainDate, range: { start: PlainDate, end: PlainDate } | null } }

            if (type === DateView.year) {
                ipd = ipd as number
                if (!this.range) {
                    return false
                } else {
                    return !!this.hoverRange ? false : (!start.pd.isNull && start.pd.year <= ipd) && (!end.pd.isNull && end.pd.year >= ipd)
                }
            } else if (type === DateView.month) {
                ipd = ipd as PlainDate
                if (!this.range) {
                    return false
                } else {
                    return !!this.hoverRange ? false : (!start.pd.isNull && start.pd.YM <= ipd.YM) && (!end.pd.isNull && end.pd.YM >= ipd.YM)
                }
            } else if (type === DateView.date) {
                ipd = ipd as PlainDate

                if (!!this.hoverPd) {
                    if (this.isHover(this.hoverPd, ipd)) {
                        return true
                    }
                }

                if (!this.range) {
                    if (!value.pd.isNull) {
                        const {start: startPd, end: endPd} = value.range
                        return startPd.YMD <= ipd.YMD && endPd.YMD >= ipd.YMD
                    }
                } else {
                    if (!!hoverRange) {
                        let startPd = hoverStart.range.start
                        let endPd = hoverEnd.range.end
                        return startPd.YMD <= ipd.YMD && endPd.YMD >= ipd.YMD
                    } else {
                        if (!!start.range && !!end.range) {
                            let startPd = start.range.start
                            let endPd = end.range.end
                            return startPd.YMD <= ipd.YMD && endPd.YMD >= ipd.YMD
                        }
                    }
                }
            }
        },
        getChildHoverEnd(ipd: PlainDate | number, type: DateView) {
            const {end,} = this.WeekGetData as { [key: string]: { pd: PlainDate, range: { start: PlainDate, end: PlainDate } | null } }

            if (type === DateView.year) {
                ipd = ipd as number
                return !!this.hoverRange ? false : (!end.pd.isNull && end.pd.year == ipd)
            } else if (type === DateView.month) {
                ipd = ipd as PlainDate
                return !!this.hoverRange ? false : (!end.pd.isNull && end.pd.YM === ipd.YM)
            }
        },
        /*---------------------------------------handler-------------------------------------------*/
        onClickItem(ipd) {
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
            this.hoverPd = itemStartPd

            if (!!this.hoverRange) {
                const {start: {range: {start}}} = this.WeekGetData
                this.hoverRange = start.YMD > itemStartPd.YMD ? [itemStartPd, start] : [start, itemStartPd]
            }
        },
    },
}