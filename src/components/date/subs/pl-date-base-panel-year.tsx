import {EmitMixin} from "../../../utils/mixins";
import {DateBasePanelItemData} from "./pl-date-base-panel-item";
import {DatePublicMixin} from "./index";
import {PlainDate} from "../../../utils/PlainDate";

interface YearItemParam {
    max: number,
    min: number,
    value: number,
    hoverRange: [number, number] | null,
    valueRange: [number, number],
    range: boolean,
}

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
                this.valueRange = [this.p_start, this.p_end]
                this.hoverRange = null
                this.transitionDirection = val == null ? 'next' : val > this.data.selectYear + 19 ? 'next' : 'prev'
                this.p_selectDate.setYear(this.p_start || this.today.year)
                this.setSelectDate(this.p_selectDate)
            }
        },
        end(val) {
            if (this.p_end != val) {
                this.p_end = val
                this.valueRange = [this.p_start, this.p_end]
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
        data() {
            let {p_selectDate, today} = this as { [key: string]: PlainDate }
            const {range} = this
            const {max, min, p_value: value, hoverRange, valueRange} = this
            const yearItemParam: YearItemParam = {max, min, value, hoverRange, valueRange, range}

            let selectYear = p_selectDate.year
            selectYear = selectYear - selectYear % 20

            let list: DateBasePanelItemData[] = []
            for (let i = selectYear; i < selectYear + 20; i++) {
                let item = {
                    label: i,
                    now: i === today.year,
                    disabled: this.getDisabled(i, yearItemParam),
                    active: this.getActive(i, yearItemParam),
                    hoverStart: false,
                    hover: false,
                    hoverEnd: false,

                    range,
                    year: i,
                }

                if (this.range || (!!this.firstDatePanel && !!this.firstDatePanel.range)) {
                    item.hoverStart = this.getHoverStart(i, yearItemParam)
                    item.hover = this.getHover(i, yearItemParam)
                    item.hoverEnd = this.getHoverEnd(i, yearItemParam)
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
        getDisabled(item, {max, min}: YearItemParam) {
            if (max != null && item > max) {
                return true
            }
            if (min != null && item < min) {
                return true
            }
        },
        /**
         * 检查需要激活高亮的年份
         * @author  韦胜健
         * @date    2020/4/15 11:17
         */
        getActive(item, {value, valueRange: [valueStart, valueEnd], range}: YearItemParam): boolean {
            return !range ? value === item : (valueStart == item || valueEnd == item)
        },
        getHoverStart(item, {hoverRange, valueRange}: YearItemParam): boolean {
            return !!hoverRange ? (hoverRange[0] == item) : valueRange[0] == item
        },
        getHover(item, {hoverRange, valueRange}: YearItemParam): boolean {
            return !!hoverRange ? (hoverRange[0] < item && hoverRange[1] > item) : ((!!valueRange[0] && valueRange[1]) && valueRange[0] < item && valueRange[1] > item)
        },
        getHoverEnd(item, {hoverRange, valueRange}: YearItemParam): boolean {
            return !!hoverRange ? (hoverRange[1] == item) : valueRange[1] == item
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
        onClickItem(item) {

            if (!this.range) {
                this.p_value = item.year
                this.emitInput(item.year)
            } else {
                if (!this.hoverRange) {
                    this.hoverRange = [item.year, item.year]
                    this.valueRange = [item.year, item.year]
                } else {

                    const [start, end] = this.hoverRange

                    this.p_start = start
                    this.p_end = end

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
        onMouseEnterItem(item) {
            item = item.year
            if (!!this.hoverRange) {
                let mid = this.valueRange[0]
                this.hoverRange = mid > item ? [item, mid] : [mid, item]
            }
        },
    },
}