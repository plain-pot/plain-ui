import {PlainDate} from "../../../utils/PlainDate";
import {EmitMixin} from "../../../utils/mixins";
import {DateBasePanelItemData} from "./pl-date-base-panel-item";
import {DatePublicProps, DateView} from "./index";

export default {
    name: "pl-date-base-panel-date",
    mixins: [
        EmitMixin,
    ],
    emitters: {
        emitInput: Function,
        emitClickItem: Function,
    },
    props: {
        ...DatePublicProps,

        datetime: {type: Boolean},
        firstWeekDay: {type: Number, default: 1},                                           // 一周的第一个是星期几，0是星期天，1是星期一
    },
    watch: {
        value(val) {
            this.p_value = val
            this.setSelectDate(val)
        },
    },
    data() {

        const {
            value: p_value,
        } = this

        const {displayFormat, valueFormat} = this.getFormatString()

        const today = PlainDate.today(displayFormat, valueFormat)
        const selectDate: PlainDate = !!p_value ? new PlainDate(p_value, displayFormat, valueFormat) : today.copy()
        const tempPd = new PlainDate(null, displayFormat, valueFormat)
        const p_view = DateView.date

        return {
            p_value,

            today,
            selectDate,

            tempPd,
            p_view,
        }
    },
    computed: {
        weekList(): string[] {
            const weeks = ['日', '一', '二', '三', '四', '五', '六']
            return weeks.slice(this.firstWeekDay).concat(weeks.slice(0, this.firstWeekDay))
        },
        formatString() {
            return this.getFormatString()
        },
        formatData() {
            const {p_value: value} = this
            const {displayFormat, valueFormat} = this.formatString
            return {
                value: new PlainDate(value, displayFormat, valueFormat),
            }

        },
        dateList(): DateBasePanelItemData[] {
            const {displayFormat, valueFormat} = this.formatString
            const {today, selectDate, tempPd} = this as { [key: string]: PlainDate }
            const {value} = this.formatData as { [key: string]: PlainDate }

            tempPd.setYear(selectDate.year)
            tempPd.setMonthDate(selectDate.month, 1)

            const currentMonthFirstDate = tempPd.copy()

            let weekDayDuration = currentMonthFirstDate.day - this.firstWeekDay
            let offsetDay = weekDayDuration === 0 ? 7 : weekDayDuration > 0 ? weekDayDuration : 7 + weekDayDuration

            let firstDateTime = new Date(currentMonthFirstDate.time - (offsetDay) * 24 * 60 * 60 * 1000).getTime()

            let list: DateBasePanelItemData[] = []
            for (let i = 0; i < 42; i++) {

                const ipd = new PlainDate(null, displayFormat, valueFormat)
                ipd.setTime(firstDateTime)

                list.push({
                    label: String(ipd.date),
                    now: today.greaterThan(ipd, PlainDate.CompareMode.date) === 0,
                    active: !value.isNull && (value.greaterThan(ipd, PlainDate.CompareMode.date) === 0),

                    hover: false,
                    hoverStart: false,
                    hoverEnd: false,

                    range: this.range,
                    disabled: false,

                    ipd,
                    isSelectMonth: ipd.greaterThan(selectDate, PlainDate.CompareMode.yearmonth) === 0,
                })
                firstDateTime += 24 * 60 * 60 * 1000
            }
            return list
        },
        monthPanelBinding() {
            const {displayFormat, valueFormat} = this.formatString
            const {selectDate} = this as { [key: string]: PlainDate }
            return {
                props: {
                    value: selectDate.valueString,
                    displayFormat,
                    valueFormat,
                    checkActive: this.checkMonthActive,
                    view: this.p_view,
                },
                on: {
                    change: this.onSelectMonthChange,
                },
            }
        },
    },
    render(h) {
        return (
            <div class="pl-date-base-panel-date-wrapper pl-date-base-panel">
                <transition name={`pl-transition-slide-${(this.p_view === 'month') || (this.p_view === 'year') ? 'prev' : 'next'}`}>
                    {this.p_view === 'date' ? (
                        <pl-date-base-panel class="pl-date-base-panel-date" direction="horizontal">
                            <template slot="left">
                                <pl-button icon="el-icon-d-arrow-left" mode="text" size="mini" onClick={this.prevYear}/>
                                <pl-button icon="el-icon-arrow-left" mode="text" size="mini" onClick={this.prevMonth}/>
                            </template>
                            <template slot="center">
                                <span onClick={() => this.p_view = DateView.year}>{this.selectDate.year}</span>
                                -
                                <span onClick={() => this.p_view = DateView.month}>{this.$plain.utils.zeroize(this.selectDate.month + 1)}</span>
                                {!!this.datetime && <span>12:00:00</span>}
                            </template>
                            <template slot="right">
                                <pl-button icon="el-icon-arrow-right" mode="text" size="mini" onClick={this.nextMonth}/>
                                <pl-button icon="el-icon-d-arrow-right" mode="text" size="mini" onClick={this.nextYear}/>
                            </template>

                            <template slot="content">
                                <ul class="pl-date-base-panel-date-week-list">
                                    {this.weekList.map(item => (
                                        <pl-date-base-panel-item key={item} class="pl-date-base-panel-date-week-item" item={{label: item,}}/>
                                    ))}
                                </ul>
                                <pl-list class="pl-date-base-panel-date-list" tag="ul">
                                    {this.dateList.map((item: DateBasePanelItemData, index) => (
                                        <pl-date-base-panel-item
                                            component="pl-item"
                                            componentProps={{tag: 'li'}}
                                            class={[
                                                'pl-date-base-panel-date-item',
                                                {
                                                    'pl-date-base-panel-date-item-other-month': !item.isSelectMonth,
                                                }
                                            ]}
                                            item={item}
                                            onClick={this.onClickItem}
                                            onMouseenter={this.onMouseEnterItem}
                                            key={item.isSelectMonth ? item.ipd.date : `_${index}`}
                                        />
                                    ))}
                                </pl-list>
                            </template>
                        </pl-date-base-panel>
                    ) : (
                        <pl-date-base-panel-month {...this.monthPanelBinding} direction="horizontal"/>
                    )}
                </transition>
            </div>
        )
    },
    methods: {
        /*---------------------------------------methods-------------------------------------------*/
        prevYear() {
            this.selectDate.setYear(this.selectDate.year - 1)
            this.selectDate = this.selectDate.copy()
        },
        nextYear() {
            this.selectDate.setYear(this.selectDate.year + 1)
            this.selectDate = this.selectDate.copy()
        },
        prevMonth() {
            this.selectDate.setMonthDate(this.selectDate.month - 1, 1)
            this.selectDate = this.selectDate.copy()
        },
        nextMonth() {
            this.selectDate.setMonthDate(this.selectDate.month + 1, 1)
            this.selectDate = this.selectDate.copy()
        },
        /*---------------------------------------utils-------------------------------------------*/
        getFormatString() {
            let ret = {
                displayFormat: this.displayFormat,
                valueFormat: this.valueFormat,
            }
            if (!ret.displayFormat) {
                if (!this.datetime) {
                    ret.displayFormat = 'YYYY-MM-DD'
                } else {
                    ret.displayFormat = 'YYYY-MM-DD HH:mmLss'
                }
            }
            if (!ret.valueFormat) {
                if (!this.datetime) {
                    ret.valueFormat = 'YYYY-MM-DD'
                } else {
                    ret.valueFormat = 'YYYY-MM-DD HH:mmLss'
                }
            }
            return ret
        },
        setSelectDate(val: string) {
            this.selectDate = !!val ? new PlainDate(val, this.formatString.displayFormat, this.formatString.valueFormat) : this.today
        },
        /*---------------------------------------helper-------------------------------------------*/

        /*---------------------------------------handler-------------------------------------------*/
        onClickItem(item: DateBasePanelItemData) {
            this.emitClickItem(item)
            this.emitInput(item.ipd.valueString)
        },
        checkMonthActive(item, type, option) {
            const {value} = this.formatData as { [key: string]: PlainDate }
            if (type === 'year') {
                return !value.isNull && (value.year === item)
            } else if (type === 'month') {
                return !value.isNull && (value.greaterThan(option.ipd as PlainDate, PlainDate.CompareMode.yearmonth) === 0)
            }
        },
        onSelectMonthChange(val) {
            this.selectDate.setValue(val)
            this.selectDate = this.selectDate.copy()
            this.p_view = DateView.date
        },
    },
}