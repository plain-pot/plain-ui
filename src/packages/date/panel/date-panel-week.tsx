import {designComponent} from "../../../use/designComponent";
import {DatePublicEmits, DatePublicProps} from "../date.utils";
import {PlDatePanelDate} from "./date-panel-date";
import {computed} from 'vue';
import {PDate} from "../plainDate";
import {useDateWeek} from "../useDateWeek";

export const PlDatePanelWeek = designComponent({
    name: 'pl-date-panel-week',
    props: {
        ...DatePublicProps,
    },
    emits: {
        ...DatePublicEmits,
    },
    setup({props, event: {emit}}) {

        const {useDateData, externalHandler} = useDateWeek({
            props,
            emit,
            getDateData: (pd: PDate) => {
                let day = pd.day
                let firstWeekDay = props.firstWeekDay
                const weekDayDuration = day - firstWeekDay
                let offsetDay = weekDayDuration === 0 ? 0 : weekDayDuration > 0 ? weekDayDuration : 7 + weekDayDuration
                const spd = pd.useMonthDate(pd.month, pd.date - offsetDay)
                const epd = spd.useMonthDate(spd.month, spd.date + 6)
                return [spd, epd]
            },
        })

        const dateAttrs = computed(() => ({
            class: 'pl-date-panel-week',
            firstWeekDay: props.firstWeekDay,
            selectDate: useDateData.state.selectDate,
            onMouseenter: externalHandler.onMouseenter,
            onClick: externalHandler.onClick,
            onMouseleaveDateList: externalHandler.onMouseleaveDateList,
            onSelectDateChange: useDateData.setSelectDate,
        }))

        return {
            render: () => <PlDatePanelDate {...dateAttrs.value}/>
        }
    },
})