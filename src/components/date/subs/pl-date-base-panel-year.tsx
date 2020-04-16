import {EmitMixin} from "../../../utils/mixins";
import {DateBasePanelItemData} from "./pl-date-base-panel-item";
import {DatePublicMixin, DateView} from "./index";

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
        value: {type: Number},
        start: {type: Number},
        end: {type: Number},
        max: {type: Number},
        min: {type: Number},
    },
    watch: {
        value(val) {
            if (this.p_value != val) {
                this.p_value = val
                this.transitionDirection = val == null ? 'next' : val > this.data.selectYear + 19 ? 'next' : 'prev'
                this.selectYear = this.p_value
            }
        },
        start(val) {
            if (this.p_start != val) {
                this.p_start = val
                this.valueRange = [this.p_start, this.p_end]
                this.hoverRange = null
                this.transitionDirection = val == null ? 'next' : val > this.data.selectYear + 19 ? 'next' : 'prev'
                this.selectYear = this.p_start
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
        const p_value: number = this.value
        const p_start: number = this.start
        const p_end: number = this.end

        const hoverRange: [number, number] = null
        const valueRange: [number, number] = [p_start, p_end]

        const selectYear: number = !this.range ? this.value : this.start
        const transitionDirection: 'next' | 'prev' = 'next'
        return {
            selectYear,                                                     // 当前选择的年份
            p_value,                                                        // value临时变量
            p_start,                                                        // start临时变量
            p_end,                                                          // end临时变量
            hoverRange,                                                     // 年份范围选择开始以及结束的年份
            valueRange,                                                     // [start,end]
            transitionDirection,                                            // 年份列表切换的时候的动画方向
        }
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
            let {p_value: value, selectYear} = this
            let nowYear = new Date().getFullYear()

            selectYear = selectYear || nowYear
            selectYear = selectYear - selectYear % 20
            let list: DateBasePanelItemData[] = []
            for (let i = selectYear; i < selectYear + 20; i++) {
                let item = {
                    label: i,
                    now: i === nowYear,
                    active: this.getActive(i),
                    disabled: this.getDisabled(i),
                    hoverStart: false,
                    hover: false,
                    hoverEnd: false,

                    range: this.range,
                    year: i,
                }

                if (this.range || (!!this.firstDatePanel && !!this.firstDatePanel.range)) {
                    item.hoverStart = this.getHoverStart(i)
                    item.hover = this.getHover(i)
                    item.hoverEnd = this.getHoverEnd(i)
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
        getDisabled(item, type: DateView = DateView.year) {
            if (!!this.firstDatePanel) {
                let flag = this.firstDatePanel.getDisabled(item, type)
                if (flag != null) {
                    return flag
                }
            }

            if (type === DateView.year) {
                if (this.max != null && item > this.max) {
                    return true
                }
                if (this.min != null && item < this.min) {
                    return true
                }
            }

            return false
        },
        /**
         * 检查需要激活高亮的年份
         * @author  韦胜健
         * @date    2020/4/15 11:17
         */
        getActive(item, type: DateView = DateView.year): boolean {
            if (type === DateView.year) {
                if (!!this.firstDatePanel) {
                    return this.firstDatePanel.getActive(item, type)
                } else {
                    const {p_value: value} = this
                    const [start, end] = this.valueRange
                    return !this.range ? value === item : (start == item || end == item)
                }
            }
        },
        getHoverStart(item, type: DateView = DateView.year): boolean {
            if (type === DateView.year) {
                if (!!this.firstDatePanel) {
                    return this.firstDatePanel.getHoverStart(item, type)
                } else {
                    return !!this.hoverRange ? (this.hoverRange[0] === item) : this.valueRange[0] == item
                }
            }
        },
        getHover(item, type: DateView = DateView.year): boolean {
            if (type === DateView.year) {
                if (!!this.firstDatePanel) {
                    return this.firstDatePanel.getHover(item, type)
                } else {
                    return !!this.hoverRange ? (this.hoverRange[0] < item && this.hoverRange[1] > item) : ((!!this.valueRange[0] && this.valueRange[1]) && this.valueRange[0] < item && this.valueRange[1] > item)
                }
            }
        },
        getHoverEnd(item, type: DateView = DateView.year): boolean {
            if (type === DateView.year) {
                if (!!this.firstDatePanel) {
                    return this.firstDatePanel.getHoverEnd(item, type)
                } else {
                    return !!this.hoverRange ? (this.hoverRange[1] === item) : this.valueRange[1] == item
                }
            }
        },
        /*---------------------------------------methods-------------------------------------------*/
        /**
         * 切换上一个年份列表
         * @author  韦胜健
         * @date    2020/4/15 11:17
         */
        prevYearList() {
            this.transitionDirection = 'prev'
            this.selectYear = this.data.selectYear - 20
        },
        /**
         *
         * @author  切换下一个年份列表
         * @date    2020/4/15 11:18
         */
        nextYearList() {
            this.transitionDirection = 'next'
            this.selectYear = this.data.selectYear + 20
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