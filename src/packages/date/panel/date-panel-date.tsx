import {designComponent} from "../../../use/designComponent";
import {DateItemData, DatePublicEmits, DatePublicProps, DateView, DefaultDateFormatString, SlideTransitionDirection} from "../date.utils";
import {useDate, UseDateJudgementView} from "../useDate";
import {PropType, computed} from 'vue';
import {plainDate} from "../plainDate";

export const PlDatePanelDate = designComponent({
    name: 'pl-date-panel-date',
    props: {
        ...DatePublicProps,
        displayFormat: {type: String, default: DefaultDateFormatString.date},
        valueFormat: {type: String, default: DefaultDateFormatString.date},
        view: {type: String as PropType<DateView>, default: DateView.date},
    },
    emits: {
        ...DatePublicEmits,
    },
    setup({props, event: {emit}}) {

        const {
            state,
            today,
            getStatus,
        } = useDate({
            props,
            emit,
            jdView: UseDateJudgementView.Y,
        })

        const utils = {
            setSelectDate: () => {

            }
        }

        const weekList = computed(() => {
            const weeks = ['日', '一', '二', '三', '四', '五', '六']
            return weeks.slice(props.firstWeekDay).concat(weeks.slice(0, props.firstWeekDay))
        })

        const dateList = computed(() => {
            const {selectDate} = state
            let pd = today.useYMD([selectDate.year, selectDate.month, 1])
            const currentMonthFirstDate = pd.clone()
            let weekDayDuration = currentMonthFirstDate.day - props.firstWeekDay
            let offsetDay = weekDayDuration === 0 ? 7 : weekDayDuration > 0 ? weekDayDuration : 7 + weekDayDuration
            let firstDateTime = new Date(currentMonthFirstDate.time! - (offsetDay) * 24 * 60 * 60 * 1000).getTime()
            let list: DateItemData[] = []
            for (let i = 0; i < 42; i++) {
                pd = pd.useTime(firstDateTime)
                let item = {
                    label: pd.date,
                    pd,
                    ...getStatus(pd),
                    external: {
                        isSelectMonth: pd.YM === selectDate.YM,
                    },
                }
                list.push(item)
                firstDateTime += 24 * 60 * 60 * 1000
            }
            return list
        })

        const defaultTimePd = computed(() => {
            return !!props.defaultTime ?
                plainDate(props.defaultTime, {displayFormat: props.displayFormat, valueFormat: props.valueFormat}) :
                plainDate.today(props.displayFormat, props.valueFormat)
        })

        const monthAttrs = computed(() => ({
            /*modelValue: state.selectDate.YM,
            displayFormat,
            valueFormat,
            view: viewModel.value,
            onChange: handler.onSelectMonthChange,*/
        }))

    },
})