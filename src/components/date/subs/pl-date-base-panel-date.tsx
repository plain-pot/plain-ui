import {DecodeDate, PlainDate} from "../../../utils/PlainDate";
import {EmitMixin} from "../../../utils/mixins";

interface DateItemType {
    decode: DecodeDate,
    isToday?: boolean,
    isSelectMonth?: boolean,
    isActive?: boolean,
}

export default {
    name: "pl-date-base-panel-date",
    mixins: [
        EmitMixin,
    ],
    emitters: {
        emitInput: Function,
        emitClickItem: Function,
    },
    props: {
        value: {type: Date},
        firstWeekDay: {type: Number, default: 1},
    },
    watch: {
        value(val) {
            this.selectDate = !!val ? new Date(val) : new Date()
        },
    },
    data() {
        const selectDate = !!this.value ? new Date(this.value) : new Date()
        return {
            selectDate,
        }
    },
    computed: {
        weekList(): string[] {
            const weeks = ['日', '一', '二', '三', '四', '五', '六']
            return weeks.slice(this.firstWeekDay).concat(weeks.slice(0, this.firstWeekDay))
        },
        decode() {
            const today = PlainDate.decode(new Date())
            const selectDate = PlainDate.decode(this.selectDate || today)
            const value = PlainDate.decode(this.value)
            return {
                today,
                selectDate,
                value,
            }
        },
        dateList(): DateItemType[] {

            const {today, selectDate, value} = this.decode

            const currentMonthFirstDate = PlainDate.decode(new Date(selectDate.year, selectDate.month, 1))
            let weekDayDuration = currentMonthFirstDate.day - this.firstWeekDay
            let offsetDay = weekDayDuration === 0 ? 7 : weekDayDuration > 0 ? weekDayDuration : 7 + weekDayDuration

            let firstDateTime = new Date(currentMonthFirstDate.time - (offsetDay) * 24 * 60 * 60 * 1000).getTime()

            let list: DateItemType[] = []
            for (let i = 0; i < 42; i++) {
                const decode = PlainDate.decode(new Date(firstDateTime))
                list.push({
                    decode,
                    isToday: today.year === decode.year && today.month === decode.month && today.date === decode.date,
                    isSelectMonth: selectDate.year === decode.year && selectDate.month === decode.month,
                    isActive: !!value && (value.year === decode.year && value.month === decode.month && value.date === decode.date)
                })
                firstDateTime += 24 * 60 * 60 * 1000
            }
            return list
        },
    },
    render(h) {
        return (
            <pl-date-base-panel class="pl-date-base-panel-date">
                <template slot="left">
                    <pl-button icon="el-icon-d-arrow-left" mode="text" size="mini" onClick={this.prevYear}/>
                    <pl-button icon="el-icon-arrow-left" mode="text" size="mini" onClick={this.prevMonth}/>
                </template>
                <template slot="center">
                    <span>{this.decode.selectDate.year}-{this.$plain.utils.zeroize(this.decode.selectDate.month + 1)}</span>
                    {/*<span>12:00:00</span>*/}
                </template>
                <template slot="right">
                    <pl-button icon="el-icon-arrow-right" mode="text" size="mini" onClick={this.nextMonth}/>
                    <pl-button icon="el-icon-d-arrow-right" mode="text" size="mini" onClick={this.nextYear}/>
                </template>

                <template slot="content">
                    <ul class="pl-date-base-panel-date-week-list">
                        {this.weekList.map(item => (
                            <li key={item} class="pl-date-base-panel-date-item"><div><span>{item}</span></div></li>
                        ))}
                    </ul>
                    <pl-list class="pl-date-base-panel-date-date-list" tag="ul">
                        {this.dateList.map((item: DateItemType, index) => (
                            <pl-item key={item.isSelectMonth ? item.decode.date : `_${index}`}
                                     tag="li"
                                     onClick={() => this.onClickItem(item)}
                                     class={[
                                         'pl-date-base-panel-date-item',
                                         {
                                             'pl-date-base-panel-date-item-today': item.isToday,
                                             'pl-date-base-panel-date-item-select-month': item.isSelectMonth,
                                             'pl-date-base-panel-date-item-active': item.isActive,
                                         }
                                     ]}>
                                <div><span>{item.decode.date}</span></div>
                            </pl-item>
                        ))}
                    </pl-list>
                </template>

            </pl-date-base-panel>
        )
    },
    methods: {
        /*---------------------------------------methods-------------------------------------------*/
        prevYear() {
            const {selectDate} = this.decode
            this.selectDate = new Date(selectDate.year - 1, selectDate.month, selectDate.date)
        },
        nextYear() {
            const {selectDate} = this.decode
            this.selectDate = new Date(selectDate.year + 1, selectDate.month, selectDate.date)
        },
        prevMonth() {
            const {selectDate} = this.decode
            this.selectDate = new Date(selectDate.year, selectDate.month - 1, selectDate.date)
        },
        nextMonth() {
            const {selectDate} = this.decode
            this.selectDate = new Date(selectDate.year, selectDate.month + 1, selectDate.date)
        },
        /*---------------------------------------handler-------------------------------------------*/
        onClickItem(item: DateItemType) {
            this.emitClickItem(item)
            this.emitInput(item.decode.dateObject)
        },
    },
}