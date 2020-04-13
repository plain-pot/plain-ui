import PlDateBasePanelHeader from "./pl-date-base-panel-header.vue";
import {DecodeDate, PlainDate} from "../../../utils/PlainDate";

interface DateListType {
    decode: DecodeDate,
    isToday?: boolean,
    isCurrentMonth?: boolean,
    isActive?: boolean,
}

export default {
    name: "pl-date-base-panel-date",
    components: {PlDateBasePanelHeader},
    props: {},
    data() {
        return {}
    },
    computed: {
        weekList(): string[] {
            return ['一', '二', '三', '四', '五', '六', '日',]
        },
        dateList(): DateListType[] {
            let today = PlainDate.decode(new Date())
            const currentMonthFirstDate = PlainDate.decode(new Date(today.year, today.month, 1))
            let firstDateTime = new Date(currentMonthFirstDate.time - (currentMonthFirstDate.day === 1 ? 7 : currentMonthFirstDate.day - 1) * 24 * 60 * 60 * 1000).getTime()

            let list: DateListType[] = []
            for (let i = 0; i < 42; i++) {
                const decode = PlainDate.decode(new Date(firstDateTime))
                list.push({
                    decode,
                    isToday: today.year === decode.year && today.month === decode.month && today.date === decode.date,
                    isCurrentMonth: today.year === decode.year && today.month === decode.month,
                })
                firstDateTime += 24 * 60 * 60 * 1000
            }
            return list
        },
    },
    created() {

    },
    render(h) {
        return (
            <div class="pl-date-base-panel-date">
                <pl-date-base-panel-header>
                    <div slot="left">
                        <pl-button icon="el-icon-d-arrow-left" mode="text" size="mini"/>
                        <pl-button icon="el-icon-arrow-left" mode="text" size="mini"/>
                    </div>
                    <div slot="center">
                        <span>2020年04月</span>
                        <span>12:00:00</span>
                    </div>
                    <div slot="right">
                        <pl-button icon="el-icon-arrow-right" mode="text" size="mini"/>
                        <pl-button icon="el-icon-d-arrow-right" mode="text" size="mini"/>
                    </div>
                </pl-date-base-panel-header>
                <ul class="pl-date-base-panel-date-week-list">
                    {this.weekList.map(item => (
                        <li key={item} class="pl-date-base-panel-date-item">{item}</li>
                    ))}
                </ul>
                <ul class="pl-date-base-panel-date-date-list">
                    {this.dateList.map((item: DateListType, index) => (
                        <li key={index}
                            class={[
                                'pl-date-base-panel-date-item',
                                {
                                    'pl-date-base-panel-date-item-today': item.isToday,
                                    'pl-date-base-panel-date-item-current-month': item.isCurrentMonth,
                                    'pl-date-base-panel-date-item-active': item.isActive,
                                }
                            ]}>
                            <span>{item.decode.date}</span>
                        </li>
                    ))}
                </ul>
            </div>
        )
    },
    methods: {},
}