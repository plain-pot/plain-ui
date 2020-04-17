import {EmitMixin} from "../../../utils/mixins";
import {DateBasePanelItemData} from "./pl-date-base-panel-item";
import {DatePublicMixin, PanelItemParam} from "./index";
import {PlainDate} from "../../../utils/PlainDate";

export default {
    name: 'pl-date-base-panel-year',
    mixins: [
        EmitMixin,
        DatePublicMixin,
    ],
    emitters: {
        emitInput: Function,
        emitUpdateStart: Function,
        emitUpdateEnd: Function,
    },
    props: {
        displayFormat: {type: String, default: 'YYYY'},
        valueFormat: {type: String, default: 'YYYY'},
    },
    watch: {
        value(val) {
            if (this.p_value != val) {
                this.p_value = val
                this.transitionDirection = val == null ? 'next' : val > this.data.selectYear + 19 ? 'next' : 'prev'
                this.p_selectDate.setYear(this.p_value || this.today.year)
                this.setSelectDate(this.p_selectDate)
            }
        },
        start(val) {
            if (this.p_start != val) {
                this.p_start = val

                const startPd = new PlainDate(this.p_start, this.formatString.displayFormat, this.formatString.valueFormat)
                const endPd = new PlainDate(this.p_end, this.formatString.displayFormat, this.formatString.valueFormat)

                this.valueRange = [startPd, endPd]
                this.hoverRange = null

                this.transitionDirection = val == null ? 'next' : val > this.data.selectYear + 19 ? 'next' : 'prev'
                this.p_selectDate.setYear(this.p_start || this.today.year)
                this.setSelectDate(this.p_selectDate)
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
    data() {
        return {}
    },
    render(h) {
        return (
            <pl-date-base-panel class="pl-date-base-panel-year" direction={this.direction}>
                <template slot="left">
                    <pl-button icon="el-icon-d-arrow-left" mode="text" size="mini" onClick={this.prevYearList}/>
                </template>
                <template slot="center">
                    <span class="pl-date-base-panel-header-static-label">{this.data.title}</span>
                </template>
                <template slot="right">
                    <pl-button icon="el-icon-d-arrow-right" mode="text" size="mini" onClick={this.nextYearList}/>
                </template>
                <template slot="content">
                    <transition name={`pl-transition-slide-${this.transitionDirection}`}>
                        <ul class="pl-date-base-panel-year-list" key={this.data.selectYear} direction="vertical">
                            {this.data.list.map(item => (
                                <pl-date-base-panel-item
                                    class="pl-date-base-panel-year-item"
                                    item={item}
                                    onClick={this.onClickItem}
                                    onMouseenter={this.onMouseEnterItem}
                                    key={item.year}
                                />
                            ))}
                        </ul>
                    </transition>
                </template>
            </pl-date-base-panel>
        )
    },
    computed: {
        targetPanelItemParam(): PanelItemParam {
            if (!!this.firstDatePanel && this.firstDatePanel.provideData && this.firstDatePanel.provideData.year) {
                return this.firstDatePanel.provideData.year
            } else {
                return this.panelItemParam
            }
        },
        data() {
            let {p_selectDate, today} = this as { [key: string]: PlainDate }
            let selectYear = p_selectDate.year
            selectYear = selectYear - selectYear % 20

            const panelItemPanel: PanelItemParam = this.targetPanelItemParam
            const {range} = panelItemPanel

            let list: DateBasePanelItemData[] = []
            for (let i = selectYear; i < selectYear + 20; i++) {

                this.tempPd.setYear(i)
                const ipd = this.tempPd.copy()

                let item: DateBasePanelItemData = {
                    label: i,
                    now: i === today.year,
                    disabled: this.getDisabled(i, panelItemPanel),
                    active: this.getActive(i, panelItemPanel),
                    hoverStart: false,
                    hover: false,
                    hoverEnd: false,
                    ipd,

                    range,
                    year: i,
                }

                if (range) {
                    item.hoverStart = this.getHoverStart(i, panelItemPanel)
                    item.hover = this.getHover(i, panelItemPanel)
                    item.hoverEnd = this.getHoverEnd(i, panelItemPanel)
                }

                list.push(item)
            }

            return {
                list,                                               // 年份可选列表
                title: `${selectYear}-${selectYear + 19}`,          // 年份面板标题，展示列表中年份的范围
                selectYear,                                         // 当前选择的年份
            }
        },
    },
    methods: {
        /*---------------------------------------utils-------------------------------------------*/
        /**
         * 检查年份是否需要禁用
         * @author  韦胜健
         * @date    2020/4/15 11:17
         */
        getDisabled(item, {max, min}: PanelItemParam) {
            if (!!max && !max.isNull && max.year < item) return true
            if (!!min && !min.isNull && min.year > item) return true
        },
        /**
         * 检查需要激活高亮的年份
         * @author  韦胜健
         * @date    2020/4/15 11:17
         */
        getActive(item, {value, valueRange: [valueStart, valueEnd], range}: PanelItemParam): boolean {
            return !range ? value.year === item : (valueStart.year == item || valueEnd.year == item)
        },
        getHoverStart(item, {hoverRange, valueRange}: PanelItemParam): boolean {
            return !!hoverRange ? (hoverRange[0].year == item) : valueRange[0].year == item
        },
        getHover(item, {hoverRange, valueRange}: PanelItemParam): boolean {
            return !!hoverRange ? (hoverRange[0].year < item && hoverRange[1].year > item) : ((!valueRange[0].isNull && !valueRange[1].isNull) && valueRange[0].year < item && valueRange[1].year > item)
        },
        getHoverEnd(item, {hoverRange, valueRange}: PanelItemParam): boolean {
            return !!hoverRange ? (hoverRange[1].year == item) : valueRange[1].year == item
        },
        /*---------------------------------------methods-------------------------------------------*/
        /**
         * 切换上一个年份列表
         * @author  韦胜健
         * @date    2020/4/15 11:17
         */
        prevYearList() {
            this.transitionDirection = 'prev'
            this.p_selectDate.setYear(this.data.selectYear - 20)
            this.setSelectDate(this.p_selectDate)
        },
        /**
         *
         * @author  切换下一个年份列表
         * @date    2020/4/15 11:18
         */
        nextYearList() {
            this.transitionDirection = 'next'
            this.p_selectDate.setYear(this.data.selectYear + 20)
            this.setSelectDate(this.p_selectDate)
        },
        /*---------------------------------------handler-------------------------------------------*/
        /**
         * 处理点击分年元素动作
         * @author  韦胜健
         * @date    2020/4/15 11:18
         */
        onClickItem({ipd}: DateBasePanelItemData) {

            if (!this.range) {
                this.p_value = ipd.year
                this.emitInput(ipd.year)
            } else {
                if (!this.hoverRange) {
                    this.hoverRange = [ipd, ipd]
                    this.valueRange = [ipd, ipd]
                } else {

                    const [start, end] = this.hoverRange

                    this.p_start = start.year
                    this.p_end = end.year

                    this.hoverRange = null
                    this.valueRange = [start, end]

                    this.emitUpdateStart(this.p_start)
                    this.emitInput(this.p_start, 'start')
                    this.emitUpdateEnd(this.p_end)
                    this.emitInput(this.p_end, 'end')
                }
            }
        },
        /**
         * 处理鼠标进入年份元素动作
         * @author  韦胜健
         * @date    2020/4/15 11:18
         */
        onMouseEnterItem({ipd}) {
            if (!!this.hoverRange) {
                let mid = this.valueRange[0]
                this.hoverRange = mid.year > ipd.year ? [ipd, mid] : [mid, ipd]
            }
        },
    },
}