import {DatePublicMixin, DatePublicProps, DateView} from "./index";
import {PlainDate} from "../../../utils/PlainDate";
import {DateBasePanelItemData} from "./pl-date-base-panel-item";
import {EmitMixin} from "../../../utils/mixins";

interface DateRangeGetDataType {
    startPd: PlainDate,
    endPd: PlainDate,
    hoverRange: [PlainDate, PlainDate],
}

export default {
    name: 'pl-date-panel-date-range',
    mixins: [
        DatePublicMixin,
        EmitMixin,
    ],
    props: {
        range: {type: Boolean, default: true},
    },
    emitters: {
        emitUpdateStart: Function,
        emitUpdateEnd: Function,
        emitInput: Function,
    },
    watch: {
        start(val) {
            if (this.p_start != val) {
                this.p_start = val
                const {displayFormat, valueFormat} = this.formatString
                this.valueRange = [new PlainDate(val, displayFormat, valueFormat), new PlainDate(this.p_end, displayFormat, valueFormat)]
                this.hoverRange = null

                const startPd = new PlainDate(val, displayFormat, valueFormat)
                this.selectDate = startPd.copy()
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

        const {displayFormat, valueFormat} = this.getFormatString()
        const {start: p_start, end: p_end} = this

        const today = PlainDate.today(displayFormat, valueFormat)                                                           // 今天
        const startPd = new PlainDate(p_start, displayFormat, valueFormat)                                                  // 开始时间：PlainDate
        const endPd = new PlainDate(p_end, displayFormat, valueFormat)                                                      // 结束时间：PlainDate

        const selectDate: PlainDate = !!p_start ? new PlainDate(p_start, displayFormat, valueFormat) : today.copy()         // 当前选择的年月信息对象
        const hoverRange: [PlainDate, PlainDate] = null                                                                     // 当前鼠标enter的日期范围
        const valueRange: [PlainDate, PlainDate] = [startPd, endPd]                                                         // [startPd,endPd]

        return {
            p_start,
            p_end,
            today,
            selectDate,
            hoverRange,
            valueRange,
        }
    },
    render(h) {
        return (
            <div class="pl-date-base-panel pl-date-panel-date-range">
                <pl-date-base-panel-date {...this.binding.start}/>
                <pl-date-base-panel-date {...this.binding.end}/>
            </div>
        )
    },
    computed: {
        binding() {
            const {selectDate} = this
            const {displayFormat, valueFormat} = this.formatString

            const publicProps = Object.keys(DatePublicProps).reduce((ret, key) => {
                ret[key] = this[key]
                return ret
            }, {})

            Object.assign(publicProps, {
                displayFormat,
                valueFormat,
                range: true
            })

            const start = {
                props: {
                    ...publicProps,
                    selectDate,
                },
                on: {
                    'select-date-change': (val: PlainDate) => {
                        this.selectDate = val
                    },
                    'click-item': this.onClickItem,
                    'mouseenter-item': this.onMouseenterItem,
                },
            }

            const endSelectDate = selectDate.copy()
            endSelectDate.setMonthDate(endSelectDate.month + 1, 1)

            const end = {
                props: {
                    ...publicProps,
                    selectDate: endSelectDate,
                },
                on: {
                    'select-date-change': (val: PlainDate) => {
                        val.setMonthDate(val.month - 1, 1)
                        this.selectDate = val.copy()
                    },
                    'click-item': this.onClickItem,
                    'mouseenter-item': this.onMouseenterItem,
                },
            }

            return {
                start,
                end
            }
        },
        DateRangeGetData() {
            const {hoverRange} = this
            const [startPd, endPd] = this.valueRange
            return {
                hoverRange,
                startPd,
                endPd
            }
        },
    },
    methods: {
        /*---------------------------------------utils-------------------------------------------*/
        getActive(ipd: PlainDate | number, type: DateView) {
            const {startPd, endPd} = this.DateRangeGetData as DateRangeGetDataType

            switch (type) {
                case DateView.year:
                    ipd = ipd as number
                    return (!startPd.isNull && startPd.year === ipd) || (!endPd.isNull && endPd.year == ipd)
                case DateView.month:
                    ipd = ipd as PlainDate
                    return ((!startPd.isNull && startPd.greaterThan(ipd, PlainDate.CompareMode.yearmonth) === 0) || (!endPd.isNull && endPd.greaterThan(ipd, PlainDate.CompareMode.yearmonth) === 0))
                case DateView.date:
                    ipd = ipd as PlainDate
                    return ((!startPd.isNull && startPd.greaterThan(ipd, PlainDate.CompareMode.date) === 0) || (!endPd.isNull && endPd.greaterThan(ipd, PlainDate.CompareMode.date) === 0))
            }
        },
        getHoverStart(ipd: PlainDate | number, type: DateView) {
            const {startPd, endPd, hoverRange} = this.DateRangeGetData as DateRangeGetDataType
            switch (type) {
                case DateView.year:
                    ipd = ipd as number
                    return !!hoverRange ? false : (startPd.year === ipd)
                case DateView.month:
                    ipd = ipd as PlainDate
                    return !!hoverRange ? false : (!startPd.isNull && startPd.greaterThan(ipd, PlainDate.CompareMode.yearmonth) === 0)
                case DateView.date:
                    ipd = ipd as PlainDate
                    return !!hoverRange ?
                        hoverRange[0].greaterThan(ipd, PlainDate.CompareMode.date) === 0 :
                        (!startPd.isNull && startPd.greaterThan(ipd, PlainDate.CompareMode.date) === 0)
            }
        },
        getHover(ipd: PlainDate | number, type: DateView) {
            const {startPd, endPd, hoverRange} = this.DateRangeGetData as DateRangeGetDataType
            switch (type) {
                case DateView.year:
                    ipd = ipd as number
                    return !!hoverRange ?
                        false :
                        ((!startPd.isNull && startPd.year < ipd) && (!endPd.isNull && endPd.year > ipd))
                case DateView.month:
                    ipd = ipd as PlainDate
                    // console.log(!!hoverRange, (!startPd.isNull && startPd.lessThan(ipd, PlainDate.CompareMode.yearmonth) > 0),(!endPd.isNull && endPd.greaterThan(ipd, PlainDate.CompareMode.yearmonth) > 0))
                    return !!hoverRange ?
                        false :
                        (!startPd.isNull && startPd.lessThan(ipd, PlainDate.CompareMode.yearmonth) > 0) && (!endPd.isNull && endPd.greaterThan(ipd, PlainDate.CompareMode.yearmonth) > 0)
                case DateView.date:
                    ipd = ipd as PlainDate
                    return !!hoverRange ?
                        hoverRange[0].lessThan(ipd, PlainDate.CompareMode.date) > 0 && hoverRange[1].greaterThan(ipd, PlainDate.CompareMode.date) > 0 :
                        (!startPd.isNull && startPd.lessThan(ipd, PlainDate.CompareMode.date) > 0) && (!endPd.isNull && endPd.greaterThan(ipd, PlainDate.CompareMode.date) > 0)
            }
        },
        getHoverEnd(ipd: PlainDate | number, type: DateView) {
            const {startPd, endPd, hoverRange} = this.DateRangeGetData as DateRangeGetDataType
            switch (type) {
                case DateView.year:
                    ipd = ipd as number
                    return !!hoverRange ? false : (endPd.year === ipd)
                case DateView.month:
                    ipd = ipd as PlainDate
                    return !!hoverRange ? false : (!endPd.isNull && endPd.greaterThan(ipd, PlainDate.CompareMode.yearmonth) === 0)
                case DateView.date:
                    ipd = ipd as PlainDate
                    return !!hoverRange ?
                        hoverRange[0].greaterThan(ipd, PlainDate.CompareMode.date) === 0 :
                        (!endPd.isNull && endPd.greaterThan(ipd, PlainDate.CompareMode.date) === 0)
            }
        },

        /*---------------------------------------handler-------------------------------------------*/
        onClickItem(item: DateBasePanelItemData) {
            let {ipd} = item
            const {hoverRange} = this

            if (!hoverRange) {
                ipd = ipd.copy()
                this.hoverRange = [ipd, ipd]
                this.valueRange = [ipd, ipd]
            } else {
                const [startPd, endPd] = hoverRange as [PlainDate, PlainDate]

                this.p_start = startPd.valueString
                this.p_end = endPd.valueString

                this.hoverRange = null
                this.valueRange = [startPd, endPd]

                this.emitUpdateStart(this.p_start)
                this.emitInput(this.p_start, 'start')
                this.emitUpdateEnd(this.p_end)
                this.emitInput(this.p_end, 'end')
            }
        },
        onMouseenterItem({ipd}: DateBasePanelItemData) {
            if (!!this.hoverRange) {
                let midpd = this.valueRange[0] as PlainDate
                ipd = ipd.copy()
                this.hoverRange = midpd.greaterThan(ipd, PlainDate.CompareMode.yearmonth) > 0 ? [ipd, midpd] : [midpd, ipd]
            }
        },
    },
}