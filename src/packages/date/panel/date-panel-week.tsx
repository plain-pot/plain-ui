import {designComponent} from "../../../use/designComponent";
import {DatePublicEmits, DatePublicProps} from "../date.utils";
import {useDate, UseDateJudgementView} from "../useDate";
import {PlDatePanelDate} from "./date-panel-date";
import {computed} from 'vue';

export const PlDatePanelWeek = designComponent({
    name: 'pl-date-panel-week',
    props: {
        ...DatePublicProps,
    },
    emits: {
        ...DatePublicEmits,
    },
    setup({props, event: {emit}}) {

        const {
            state,
            today,
            handler,
            displayFormat,
            valueFormat,
            setSelectDate,
        } = useDate({
            props,
            emit,
            jdView: UseDateJudgementView.YMD,
        })

        const dateAttrs = computed(() => ({
            class: 'pl-date-panel-week',
            displayFormat: displayFormat,
            valueFormat: valueFormat,
            selectDate: state.selectDate,
            firstWeekDay: props.firstWeekDay,
            onMouseenter: handler.onMouseenter,
            onClick: handler.onClick,
            // onMouseleaveDateList: () => hoverPd.value = null,
            onSelectDateChange: setSelectDate,
        }))

        return {
            render: () => <PlDatePanelDate {...dateAttrs.value}/>
        }
    },
})