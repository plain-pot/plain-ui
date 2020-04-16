import {PlainDate} from "../../../utils/PlainDate";
import {EmitMixin} from "../../../utils/mixins";
import {DateBasePanelItemData} from "./pl-date-base-panel-item";
import {DatePublicMixin, DateView, DateViewSeq} from "./index";

export default {
    name: "pl-date-base-panel-date",
    mixins: [
        DatePublicMixin,
        EmitMixin,
    ],
    emitters: {
        emitInput: Function,
        emitClickItem: Function,
        emitSelectTime: Function,
        emitMouseenterItem: Function,
        emitSelectDateChange: Function,
    },
    watch: {
        value(val) {
            this.p_value = val
            if (!this.selectDate) {
                this.setSelectDate(val, false)
            }
        },
        selectDate(val) {
            this.p_selectDate = val
        },
    },
    data() {

        const {
            value: p_value,
        } = this

        const {displayFormat, valueFormat} = this.getFormatString()

        const today = PlainDate.today(displayFormat, valueFormat)                                                           // 今天
        const p_selectDate: PlainDate = !!this.selectDate ? this.selectDate : (!!p_value ? new PlainDate(p_value, displayFormat, valueFormat) : today.copy())         // 当前选择的年月信息对象
        const tempPd = new PlainDate(null, displayFormat, valueFormat)                                                // PlainDate临时对象
        const p_view = DateView.date                                                                                        // 当前视图
        const transitionDirection: 'prev' | 'next' = 'next'                                                                 // 当前视图切换动画

        return {
            p_value,

            today,
            p_selectDate,

            tempPd,
            p_view,
            transitionDirection,
        }
    },
    render(h) {

        let timePd = this.formatData.value
        if (timePd.isNull) timePd = this.p_selectDate

        return (
            <div class="pl-date-base-panel-date-wrapper pl-date-base-panel">
                <transition name={`pl-transition-slide-${this.transitionDirection}`}>
                    {{
                        date: (
                            <pl-date-base-panel class="pl-date-base-panel-date" direction="horizontal" key="date">
                                <template slot="left">
                                    <pl-button icon="el-icon-d-arrow-left" mode="text" size="mini" onClick={this.prevYear}/>
                                    <pl-button icon="el-icon-arrow-left" mode="text" size="mini" onClick={this.prevMonth}/>
                                </template>
                                <template slot="center">
                                    <span onclick={() => this.changeView(DateView.year)}>{this.p_selectDate.year}</span>
                                    -
                                    <span onclick={() => this.changeView(DateView.month)}>{this.$plain.utils.zeroize(this.p_selectDate.month + 1)}</span>
                                    {!!this.datetime && (
                                        <span class="pl-date-base-panel-date-time-label" onclick={() => this.changeView(DateView.time)}>
                                            {this.timePanelBinding.props.value}
                                        </span>
                                    )}
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
                                                nativeListener
                                                onClick={this.onClickItem}
                                                onMouseenter={this.emitMouseenterItem}
                                                key={item.isSelectMonth ? item.ipd.date : `_${index}`}
                                            />
                                        ))}
                                    </pl-list>
                                </template>
                            </pl-date-base-panel>
                        ),
                        month: (
                            <pl-date-base-panel-month {...this.monthPanelBinding} direction="horizontal" key={this.p_view}/>
                        ),
                        time: (
                            <pl-date-base-panel class="pl-date-base-panel-time" direction="horizontal" key="time">
                                <template slot="center">
                                    <span onclick={() => this.changeView(DateView.date)}>
                                        {timePd.year}
                                        -
                                        {this.$plain.utils.zeroize(timePd.month + 1)}
                                        -
                                        {this.$plain.utils.zeroize(timePd.date)}
                                    </span>
                                </template>
                                <template slot="content">
                                    <pl-time-panel {...this.timePanelBinding}/>
                                </template>
                            </pl-date-base-panel>
                        )
                    }[this.p_view === 'year' ? 'month' : this.p_view]}
                </transition>
            </div>
        )
    },
    computed: {
        /**
         * 周列表
         * @author  韦胜健
         * @date    2020/4/14 23:19
         */
        weekList(): string[] {
            const weeks = ['日', '一', '二', '三', '四', '五', '六']
            return weeks.slice(this.firstWeekDay).concat(weeks.slice(0, this.firstWeekDay))
        },

        /**
         * 解析当前值，最大值，最小值
         * @author  韦胜健
         * @date    2020/4/14 23:19
         */
        formatData() {
            let {p_value: value, defaultTime: defaultTimeString, max, min} = this
            let {displayFormat, valueFormat} = this.formatString

            value = new PlainDate(value, displayFormat, valueFormat)
            max = new PlainDate(max, displayFormat, valueFormat)
            min = new PlainDate(min, displayFormat, valueFormat)


            if (!defaultTimeString) {
                defaultTimeString = '12:00:00'
            }
            let defaultTime = new PlainDate(defaultTimeString, 'HH:mm:ss', 'HH:mm:ss')

            return {
                value,
                defaultTime,
                max,
                min,
            }

        },
        /**
         * 日期列表数据
         * @author  韦胜健
         * @date    2020/4/14 23:20
         */
        dateList(): DateBasePanelItemData[] {
            const {displayFormat, valueFormat} = this.formatString
            const {today, p_selectDate, tempPd} = this as { [key: string]: PlainDate }
            const {value} = this.formatData as { [key: string]: PlainDate }

            tempPd.setYear(p_selectDate.year)
            tempPd.setMonthDate(p_selectDate.month, 1)

            const currentMonthFirstDate = tempPd.copy()

            let weekDayDuration = currentMonthFirstDate.day - this.firstWeekDay
            let offsetDay = weekDayDuration === 0 ? 7 : weekDayDuration > 0 ? weekDayDuration : 7 + weekDayDuration

            let firstDateTime = new Date(currentMonthFirstDate.time - (offsetDay) * 24 * 60 * 60 * 1000).getTime()

            let list: DateBasePanelItemData[] = []
            for (let i = 0; i < 42; i++) {

                const ipd = new PlainDate(null, displayFormat, valueFormat)
                ipd.setTime(firstDateTime)

                let item = {
                    label: String(ipd.date),
                    now: today.greaterThan(ipd, PlainDate.CompareMode.date) === 0,
                    active: this.getActive(ipd),

                    hover: false,
                    hoverStart: false,
                    hoverEnd: false,

                    range: this.range,
                    disabled: this.getDisabled(i, {vpd: value, ipd, range: this.range}),

                    ipd,
                    isSelectMonth: ipd.greaterThan(p_selectDate, PlainDate.CompareMode.yearmonth) === 0,
                }

                if (this.range) {
                    item.hoverStart = this.getHoverStart(ipd)
                    item.hover = this.getHover(ipd)
                    item.hoverEnd = this.getHoverEnd(ipd)
                }

                list.push(item)
                firstDateTime += 24 * 60 * 60 * 1000
            }
            return list
        },
        /**
         * 月份面板绑定值
         * @author  韦胜健
         * @date    2020/4/15 10:56
         */
        monthPanelBinding() {
            const {displayFormat, valueFormat} = this.formatString
            const {p_selectDate} = this as { [key: string]: PlainDate }
            return {
                props: {
                    value: p_selectDate.valueString,
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
        /**
         * 时间面板绑定值
         * @author  韦胜健
         * @date    2020/4/15 10:56
         */
        timePanelBinding() {

            const {value, defaultTime, max, min} = this.formatData as { [key: string]: PlainDate }
            const timePd = value.isNull ? defaultTime : value
            const timeString = defaultTime.format(timePd.dateObject)

            const props = {
                value: timeString,
                displayFormat: 'HH:mm:ss',
                valueFormat: 'HH:mm:ss',
                max: undefined,
                min: undefined,
            }

            /*限制最大最小值*/
            if (!max.isNull && !value.isNull) {
                if (max.greaterThan(value, PlainDate.CompareMode.date) === 0) {
                    let tempDefaultTime = defaultTime.copy()
                    tempDefaultTime.setHms(max)
                    props.max = tempDefaultTime.valueString
                }
            }

            if (!min.isNull && !value.isNull) {
                if (min.lessThan(value, PlainDate.CompareMode.date) === 0) {
                    let tempDefaultTime = defaultTime.copy()
                    tempDefaultTime.setHms(max)
                    props.min = tempDefaultTime.valueString
                }
            }

            return {
                props,
                on: {
                    change: (val) => {
                        this.onSelectTime(val)
                    },
                },
            }
        },
    },
    methods: {
        /*---------------------------------------methods-------------------------------------------*/
        /**
         * 面板切换到上一年
         * @author  韦胜健
         * @date    2020/4/15 10:56
         */
        prevYear() {
            this.p_selectDate.setYear(this.p_selectDate.year - 1)
            this.setSelectDate(this.p_selectDate.copy())
        },
        /**
         * 面板切换到下一年
         * @author  韦胜健
         * @date    2020/4/15 10:56
         */
        nextYear() {
            this.p_selectDate.setYear(this.p_selectDate.year + 1)
            this.setSelectDate(this.p_selectDate.copy())
        },
        /**
         * 面板切换到上一个月份
         * @author  韦胜健
         * @date    2020/4/15 10:56
         */
        prevMonth() {
            this.p_selectDate.setMonthDate(this.p_selectDate.month - 1, 1)
            this.setSelectDate(this.p_selectDate.copy())
        },
        /**
         * 面板切换到下一个月份
         * @author  韦胜健
         * @date    2020/4/15 10:56
         */
        nextMonth() {
            this.p_selectDate.setMonthDate(this.p_selectDate.month + 1, 1)
            this.setSelectDate(this.p_selectDate.copy())
        },
        /**
         * 切换视图，确定动画方向
         * @author  韦胜健
         * @date    2020/4/15 10:57
         */
        changeView(view: DateView) {
            if (view === this.p_view) return
            const oldSeq = DateViewSeq[this.p_view]
            const newSeq = DateViewSeq[view]
            this.transitionDirection = newSeq > oldSeq ? 'next' : 'prev'
            this.p_view = view
        },
        /*---------------------------------------utils-------------------------------------------*/
        /**
         * 设置当前面板的年月
         * @author  韦胜健
         * @date    2020/4/15 10:57
         */
        setSelectDate(val: string | PlainDate, emitEvent: boolean = true) {
            if (typeof val === 'string') {
                val = (!!val ? new PlainDate(val, this.formatString.displayFormat, this.formatString.valueFormat) : this.today) as PlainDate
            }
            this.p_selectDate = val
            if (emitEvent) {
                this.emitSelectDateChange(this.p_selectDate)
            }
        },
        /**
         * 判断日期是否禁用
         * @author  韦胜健
         * @date    2020/4/15 10:57
         */
        getDisabled(item, option: { vpd: PlainDate, ipd: PlainDate, range: boolean }) {
            if (!!this.checkDisabled) {
                return this.checkDisabled(item, 'date', option)
            }
            const {max, min} = this.formatData as { max: PlainDate, min: PlainDate }

            if (!max.isNull && max.lessThan(option.ipd, PlainDate.CompareMode.date) > 0) {
                return true
            }
            if (!min.isNull && min.greaterThan(option.ipd, PlainDate.CompareMode.date) > 0) {
                return true
            }
            return false
        },
        /**
         * 派发值变化事件，先校验值是否大于最大值，小于最小值，是则取最大值（最小值）
         * @author  韦胜健
         * @date    2020/4/15 10:58
         */
        emitValue(valueString) {
            const {max, min} = this.formatData as { [key: string]: PlainDate }

            let vpd = new PlainDate(valueString, this.formatString.displayFormat, this.formatString.valueFormat)
            if (!max.isNull && vpd.greaterThan(max, this.datetime ? PlainDate.CompareMode.datetime : PlainDate.CompareMode.date) > 0) {
                vpd = max
            } else if (!min.isNull && vpd.lessThan(min, this.datetime ? PlainDate.CompareMode.datetime : PlainDate.CompareMode.date) > 0) {
                vpd = min
            }

            this.p_value = vpd.valueString
            this.emitInput(this.p_value, vpd)
        },

        getActive(ipd: PlainDate, type: DateView = DateView.date) {
            const {value} = this.formatData
            if (type === DateView.date) {
                if (!!this.firstDatePanel) {
                    return this.firstDatePanel.getActive(ipd, type)
                } else {
                    return !value.isNull && (value.greaterThan(ipd, PlainDate.CompareMode.date) === 0)
                }
            }
        },
        getHoverStart(ipd: PlainDate, type: DateView = DateView.date) {
            if (type === DateView.date) {
                if (!!this.firstDatePanel) {
                    return this.firstDatePanel.getHoverStart(ipd, type)
                } else {
                    return false
                }
            }
        },
        getHover(ipd: PlainDate, type: DateView = DateView.date) {
            if (type === DateView.date) {
                if (!!this.firstDatePanel) {
                    return this.firstDatePanel.getHover(ipd, type)
                } else {
                    return false
                }
            }
        },
        getHoverEnd(ipd: PlainDate, type: DateView = DateView.date) {
            if (type === DateView.date) {
                if (!!this.firstDatePanel) {
                    return this.firstDatePanel.getHoverEnd(ipd, type)
                } else {
                    return false
                }
            }
        },

        /*---------------------------------------handler-------------------------------------------*/
        /**
         * 点击日期元素处理动作
         * @author  韦胜健
         * @date    2020/4/15 10:58
         */
        onClickItem(item: DateBasePanelItemData) {
            const {ipd} = item as { [key: string]: PlainDate }
            const {value, defaultTime} = this.formatData as { [key: string]: PlainDate }

            if (!value.isNull) {
                ipd.setHms(value)
            } else {
                ipd.setHms(defaultTime)
            }

            this.emitClickItem(item)
            this.emitValue(item.ipd.valueString)
        },
        /**
         * 处理选择时间处理动作
         * @author  韦胜健
         * @date    2020/4/15 10:58
         */
        onSelectTime(val) {
            const {p_selectDate} = this
            const {value, defaultTime} = this.formatData as { [key: string]: PlainDate }

            const tempPd = defaultTime.copy()
            tempPd.setValue(val)

            if (value.isNull) {
                value.setYear(p_selectDate.year)
                value.setMonthDate(p_selectDate.month, p_selectDate.date)
            }

            value.setHms(tempPd)

            this.emitValue(value.valueString)
            this.emitSelectTime(val)
        },
        /**
         * 检查月份面板中，应该高亮激活的年月
         * @author  韦胜健
         * @date    2020/4/15 10:59
         */
        checkMonthActive(item, type, option) {
            const {value} = this.formatData as { [key: string]: PlainDate }
            if (type === 'year') {
                return !value.isNull && (value.year === item)
            } else if (type === 'month') {
                return !value.isNull && (value.greaterThan(option.ipd as PlainDate, PlainDate.CompareMode.yearmonth) === 0)
            }
        },
        /**
         * 月份选择面板的值发生变化之后，改变视图
         * @author  韦胜健
         * @date    2020/4/15 10:59
         */
        onSelectMonthChange(val) {
            this.p_selectDate.setValue(val)
            this.setSelectDate(this.p_selectDate.copy())
            this.changeView(DateView.date)
        },
    },
}