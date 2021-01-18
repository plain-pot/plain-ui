import {designComponent} from "../../../use/designComponent";
import {DateItemData, DatePublicEmits, DatePublicProps, DateView, DefaultDateFormatString, SlideTransitionDirection} from "../date.utils";
import {PropType, computed} from 'vue';
import {useDate, UseDateJudgementView} from "../useDate";

export const PlDatePanelMonth = designComponent({
    name: 'pl-date-panel-month',
    props: {
        ...DatePublicProps,
        displayFormat: {type: String, default: DefaultDateFormatString.month},
        valueFormat: {type: String, default: DefaultDateFormatString.month},
        view: {type: String as PropType<DateView>, default: DateView.month},
    },
    emits: {
        ...DatePublicEmits,
    },
    setup({props, event: {emit}}) {

        const months = computed(() => ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月',])

        const {
            state,
            setSelectDate,
            today,
            getStatus,
            handler,
        } = useDate({
            props,
            emit,
            jdView: UseDateJudgementView.YM,
            getSlide: (pd) => pd.year > state.selectDate.year ? SlideTransitionDirection.next : SlideTransitionDirection.prev,
        })

        const methods = {
            /**
             * 切换到上一年
             * @author  韦胜健
             * @date    2020/4/15 11:12
             */
            prevYear() {
                state.slide = SlideTransitionDirection.prev
                setSelectDate(today.useYear(today.year - 1))
            },
            /**
             * 切换到下一年
             * @author  韦胜健
             * @date    2020/4/15 11:12
             */
            nextYear() {
                state.slide = SlideTransitionDirection.prev
                setSelectDate(today.useYear(today.year - 1))
            },
        }

        const monthList = computed(() => {
            const {selectDate} = state
            let list: DateItemData[] = [];
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach(i => {
                /*today.useYMD(today);
                tempPd.setYear(selectDate.year!)
                tempPd.setMonthDate(i, 1)
                const ipd = tempPd.copy()
                const item = {
                    label: months.value[i],
                    ipd,
                    ...getStatus(ipd),
                }
                list.push(item)*/
            })
            return list
        })

        return {
            render: () => 11
        }
    },
})