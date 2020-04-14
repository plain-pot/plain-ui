import {PlainDate} from "../../../utils/PlainDate";
import {EmitMixin} from "../../../utils/mixins";
import {DateBasePanelItemData} from "./pl-date-base-panel-item";

enum MonthView {
    year = 'year',
    month = 'month'
}

export default {
    name: 'pl-date-base-panel-month',
    mixins: [EmitMixin],
    emitters: {
        emitInput: Function,
        emitUpdateStart: Function,
        emitUpdateEnd: Function,
    },
    props: {
        value: {type: String},
        displayFormat: {type: String},
        valueFormat: {type: String},
        max: {type: String},
        min: {type: String},
        range: {type: Boolean},
        start: {type: String},
        end: {type: String},
        checkDisabled: {type: Function},
    },
    watch: {
        value(val) {
            this.p_value = val

            const vpd = new PlainDate(val, this.displayFormat, this.valueFormat)
            this.setSelectYear(vpd.year)
        },
        start(val) {
            this.p_start = val

            this.valueRange = [new PlainDate(val, this.displayFormat, this.valueFormat), new PlainDate(this.p_end, this.displayFormat, this.valueFormat)]
            this.hoverRange = null

            const startPd = new PlainDate(val, this.displayFormat, this.valueFormat)
            this.setSelectYear(startPd.year)
        },
        end(val) {
            this.p_end = val

            this.valueRange = [new PlainDate(this.p_start, this.displayFormat, this.valueFormat), new PlainDate(val, this.displayFormat, this.valueFormat)]
            this.hoverRange = null
        },
    },
    data() {
        const {value, start, end, displayFormat, valueFormat} = this

        const vpd = new PlainDate(value, displayFormat, valueFormat)
        const startPd = new PlainDate(start, displayFormat, valueFormat)
        const endPd = new PlainDate(end, displayFormat, valueFormat)
        const today = PlainDate.decode(new Date())

        let selectYear

        if (!this.range) {
            selectYear = !vpd.isNull ? vpd.year : today.year
        } else {
            selectYear = !startPd.isNull ? startPd.year : today.year
        }

        const tempPd = new PlainDate(null, this.displayFormat, this.valueFormat)

        const p_value = value
        const p_start = start
        const p_end = end

        const transitionDirection = 'next'

        const hoverRange: [PlainDate, PlainDate] = null
        const valueRange: [PlainDate, PlainDate] = [startPd, endPd]

        const view: MonthView = MonthView.year

        return {
            today,
            selectYear,
            tempPd,

            p_value,
            p_start,
            p_end,

            hoverRange,
            valueRange,

            transitionDirection,
            view,
        }
    },
    render(h) {
        return (
            <div class="pl-date-base-panel-month-wrapper pl-date-base-panel">
                <transition name={`pl-transition-slide-${this.view === 'year' ? 'prev' : 'next'}`}>
                    {this.view === 'month' ? (
                        <pl-date-base-panel class="pl-date-base-panel-month" direction="horizontal">
                            <template slot="left">
                                <pl-button icon="el-icon-d-arrow-left" mode="text" size="mini" onClick={this.prevYear}/>
                            </template>
                            <template slot="center">
                                <span onClick={() => this.view = MonthView.year}>{this.selectYear}</span>
                            </template>
                            <template slot="right">
                                <pl-button icon="el-icon-d-arrow-right" mode="text" size="mini" onClick={this.nextYear}/>
                            </template>
                            <template slot="content">
                                <transition name={`pl-transition-slide-${this.transitionDirection}`}>
                                    <ul class="pl-date-base-panel-month-list" key={this.selectYear} direction="vertical">
                                        {this.monthList.map(item => (
                                            <pl-date-base-panel-item
                                                class="pl-date-base-panel-month-item"
                                                item={item}
                                                onClick={this.onClickItem}
                                                onMouseenter={this.onMouseEnterItem}
                                                key={item.month}
                                            />
                                        ))}
                                    </ul>
                                </transition>
                            </template>
                        </pl-date-base-panel>
                    ) : (
                        <pl-date-base-panel-year {...this.yearPanelBinding} direction="horizontal"/>
                    )}
                </transition>
            </div>
        )
    },
    computed: {
        months() {
            return [
                '一月',
                '二月',
                '三月',
                '四月',
                '五月',
                '六月',
                '七月',
                '八月',
                '九月',
                '十月',
                '十一月',
                '十二月',
            ]
        },
        formatData() {

            const {p_value: value, p_start: start, p_end: end, max, min, displayFormat, valueFormat} = this

            return {
                value: new PlainDate(value, displayFormat, valueFormat),
                start: new PlainDate(start, displayFormat, valueFormat),
                end: new PlainDate(end, displayFormat, valueFormat),
                max: new PlainDate(max, displayFormat, valueFormat),
                min: new PlainDate(min, displayFormat, valueFormat),
            }
        },
        yearPanelBinding() {
            return {
                props: {
                    value: this.selectYear,
                    checkActive: this.checkYearActive,
                },
                on: {
                    change: this.onSelectYearChange,
                },
            }
        },
        monthList() {

            const [startPd, endPd] = this.valueRange as [PlainDate, PlainDate]
            const hoverRange = this.hoverRange as [PlainDate, PlainDate]

            let ret: DateBasePanelItemData[] = [];
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach(i => {

                this.tempPd.setYear(this.selectYear)
                this.tempPd.setMonthDate(i, 1)
                const ipd = this.tempPd.copy()

                const item = {
                    label: this.months[i],
                    disabled: this.getDisabled(i),
                    now: this.selectYear === this.today.year && (this.today.month == i),
                    active: this.getActive(i, {vpd: this.formatData.value, ipd, range: this.range}),

                    hoverStart: false,
                    hoverEnd: false,
                    hover: false,

                    range: this.range,
                    month: i,
                    ipd,
                }

                if (this.range) {
                    item.hoverStart = !!hoverRange ?
                        hoverRange[0].greaterThan(ipd, PlainDate.CompareMode.yearmonth) === 0 :
                        (!startPd.isNull && startPd.greaterThan(ipd, PlainDate.CompareMode.yearmonth) === 0)
                    item.hoverEnd = !!hoverRange ?
                        hoverRange[1].greaterThan(ipd, PlainDate.CompareMode.yearmonth) === 0 :
                        (!endPd.isNull && endPd.greaterThan(ipd, PlainDate.CompareMode.yearmonth) === 0)
                    item.hover = !!hoverRange ?
                        hoverRange[0].lessThan(ipd, PlainDate.CompareMode.yearmonth) > 0 && hoverRange[1].greaterThan(ipd, PlainDate.CompareMode.yearmonth) > 0 :
                        (!startPd.isNull && startPd.lessThan(ipd, PlainDate.CompareMode.yearmonth) > 0) && (!endPd.isNull && endPd.greaterThan(ipd, PlainDate.CompareMode.yearmonth) > 0)
                    item.active = ((!startPd.isNull && startPd.greaterThan(ipd, PlainDate.CompareMode.yearmonth) === 0) || (!endPd.isNull && endPd.greaterThan(ipd, PlainDate.CompareMode.yearmonth) === 0))
                }

                ret.push(item)
            })
            return ret
        },
    },
    methods: {
        /*---------------------------------------methods-------------------------------------------*/
        prevYear() {
            this.transitionDirection = 'prev'
            this.selectYear--
        },
        nextYear() {
            this.transitionDirection = 'next'
            this.selectYear++
        },
        /*---------------------------------------utils-------------------------------------------*/
        setSelectYear(target) {
            if (!target) {
                target = this.today.year
            }
            this.transitionDirection = this.selectYear > target ? 'prev' : 'next'
            this.selectYear = target
        },
        getDisabled(item) {
            if (this.checkDisabled) {
                return this.checkDisabled(item, 'month')
            }
            const {max, min} = this.formatData as { max: PlainDate, min: PlainDate }

            this.tempPd.setYear(this.selectYear)
            this.tempPd.setMonthDate(item, 1)

            if (!max.isNull && max.lessThan(this.tempPd, PlainDate.CompareMode.yearmonth) > 0) {
                return true
            }
            if (!min.isNull && min.greaterThan(this.tempPd, PlainDate.CompareMode.yearmonth) > 0) {
                return true
            }
            return false
        },
        getActive(item, option: { vpd: PlainDate, ipd: PlainDate, range: boolean }) {
            if (!!this.checkActive) {
                return this.checkActive(item, 'month', option)
            }
            return (!option.vpd.isNull && option.vpd.year == this.selectYear && option.vpd.month == item)
        },
        /*---------------------------------------handler-------------------------------------------*/
        onClickItem(item) {
            if (!this.range) {
                this.tempPd.setYear(this.selectYear)
                this.tempPd.setMonthDate(item.month, 1)
                this.p_value = this.tempPd.valueString
                this.emitInput(this.p_value)
            } else {

                if (!this.hoverRange) {
                    this.tempPd.setYear(this.selectYear)
                    this.tempPd.setMonthDate(item.month, 1)
                    item = this.tempPd.copy()

                    this.hoverRange = [item, item]
                    this.valueRange = [item, item]
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
        onMouseEnterItem(item) {
            if (!!this.hoverRange) {
                let midpd = this.valueRange[0] as PlainDate
                this.tempPd.setYear(this.selectYear)
                this.tempPd.setMonthDate(item.month, 1)
                item = this.tempPd.copy()
                this.hoverRange = midpd.greaterThan(item, PlainDate.CompareMode.yearmonth) > 0 ? [item, midpd] : [midpd, item]
            }
        },
        onSelectYearChange(val) {
            this.view = MonthView.month
            this.setSelectYear(val)
        },
        checkYearActive(val) {
            const {value, start, end} = this.formatData as { start: PlainDate, end: PlainDate, value: PlainDate }
            if (!this.range) {
                return (!value.isNull && value.year === val)
            } else {
                return (!start.isNull && start.year === val) || (!end.isNull && end.year === val)
            }
        },
    },
}
