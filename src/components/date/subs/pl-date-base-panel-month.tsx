import {PlainDate} from "../../../utils/PlainDate";
import {EmitMixin} from "../../../utils/mixins";

export default {
    name: 'pl-date-base-panel-month',
    mixins: [EmitMixin],
    emitters: {
        emitInput: Function,
    },
    props: {
        value: {type: String},
        displayFormat: {type: String},
        valueFormat: {type: String},
        max: {type: String},
        min: {type: String},
        range: {type: String},
        start: {type: String},
        end: {type: String},
        checkDisabled: {type: String},
    },
    watch: {
        value(val) {
            this.p_value = val
        },
        start(val) {
            this.p_start = val
        },
        end(val) {
            this.p_end = val
        },
    },
    data() {
        const {value, start, end, displayFormat, valueFormat} = this

        const vpd = new PlainDate(value, displayFormat, valueFormat)
        const startpd = new PlainDate(start, displayFormat, valueFormat)
        const today = PlainDate.decode(new Date())

        let selectYear

        if (!this.range) {
            selectYear = !vpd.isNull ? vpd.year : today.year
        } else {
            selectYear = !startpd.isNull ? startpd.year : today.year
        }

        const tempPd = new PlainDate(null, this.displayFormat, this.valueFormat)

        const p_value = value
        const p_start = start
        const p_end = end

        return {
            today,
            selectYear,
            tempPd,

            p_value,
            p_start,
            p_end,
        }
    },
    render(h) {
        return (
            <pl-date-base-panel class="pl-date-base-panel-month">
                <template slot="left">
                    <pl-button icon="el-icon-d-arrow-left" mode="text" size="mini" onClick={this.prevYear}/>
                </template>
                <template slot="center">
                    <span>{this.selectYear}</span>
                </template>
                <template slot="right">
                    <pl-button icon="el-icon-d-arrow-right" mode="text" size="mini" onClick={this.nextYear}/>
                </template>
                <template slot="content">
                    <ul class="pl-date-base-panel-month-list">
                        {this.monthList.map(item => (
                            <li class={[
                                "pl-date-base-panel-month-item",
                                {
                                    'pl-date-base-panel-month-item-now': item.now,
                                    'pl-date-base-panel-month-item-active': item.active,
                                    'pl-date-base-panel-month-item-disabled': item.disabled,
                                }
                            ]} {...{on: this.getItemListener(item)}}>
                                <div><span>{this.months[item.month]}</span></div>
                            </li>
                        ))}
                    </ul>
                </template>
            </pl-date-base-panel>
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
        monthList() {
            let ret = [];
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach(item => {
                ret.push({
                    month: item,
                    disabled: this.getDisabled(item),
                    now: this.selectYear === this.today.year && (this.today.month == item),
                    active: (!this.formatData.value.isNull && this.formatData.value.year == this.selectYear && this.formatData.value.month == item),
                })
            })
            return ret
        },
    },
    methods: {
        /*---------------------------------------methods-------------------------------------------*/
        prevYear() {
            this.selectYear--
        },
        nextYear() {
            this.selectYear++
        },
        /*---------------------------------------utils-------------------------------------------*/
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
        /*---------------------------------------handler-------------------------------------------*/
        onClickItem(item) {
            if (!this.range) {
                this.tempPd.setYear(this.selectYear)
                this.tempPd.setMonthDate(item.month, 1)
                this.p_value = this.tempPd.valueString
                this.emitInput(this.p_value)
            }
        },
        onMouseEnterItem(item) {

        },
    },
}
