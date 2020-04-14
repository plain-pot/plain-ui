import {EmitMixin} from "../../../utils/mixins";

export default {
    name: 'pl-date-base-panel-year',
    mixins: [EmitMixin],
    emitters: {
        emitInput: Function,
        emitUpdateStart: Function,
        emitUpdateEnd: Function,
    },
    props: {
        value: {type: Number},
        range: {type: Boolean},
        start: {type: Number},
        end: {type: Number},
        max: {type: Number},
        min: {type: Number},
        checkDisabled: {type: Function},
    },
    watch: {
        value(val) {
            this.p_value = val
        },
        start(val) {
            this.p_start = val
            this.valueRange = [this.p_start, this.p_end]
            this.hoverRange = null
            this.transitionDirection = val == null ? 'next' : val > this.data.selectYear + 19 ? 'next' : 'prev'
            this.selectYear = this.p_start
        },
        end(val) {
            this.p_end = val
            this.valueRange = [this.p_start, this.p_end]
            this.hoverRange = null
        },
    },
    data() {
        const p_value: number = this.value
        const p_start: number = this.start
        const p_end: number = this.end

        const hoverRange: [number, number] = null
        const valueRange: [number, number] = [p_start, p_end]

        const selectYear: number = !this.range ? this.value : this.start
        return {
            selectYear,
            p_value,
            p_start,
            p_end,
            hoverRange,
            valueRange,
        }
    },
    render(h) {
        return (
            <pl-date-base-panel class="pl-date-base-panel-year">
                <template slot="left">
                    <pl-button icon="el-icon-d-arrow-left" mode="text" size="mini" onClick={this.prevYearList}/>
                </template>
                <template slot="center">
                    <span>{this.data.title}</span>
                </template>
                <template slot="right">
                    <pl-button icon="el-icon-d-arrow-right" mode="text" size="mini" onClick={this.nextYearList}/>
                </template>
                <template slot="content">
                    <transition name={`pl-transition-slide-${this.transitionDirection}`}>
                        <ul class="pl-date-base-panel-year-list" key={this.data.selectYear}>
                            {this.data.list.map(item => (
                                <li class={[
                                    'pl-date-base-panel-year-item',
                                    {
                                        'pl-date-base-panel-year-item-now': item.now,
                                        'pl-date-base-panel-year-item-active': item.active,
                                        'pl-date-base-panel-year-item-disabled': item.disabled,
                                        'pl-date-base-panel-year-item-hover-start': item.hoverStart,
                                        'pl-date-base-panel-year-item-hover': item.hover,
                                        'pl-date-base-panel-year-item-hover-end': item.hoverEnd,
                                    }
                                ]}
                                    {...{on: this.getItemListener(item)}}
                                    key={item.year}>
                                    <div><span>{item.year}</span></div>
                                </li>
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
            selectYear = Number(String(selectYear).slice(0, -1) + '0')
            let list = []
            for (let i = selectYear; i < selectYear + 20; i++) {
                list.push({
                    year: i,
                    now: i === nowYear,
                    active: !this.range ? value === i : (this.valueRange[0] == i || this.valueRange[1] == i),
                    disabled: this.getDisabled(i),
                    hoverStart: !!this.hoverRange ? (this.hoverRange[0] === i) : this.valueRange[0] == i,
                    hoverEnd: !!this.hoverRange ? (this.hoverRange[1] === i) : this.valueRange[1] == i,
                    hover: !!this.hoverRange ? (this.hoverRange[0] < i && this.hoverRange[1] > i) : ((!!this.valueRange[0] && this.valueRange[1]) && this.valueRange[0] < i && this.valueRange[1] > i),
                })
            }

            const transitionDirection: 'next' | 'prev' = 'next'

            return {
                list,
                title: `${selectYear}-${selectYear + 19}`,
                selectYear,
                transitionDirection,
            }
        },
    },
    methods: {
        /*---------------------------------------utils-------------------------------------------*/
        getDisabled(item) {
            if (!!this.checkDisabled) {
                return this.checkDisabled(item)
            }
            if (this.max != null && item > this.max) {
                return true
            }
            if (this.min != null && item < this.min) {
                return true
            }
            return false
        },
        getItemListener(item) {
            let ret: { [key: string]: Function } = {}

            ret.click = () => {
                this.onClickItem(item)
            }

            if (this.range) {
                ret.mouseenter = () => {
                    this.onMouseEnterItem(item)
                }
            }
            return ret
        },
        /*---------------------------------------methods-------------------------------------------*/
        prevYearList() {
            this.transitionDirection = 'prev'
            this.selectYear = this.data.selectYear - 20
        },
        nextYearList() {
            this.transitionDirection = 'next'
            this.selectYear = this.data.selectYear + 20
        },
        /*---------------------------------------handler-------------------------------------------*/
        onClickItem(item) {
            if (item.disabled) {
                return
            }

            if (!this.range) {
                this.p_value = item.year
                this.emitInput(item.year)
            } else {
                if (!this.hoverRange) {
                    this.hoverRange = [item.year, item.year]
                    this.valueRange = [item.year]
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
        onMouseEnterItem(item) {
            item = item.year
            if (!!this.hoverRange) {
                let mid = this.valueRange[0]
                this.hoverRange = mid > item ? [item, mid] : [mid, item]
            }
        },
    },
}