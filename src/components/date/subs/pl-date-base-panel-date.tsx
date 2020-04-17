import {PlainDate} from "../../../utils/PlainDate";
import {EmitMixin} from "../../../utils/mixins";
import {DateBasePanelItemData} from "./pl-date-base-panel-item";
import {DatePublicMixin, DateView, DateViewSeq, PanelItemParam, PanelParentProvider} from "./index";

export default {
    name: "pl-date-base-panel-date",
    mixins: [
        DatePublicMixin,
        EmitMixin,
    ],
    props: {
        dateListBinding: {type: Object},
        view: {type: String, default: DateView.date},
    },
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
    render(h) {
        let {value: timePd} = this.panelItemParam
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
                                    <pl-list class="pl-date-base-panel-date-list" tag="ul" {...(this.dateListBinding || {})}>
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
            let {defaultTime: defaultTimeString} = this
            if (!defaultTimeString) {
                defaultTimeString = '12:00:00'
            }
            let defaultTime = new PlainDate(defaultTimeString, 'HH:mm:ss', 'HH:mm:ss')
            return {
                defaultTime,
            }
        },
        targetPanelItemParam() {
            if (!!this.firstDatePanel && this.firstDatePanel.provideData && this.firstDatePanel.provideData.date) {
                return this.firstDatePanel.provideData.date
            } else {
                return this.panelItemParam
            }
        },
        /**
         * 日期列表数据
         * @author  韦胜健
         * @date    2020/4/14 23:20
         */
        dateList(): DateBasePanelItemData[] {
            const {today, p_selectDate, tempPd} = this as { [key: string]: PlainDate }

            tempPd.setYear(p_selectDate.year)
            tempPd.setMonthDate(p_selectDate.month, 1)

            const currentMonthFirstDate = tempPd.copy()

            let weekDayDuration = currentMonthFirstDate.day - this.firstWeekDay
            let offsetDay = weekDayDuration === 0 ? 7 : weekDayDuration > 0 ? weekDayDuration : 7 + weekDayDuration

            let firstDateTime = new Date(currentMonthFirstDate.time - (offsetDay) * 24 * 60 * 60 * 1000).getTime()

            const panelItemParam = this.targetPanelItemParam
            const {range} = panelItemParam

            let list: DateBasePanelItemData[] = []
            for (let i = 0; i < 42; i++) {

                const ipd = tempPd.copy()
                ipd.setTime(firstDateTime)

                let item = {
                    label: ipd.date,
                    now: today.YMD === ipd.YMD,
                    disabled: this.getDisabled(ipd, panelItemParam),
                    active: this.getActive(ipd, panelItemParam),

                    hover: false,
                    hoverStart: false,
                    hoverEnd: false,

                    range,
                    ipd,
                    isSelectMonth: ipd.greaterThan(p_selectDate, PlainDate.CompareMode.yearmonth) === 0,
                }

                if (range) {
                    item.hoverStart = this.getHoverStart(ipd, panelItemParam)
                    item.hover = this.getHover(ipd, panelItemParam)
                    item.hoverEnd = this.getHoverEnd(ipd, panelItemParam)
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

            const {value, max, min} = this.panelItemParam as { [key: string]: PlainDate }
            const {defaultTime} = this.formatData

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
                if (max.YMD <= value.YMD) {
                    let tempDefaultTime = defaultTime.copy()
                    tempDefaultTime.setHms(max)
                    props.max = tempDefaultTime.valueString
                }
            }

            if (!min.isNull && !value.isNull) {
                if (min.YMD >= value.YMD) {
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
        provideData(): PanelParentProvider {
            const {value, hoverRange, valueRange} = this.panelItemParam as PanelItemParam
            return {
                year: {
                    range: false,
                    value: value,
                    hoverRange,
                    valueRange,
                },
                month: {
                    range: false,
                    value: value,
                    hoverRange,
                    valueRange,
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
         * 派发值变化事件，先校验值是否大于最大值，小于最小值，是则取最大值（最小值）
         * @author  韦胜健
         * @date    2020/4/15 10:58
         */
        emitValue(valueString) {
            const {max, min} = this.panelItemParam as { [key: string]: PlainDate }

            let vpd = new PlainDate(valueString, this.formatString.displayFormat, this.formatString.valueFormat)
            if (!max.isNull && (!!this.datetime ? (vpd.YMDHms > max.YMDHms) : (vpd.YMD > max.YMD))) {
                vpd = max
            } else if (!min.isNull && (!!this.datetime ? (vpd.YMDHms < min.YMDHms) : (vpd.YMD < min.YMD))) {
                vpd = min
            }

            this.p_value = vpd.valueString
            this.emitInput(this.p_value, vpd)
        },
        /**
         * 判断日期是否禁用
         * @author  韦胜健
         * @date    2020/4/15 10:57
         */
        getDisabled(ipd: PlainDate, {max, min}: PanelItemParam): boolean {
            if (!!max && !max.isNull && max.YMD < ipd.YMD) return true
            if (!!min && !min.isNull && min.YMD > ipd.YMD) return true
        },
        getActive(ipd: PlainDate, {value, valueRange: [start, end]}: PanelItemParam): boolean {
            if (!this.range) {
                return (!value.isNull && value.YMD === ipd.YMD)
            } else {
                return ((!start.isNull && start.YMD === ipd.YMD) || (!end.isNull && end.YMD === ipd.YMD))
            }
        },
        getHoverStart(ipd: PlainDate, {hoverRange, valueRange: [start]}: PanelItemParam): boolean {
            return !!hoverRange ? hoverRange[0].YMD === ipd.YMD : (!start.isNull && start.YMD === ipd.YMD)
        },
        getHover(ipd: PlainDate, {hoverRange, valueRange: [start, end]}: PanelItemParam): boolean {
            return !!hoverRange ? hoverRange[0].YMD < ipd.YMD && hoverRange[1].YMD > ipd.YMD :
                (!start.isNull && !end.isNull) && (start.YMD < ipd.YMD && end.YMD > ipd.YMD)
        },
        getHoverEnd(ipd: PlainDate, {hoverRange, valueRange: [, end]}: PanelItemParam): boolean {
            return !!hoverRange ? hoverRange[1].YMD === ipd.YMD : (!end.isNull && end.YMD === ipd.YMD)
        },

        /*---------------------------------------handler-------------------------------------------*/
        /**
         * 点击日期元素处理动作
         * @author  韦胜健
         * @date    2020/4/15 10:58
         */
        onClickItem({ipd}: DateBasePanelItemData) {
            const {value} = this.panelItemParam as { [key: string]: PlainDate }
            const {defaultTime} = this.formatData

            if (!value.isNull) {
                ipd.setHms(value)
            } else {
                ipd.setHms(defaultTime)
            }

            this.emitClickItem(ipd)
            this.emitValue(ipd.valueString)
        },
        /**
         * 处理选择时间处理动作
         * @author  韦胜健
         * @date    2020/4/15 10:58
         */
        onSelectTime(val) {
            const {p_selectDate} = this
            const {value} = this.panelItemParam as { [key: string]: PlainDate }
            const {defaultTime} = this.formatData

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