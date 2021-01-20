import {designComponent} from "../../../use/designComponent";
import {DatePublicEmits, DatePublicProps} from "../date.utils";
import {PlDatePanelMonth} from "./date-panel-month";
import {PDate} from "../plainDate";
import {computed} from 'vue';
import {useDateWeek} from "../useDateWeek";
import {UseDateJudgementView} from "../useDate";

export const PlDatePanelQuarter = designComponent({
    name: 'pl-date-panel-quarter',
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
            jdView: UseDateJudgementView.YM,
            getDateData: (pd: PDate) => {
                let month = pd.month
                let quarter = Math.floor(month / 3)
                const spd = pd.useMonthDate(quarter * 3, 1)
                const epd = pd.useMonthDate(spd.month + 2, 1)
                return [spd, epd]
            },
        })

        const monthAttrs = computed(() => ({
            class: 'pl-date-panel-quarter',
            selectDate: useDateData.state.selectDate,
            onMouseenter: externalHandler.onMouseenter,
            onClick: externalHandler.onClick,
            onMouseleaveList: externalHandler.onMouseleaveDateList,
            onSelectDateChange: useDateData.setSelectDate,
            showQuarter: true,
        }))

        return {
            render: () => <PlDatePanelMonth {...monthAttrs.value}/>
        }
    },
})