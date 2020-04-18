import {PlainDate} from "../../../utils/PlainDate";
import {EmitMixin} from "../../../utils/mixins";
import {DateBasePanelItemData} from "./pl-date-base-panel-item";
import {DatePublicMixin, DateView, PanelItemParam, PanelParentProvider} from "./index";

export default {
    name: 'pl-date-base-panel-month',
    mixins: [
        EmitMixin,
        DatePublicMixin,
    ],
    props: {
        displayFormat: {type: String, default: 'YYYY-MM'},
        valueFormat: {type: String, default: 'YYYY-MM'},
        view: {type: String, default: DateView.month},
    },
    emitters: {
        emitInput: Function,
        emitUpdateStart: Function,
        emitUpdateEnd: Function,
        emitClickPanel: Function,
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

                const startPd = new PlainDate(this.p_start, this.formatString.displayFormat, this.formatString.valueFormat)
                const endPd = new PlainDate(this.p_end, this.formatString.displayFormat, this.formatString.valueFormat)

                this.valueRange = [startPd, endPd]
                this.hoverRange = null

                this.setSelectYear(startPd.year)
            }
        },
        end(val) {
            if (this.p_end != val) {
                this.p_end = val

                const startPd = new PlainDate(this.p_start, this.formatString.displayFormat, this.formatString.valueFormat)
                const endPd = new PlainDate(this.p_end, this.formatString.displayFormat, this.formatString.valueFormat)

                this.valueRange = [startPd, endPd]
                this.hoverRange = null
            }
        },
    },
    render(h) {
        return (
            <div class="pl-date-base-panel-month-wrapper pl-date-base-panel" direction={this.direction} onClick={this.emitClickPanel}>
                <transition name={`pl-transition-slide-${this.p_view === 'year' ? 'prev' : 'next'}`}>
                    {this.p_view === 'month' ? (
                        <pl-date-base-panel class="pl-date-base-panel-month" direction="horizontal">
                            <template slot="left">
                                <pl-button icon="el-icon-d-arrow-left" mode="text" size="mini" onClick={this.prevYear}/>
                            </template>
                            <template slot="center">
                                <span onClick={() => this.p_view = DateView.year}>{this.p_selectDate.year}</span>
                            </template>
                            <template slot="right">
                                <pl-button icon="el-icon-d-arrow-right" mode="text" size="mini" onClick={this.nextYear}/>
                            </template>
                            <template slot="content">
                                <transition name={`pl-transition-slide-${this.transitionDirection}`}>
                                    <ul class="pl-date-base-panel-month-list" key={this.p_selectDate.year} direction="vertical">
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
         * 月份面板绑定值
         * @author  韦胜健
         * @date    2020/4/15 11:12
         */
        yearPanelBinding() {
            const {p_selectDate} = this
            return {
                props: {
                    value: p_selectDate.year,
                },
                on: {
                    change: this.onSelectYearChange,
                },
            }
        },
        targetPanelItemParam(): PanelItemParam {
            if (!!this.firstDatePanel && this.firstDatePanel.provideData && this.firstDatePanel.provideData.month) {
                return this.firstDatePanel.provideData.month
            } else {
                return this.panelItemParam
            }
        },
        /**
         * 月份列表
         * @author  韦胜健
         * @date    2020/4/15 11:12
         */
        monthList() {

            const {p_selectDate, today} = this as { [key: string]: PlainDate }

            const panelItemParam: PanelItemParam = this.targetPanelItemParam
            const {range} = panelItemParam


            let ret: DateBasePanelItemData[] = [];
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach(i => {

                this.tempPd.setYear(p_selectDate.year)
                this.tempPd.setMonthDate(i, 1)
                const ipd = this.tempPd.copy()

                const item = {
                    label: this.months[i],
                    now: today.YM === ipd.YM,

                    disabled: this.getDisabled(ipd, panelItemParam),
                    active: this.getActive(ipd, panelItemParam),
                    hoverStart: false,
                    hoverEnd: false,
                    hover: false,

                    range,
                    month: i,
                    ipd,
                }

                if (range || (!!this.firstDatePanel && !!this.firstDatePanel.range)) {
                    item.hoverStart = this.getHoverStart(ipd, panelItemParam)
                    item.hoverEnd = this.getHoverEnd(ipd, panelItemParam)
                    item.hover = this.getHover(ipd, panelItemParam)
                }

                ret.push(item)
            })
            return ret
        },
        provideData(): PanelParentProvider {
            const {value, hoverRange, valueRange, range} = this.panelItemParam as PanelItemParam
            return {
                year: {
                    range,
                    value: value,
                    hoverRange,
                    valueRange,
                }
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
            this.p_selectDate.setYear(this.p_selectDate.year - 1)
            this.setSelectDate(this.p_selectDate)
        },
        /**
         * 切换到下一年
         * @author  韦胜健
         * @date    2020/4/15 11:12
         */
        nextYear() {
            this.transitionDirection = 'next'
            this.p_selectDate.setYear(this.p_selectDate.year + 1)
            this.setSelectDate(this.p_selectDate)
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
            this.transitionDirection = this.p_selectDate.year > target ? 'prev' : 'next'
            this.p_selectDate.setYear(target)
            this.setSelectDate(this.p_selectDate)
        },
        /**
         * 检查需要禁用的月份
         * @author  韦胜健
         * @date    2020/4/15 11:13
         */
        getDisabled(ipd: PlainDate, {max, min}: PanelItemParam): boolean {
            if (!!this.firstDatePanel && !!this.firstDatePanel.getChildDisabled) {
                return this.firstDatePanel.getChildDisabled(ipd, DateView.month)
            }
            if (!!max && !max.isNull && max.YM < ipd.YM) return true
            if (!!min && !min.isNull && min.YM > ipd.YM) return true
        },
        /**
         * 检查当前需要激活的月份
         * @author  韦胜健
         * @date    2020/4/15 11:13
         */
        getActive(ipd: PlainDate, {range, value, valueRange: [start, end]}: PanelItemParam): boolean {
            if (!!this.firstDatePanel && !!this.firstDatePanel.getChildActive) {
                return this.firstDatePanel.getChildActive(ipd, DateView.month)
            }
            if (!range) {
                if (!Array.isArray(value)) {
                    value = [value] as PlainDate[]
                }
                return value.some(iv => (!iv.isNull && iv.YM === ipd.YM))
            } else {
                return ((!start.isNull && start.YM === ipd.YM) || (!end.isNull && end.YM === ipd.YM))
            }
        },
        getHoverStart(ipd: PlainDate, {hoverRange, valueRange: [start]}: PanelItemParam): boolean {
            if (!!this.firstDatePanel && !!this.firstDatePanel.getChildHoverStart) {
                return this.firstDatePanel.getChildHoverStart(ipd, DateView.month)
            }
            return !!hoverRange ? hoverRange[0].YM === ipd.YM : (!start.isNull && start.YM === ipd.YM)
        },
        getHover(ipd: PlainDate, {hoverRange, valueRange: [start, end]}: PanelItemParam): boolean {
            if (!!this.firstDatePanel && !!this.firstDatePanel.getChildHover) {
                return this.firstDatePanel.getChildHover(ipd, DateView.month)
            }
            return !!hoverRange ? hoverRange[0].YM < ipd.YM && hoverRange[1].YM > ipd.YM :
                (!start.isNull && !end.isNull) && (start.YM < ipd.YM && end.YM > ipd.YM)
        },
        getHoverEnd(ipd: PlainDate, {hoverRange, valueRange: [, end]}: PanelItemParam): boolean {
            if (!!this.firstDatePanel && !!this.firstDatePanel.getChildHoverEnd) {
                return this.firstDatePanel.getChildHoverEnd(ipd, DateView.month)
            }
            return !!hoverRange ? hoverRange[1].YM === ipd.YM : (!end.isNull && end.YM === ipd.YM)
        },
        /*---------------------------------------handler-------------------------------------------*/
        /**
         * 处理点击月份元素的动作
         * @author  韦胜健
         * @date    2020/4/15 11:13
         */
        onClickItem(item) {

            const temp = this.p_selectDate.copy()
            temp.setMonthDate(item.month, 1)

            if (!this.range) {
                this.p_value = temp.valueString
                this.emitInput(this.p_value)
            } else {

                if (!this.hoverRange) {

                    temp.setMonthDate(item.month, 1)
                    this.hoverRange = [temp, temp]
                    this.valueRange = [temp, temp]

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
                let midPd = this.valueRange[0] as PlainDate
                const temp = this.p_selectDate.copy()
                temp.setMonthDate(item.month, 1)
                this.hoverRange = midPd.YM > temp.YM ? [temp, midPd] : [midPd, temp]
            }
        },
        /**
         * 处理年份面板选择年份变化动作
         * @author  韦胜健
         * @date    2020/4/15 11:14
         */
        onSelectYearChange(val) {
            this.p_view = DateView.month
            this.p_selectDate.setYear(val)
            this.setSelectDate(this.p_selectDate)
        },
    },
}
