import {EmitMixin} from "../../../utils/mixins";

export default {
    name: 'pl-date-base-panel-year',
    mixins: [EmitMixin],
    emitters: {
        emitInput: Function,
    },
    props: {
        value: {type: Number},
        range: {type: Number},
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
    },
    data() {
        const p_value: number = this.value
        const selectYear: number = this.value
        return {
            p_value,
            selectYear,
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
                                    }
                                ]}
                                    key={item.year}
                                    onclick={() => this.onClickItem(item)}>
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
                    active: value === i,
                    disabled: this.getDisabled(i)
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
            this.p_value = item.year
            this.emitInput(item.year)
        },
    },
}