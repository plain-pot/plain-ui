import {PlainDate} from "../../../utils/PlainDate";
import {EmitMixin} from "../../../utils/mixins";
import {DateBasePanelItemData} from "./pl-date-base-panel-item";
import {DatePublicMixin, DateView} from "./index";

interface MonthGetDataType {
    hoverRange?: [PlainDate, PlainDate],
    startPd?: PlainDate,
    endPd?: PlainDate,
    vpd?: PlainDate
}

export default {
    name: 'pl-date-base-panel-month',
    mixins: [
        EmitMixin,
        DatePublicMixin,
    ],
    emitters: {
        emitInput: Function,
        emitUpdateStart: Function,
        emitUpdateEnd: Function,
    },
    watch: {
        value(val) {
            if (this.p_value != val) {
                this.p_value = val

                const vpd = new PlainDate(val, this.displayFormat, this.valueFormat)
                this.setSelectYear(vpd.year)
            }
        },
        start(val) {
            if (this.p_start != val) {
                this.p_start = val

                this.valueRange = [new PlainDate(val, this.displayFormat, this.valueFormat), new PlainDate(this.p_end, this.displayFormat, this.valueFormat)]
                this.hoverRange = null

                const startPd = new PlainDate(val, this.displayFormat, this.valueFormat)
                this.setSelectYear(startPd.year)
            }
        },
        end(val) {
            if (this.p_end != val) {
                this.p_end = val

                this.valueRange = [new PlainDate(this.p_start, this.displayFormat, this.valueFormat), new PlainDate(val, this.displayFormat, this.valueFormat)]
                this.hoverRange = null
            }
        },
    },
    data() {
        const {value, start, end, displayFormat, valueFormat} = this

        const vpd = new PlainDate(value, displayFormat, valueFormat)
        const startPd = new PlainDate(start, displayFormat, valueFormat)
        const endPd = new PlainDate(end, displayFormat, valueFormat)
        const today = PlainDate.today(displayFormat, valueFormat)

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

        const p_view = this.view || DateView.year

        return {
            today,                                                                  // 今天
            selectYear,                                                             // 选择的年份
            tempPd,                                                                 // PlainDate临时变量，用来设值以及格式化值

            p_value,                                                                // value临时变量
            p_start,                                                                // start临时变量
            p_end,                                                                  // end临时变量

            hoverRange,                                                             // 当前鼠标hover的开始年份以及结束年份
            valueRange,                                                             // [start,end]

            transitionDirection,                                                    // 年月视图切换时的动画
            p_view,                                                                 // 当前视图
        }
    },
    render(h) {
        return (
            <div class="pl-date-base-panel-month-wrapper pl-date-base-panel" direction={this.direction}>
                <transition name={`pl-transition-slide-${this.p_view === 'year' ? 'prev' : 'next'}`}>
                    {this.p_view === 'month' ? (
                        <pl-date-base-panel class="pl-date-base-panel-month" direction="horizontal">
                            <template slot="left">
                                <pl-button icon="el-icon-d-arrow-left" mode="text" size="mini" onClick={this.prevYear}/>
                            </template>
                            <template slot="center">
                                <span onClick={() => this.p_view = DateView.year}>{this.selectYear}</span>
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
        /**
         * 格式化值
         * @author  韦胜健
         * @date    2020/4/15 11:11
         */
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
        /**
         * 月份面板绑定值
         * @author  韦胜健
         * @date    2020/4/15 11:12
         */
        yearPanelBinding() {
            return {
                props: {
                    value: this.selectYear,
                    checkActive: this.checkYearActive,
                    start: this.formatData.start.year,
                    end: this.formatData.end.year,
                },
                on: {
                    change: this.onSelectYearChange,
                },
            }
        },
        /**
         * 月份列表
         * @author  韦胜健
         * @date    2020/4/15 11:12
         */
        monthList() {

            let ret: DateBasePanelItemData[] = [];
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach(i => {

                this.tempPd.setYear(this.selectYear)
                this.tempPd.setMonthDate(i, 1)
                const ipd = this.tempPd.copy()

                const item = {
                    label: this.months[i],
                    disabled: this.getDisabled(i),
                    now: this.selectYear === this.today.year && (this.today.month == i),
                    active: this.getActive(ipd),

                    hoverStart: false,
                    hoverEnd: false,
                    hover: false,

                    range: this.range,
                    month: i,
                    ipd,
                }

                if (this.range || (!!this.firstDatePanel && !!this.firstDatePanel.range)) {
                    item.hoverStart = this.getHoverStart(ipd)
                    item.hoverEnd = this.getHoverEnd(ipd)
                    item.hover = this.getHover(ipd)
                }

                ret.push(item)
            })
            return ret
        },
        MonthGetData(): MonthGetDataType {
            const {value} = this.formatData
            const [start, end] = this.valueRange
            return {
                hoverRange: this.hoverRange,
                startPd: start,
                endPd: end,
                vpd: value,
            }
        },
    },
    methods: {
        /*---------------------------------------methods-------------------------------------------*/
        /**
         * 切换到上一年
         * @author  韦胜健
         * @date    2020/4/15 11:12
         */
        prevYear() {
            this.transitionDirection = 'prev'
            this.selectYear--
        },
        /**
         * 切换到下一年
         * @author  韦胜健
         * @date    2020/4/15 11:12
         */
        nextYear() {
            this.transitionDirection = 'next'
            this.selectYear++
        },
        /*---------------------------------------utils-------------------------------------------*/
        /**
         * 设置当前选择的年份
         * @author  韦胜健
         * @date    2020/4/15 11:12
         */
        setSelectYear(target) {
            if (!target) {
                target = this.today.year
            }
            this.transitionDirection = this.selectYear > target ? 'prev' : 'next'
            this.selectYear = target
        },
        /**
         * 检查需要禁用的月份
         * @author  韦胜健
         * @date    2020/4/15 11:13
         */
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
        /**
         * 检查当前需要激活的月份
         * @author  韦胜健
         * @date    2020/4/15 11:13
         */
        getActive(ipd: number | PlainDate, type: DateView = DateView.month): boolean {
            const {vpd, startPd, endPd} = this.MonthGetData as MonthGetDataType

            if (type === DateView.month) {
                ipd = ipd as PlainDate
                if (!!this.firstDatePanel) {
                    return this.firstDatePanel.getActive(ipd, type)
                } else {
                    if (!this.range) {
                        return (!vpd.isNull && vpd.year == this.selectYear && vpd.month == ipd.month)
                    } else {
                        return ((!startPd.isNull && startPd.greaterThan(ipd, PlainDate.CompareMode.yearmonth) === 0) || (!endPd.isNull && endPd.greaterThan(ipd, PlainDate.CompareMode.yearmonth) === 0))
                    }
                }
            } else if (type === DateView.year) {
                ipd = ipd as number
                if (!this.range) {
                    return (!vpd.isNull && vpd.year === ipd)
                } else {
                    return (!startPd.isNull && startPd.year === ipd) || (!endPd.isNull && endPd.year === ipd)
                }
            }
        },
        getHoverStart(ipd: number | PlainDate, type: DateView = DateView.month): boolean {

            const {startPd, hoverRange} = this.MonthGetData as MonthGetDataType

            switch (type) {
                case DateView.month:
                    ipd = ipd as PlainDate
                    if (!!this.firstDatePanel) {
                        return this.firstDatePanel.getHoverStart(ipd, type)
                    } else {
                        return !!hoverRange ?
                            hoverRange[0].greaterThan(ipd, PlainDate.CompareMode.yearmonth) === 0 :
                            (!startPd.isNull && startPd.greaterThan(ipd, PlainDate.CompareMode.yearmonth) === 0)
                    }
                case DateView.year:
                    ipd = ipd as number
                    return !!hoverRange ?
                        false :
                        (!startPd.isNull && startPd.year === ipd)
            }
        },
        getHover(ipd: number | PlainDate, type: DateView = DateView.month): boolean {
            const {startPd, endPd, hoverRange} = this.MonthGetData as MonthGetDataType

            switch (type) {
                case DateView.month:
                    ipd = ipd as PlainDate
                    if (!!this.firstDatePanel) {
                        return this.firstDatePanel.getHover(ipd, type)
                    } else {
                        return !!hoverRange ?
                            hoverRange[0].lessThan(ipd, PlainDate.CompareMode.yearmonth) > 0 && hoverRange[1].greaterThan(ipd, PlainDate.CompareMode.yearmonth) > 0 :
                            (!startPd.isNull && startPd.lessThan(ipd, PlainDate.CompareMode.yearmonth) > 0) && (!endPd.isNull && endPd.greaterThan(ipd, PlainDate.CompareMode.yearmonth) > 0)
                    }
                case DateView.year:
                    ipd = ipd as number
                    return !!hoverRange ?
                        false :
                        ((!startPd.isNull && startPd.year < ipd) && (!endPd.isNull && endPd.year > ipd))
            }
        },
        getHoverEnd(ipd: number | PlainDate, type: DateView = DateView.month): boolean {
            const {endPd, hoverRange} = this.MonthGetData as MonthGetDataType

            switch (type) {
                case DateView.month:
                    ipd = ipd as PlainDate
                    if (!!this.firstDatePanel) {
                        return this.firstDatePanel.getHoverEnd(ipd, type)
                    } else {
                        return !!hoverRange ? hoverRange[1].greaterThan(ipd, PlainDate.CompareMode.yearmonth) === 0 : (!endPd.isNull && endPd.greaterThan(ipd, PlainDate.CompareMode.yearmonth) === 0)
                    }
                case DateView.year:
                    ipd = ipd as number
                    return !!hoverRange ?
                        false :
                        (!endPd.isNull && endPd.year === ipd)
            }
        },
        /*---------------------------------------handler-------------------------------------------*/
        /**
         * 处理点击月份元素的动作
         * @author  韦胜健
         * @date    2020/4/15 11:13
         */
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
        /**
         * 处理鼠标进入月份元素的动作
         * @author  韦胜健
         * @date    2020/4/15 11:13
         */
        onMouseEnterItem(item) {
            if (!!this.hoverRange) {
                let midpd = this.valueRange[0] as PlainDate
                this.tempPd.setYear(this.selectYear)
                this.tempPd.setMonthDate(item.month, 1)
                item = this.tempPd.copy()
                this.hoverRange = midpd.greaterThan(item, PlainDate.CompareMode.yearmonth) > 0 ? [item, midpd] : [midpd, item]
            }
        },
        /**
         * 处理年份面板选择年份变化动作
         * @author  韦胜健
         * @date    2020/4/15 11:14
         */
        onSelectYearChange(val) {
            this.p_view = DateView.month
            this.setSelectYear(val)
        },
        /**
         * 设置年份面板中，需要激活高亮的年份
         * @author  韦胜健
         * @date    2020/4/15 11:14
         */
        checkYearActive(val, type, option) {
            if (!!this.checkActive) {
                return this.checkActive(val, type, option)
            }
            const {value, start, end} = this.formatData as { start: PlainDate, end: PlainDate, value: PlainDate }
            if (!this.range) {
                return (!value.isNull && value.year === val)
            } else {
                return (!start.isNull && start.year === val) || (!end.isNull && end.year === val)
            }
        },
    },
}
