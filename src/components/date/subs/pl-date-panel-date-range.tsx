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
                this.p_selectDate = startPd.copy()
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

        const p_selectDate: PlainDate = !!p_start ? new PlainDate(p_start, displayFormat, valueFormat) : today.copy()         // 当前选择的年月信息对象
        const hoverRange: [PlainDate, PlainDate] = null                                                                     // 当前鼠标enter的日期范围
        const valueRange: [PlainDate, PlainDate] = [startPd, endPd]                                                         // [startPd,endPd]

        return {
            p_start,
            p_end,
            today,
            p_selectDate,
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
        formatData() {
            const {displayFormat, valueFormat} = this.formatString
            let {p_start: start, p_end: end, defaultTime: defaultTimeString} = this

            const startDate = new PlainDate(start, displayFormat, valueFormat)
            const endDate = new PlainDate(end, displayFormat, valueFormat)

            if (!defaultTimeString) defaultTimeString = '12:00:00'
            let defaultTime = new PlainDate(defaultTimeString, 'HH:mm:ss', 'HH:mm:ss')

            const startTime = defaultTime.copy()
            if (!startDate.isNull) {
                startTime.setHms(startDate)
            }

            const endTime = defaultTime.copy()
            if (!endDate.isNull) {
                endTime.setHms(endDate)
            }

            return {
                defaultTime,
                startDate,
                endDate,
                startTime,
                endTime,
            }
        },
        CompareMode() {
            return this.datetime ? PlainDate.CompareMode.datetime : PlainDate.CompareMode.date
        },
        binding() {
            const {p_selectDate} = this
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
                    selectDate: p_selectDate,
                    value: this.p_start,
                },
                on: {
                    'select-date-change': (val: PlainDate) => {
                        this.p_selectDate = val
                    },
                    'mouseenter-item': this.onMouseenterItem,
                    'click-item': (item) => this.onClickItem(item, 'start'),
                    'select-time': (val) => this.onSelectTime(val, 'start')
                },
            }

            const endSelectDate = p_selectDate.copy()
            endSelectDate.setMonthDate(endSelectDate.month + 1, 1)

            const end = {
                props: {
                    ...publicProps,
                    selectDate: endSelectDate,
                    value: this.p_end,
                },
                on: {
                    'select-date-change': (val: PlainDate) => {
                        val.setMonthDate(val.month - 1, 1)
                        this.p_selectDate = val.copy()
                    },
                    'mouseenter-item': this.onMouseenterItem,
                    'click-item': (item) => this.onClickItem(item, 'end'),
                    'select-time': (val) => this.onSelectTime(val, 'end')
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
                        hoverRange[1].greaterThan(ipd, PlainDate.CompareMode.date) === 0 :
                        (!endPd.isNull && endPd.greaterThan(ipd, PlainDate.CompareMode.date) === 0)
            }
        },
        emitValue(startPd: PlainDate, endPd: PlainDate) {

            this.p_start = startPd.valueString
            this.p_end = endPd.valueString

            this.hoverRange = null
            this.valueRange = [startPd, endPd]

            this.emitUpdateStart(this.p_start)
            this.emitInput(this.p_start, 'start')
            this.emitUpdateEnd(this.p_end)
            this.emitInput(this.p_end, 'end')
        },
        /*---------------------------------------handler-------------------------------------------*/
        async onClickItem(item: DateBasePanelItemData, type: 'start' | 'end') {
            await this.$plain.nextTick()
            const {startTime, endTime} = this.formatData as { [key: string]: PlainDate }

            let {ipd} = item
            const {hoverRange} = this

            if (!hoverRange) {
                ipd = ipd.copy()
                this.hoverRange = [ipd, ipd]
                this.valueRange = [ipd, ipd]
            } else {
                let [startPd, endPd] = hoverRange as [PlainDate, PlainDate]
                startPd = startPd.copy()
                endPd = endPd.copy()

                startPd.setHms(startTime)
                endPd.setHms(endTime)

                if (startPd.greaterThan(endPd, this.CompareMode) > 0) {
                    endPd = startPd
                }

                this.emitValue(startPd, endPd)
            }
        },
        onMouseenterItem({ipd}: DateBasePanelItemData) {
            if (!!this.hoverRange) {
                let midpd = this.valueRange[0] as PlainDate
                ipd = ipd.copy()
                this.hoverRange = midpd.greaterThan(ipd, PlainDate.CompareMode.date) > 0 ? [ipd, midpd] : [midpd, ipd]
            }
        },
        async onSelectTime(val: string, type: 'start' | 'end') {
            await this.$plain.nextTick()

            let {p_selectDate} = this as { [key: string]: PlainDate }
            let {startDate, endDate, defaultTime} = this.formatData as { [key: string]: PlainDate }
            defaultTime = defaultTime.copy()
            defaultTime.setValue(val)

            if (type === 'start') {
                if (startDate.isNull) {
                    startDate.setYMD(p_selectDate)
                }
                startDate.setHms(defaultTime)
                if (endDate.isNull) {
                    endDate = startDate.copy()
                } else {
                    if (startDate.greaterThan(endDate, this.CompareMode) > 0) {
                        endDate = startDate.copy()
                    }
                }
            } else if (type === 'end') {
                if (endDate.isNull) {
                    endDate.setYMD(p_selectDate)
                }
                endDate.setHms(defaultTime)
                if (startDate.isNull) {
                    startDate = endDate.copy()
                } else {
                    if (endDate.lessThan(startDate, this.CompareMode) > 0) {
                        startDate = endDate.copy()
                    }
                }
            }

            this.emitValue(startDate, endDate)
        },
    },
}