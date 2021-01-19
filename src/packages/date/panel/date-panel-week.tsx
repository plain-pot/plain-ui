import {designComponent} from "../../../use/designComponent";
import {DateItemData, DatePublicEmits, DatePublicProps} from "../date.utils";
import {useDate, UseDateJudgementView} from "../useDate";
import {PlDatePanelDate} from "./date-panel-date";
import {computed, reactive} from 'vue';
import {PDate, plainDate} from "../plainDate";

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
            customStatus: {
                active: () => [],
                start: () => {
                    let ret: PDate[] = []
                    if (!props.range) {
                        if (!!dateData.value.hover) {
                            ret.push(dateData.value.hover[0])
                        }
                    }
                    return ret
                },
                end: () => {
                    let ret: PDate[] = []
                    if (!props.range) {
                        if (!!dateData.value.hover) {
                            ret.push(dateData.value.hover[1])
                        }
                    }
                    return ret
                },
                hover: () => {
                    let ret: [PDate, PDate][] = []
                    if (!props.range) {
                        if (!!dateData.value.hover) {
                            ret.push(dateData.value.hover)
                        }
                    }
                    return ret
                },
            },
        })

        const externalState = reactive({
            hover: null as null | DateItemData,
        })

        const dateData = computed(() => {
            return {
                hover: !!externalState.hover ? utils.getDateData(externalState.hover.pd) : null,
            }
        })

        const dateAttrs = computed(() => ({
            class: 'pl-date-panel-week',
            firstWeekDay: props.firstWeekDay,
            onMouseenter: externalHandler.onMouseenter,
            onClick: externalHandler.onClick,
            onMouseleaveDateList: () => externalState.hover = null,
            onSelectDateChange: setSelectDate,
        }))

        const utils = {
            /**
             * 获取特定日期的所属周信息
             * @author  韦胜健
             * @date    2021/1/19 16:14
             */
            getDateData: (pd: PDate) => {
                let day = pd.day
                let firstWeekDay = props.firstWeekDay
                const weekDayDuration = day - firstWeekDay
                let offsetDay = weekDayDuration === 0 ? 0 : weekDayDuration > 0 ? weekDayDuration : 7 + weekDayDuration
                const spd = pd.useMonthDate(pd.month, pd.date - offsetDay)
                const epd = pd.useMonthDate(spd.month, spd.date + 6)
                return [spd, epd] as [PDate, PDate]
            },
        }

        const externalHandler = {
            onClick: (did: DateItemData) => {
                /*const {spd, epd} = utils.getDateData(did.pd)
                console.table({
                    '选中日期': did.pd.getDisplay(),
                    '周开始日期': spd.getDisplay(),
                    '周结束日期': epd.getDisplay(),
                })*/
            },
            onMouseenter: (did: DateItemData) => {
                if (!props.range) {
                    externalState.hover = did
                }
            },
        }

        return {
            render: () => <PlDatePanelDate {...dateAttrs.value}/>
        }
    },
})