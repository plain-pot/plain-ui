import {designComponent} from "../../../use/designComponent";
import {DateItemData, DatePublicEmits, DatePublicProps} from "../date.utils";
import {useDate, UseDateJudgementView} from "../useDate";
import {PlDatePanelDate} from "./date-panel-date";
import {computed, reactive} from 'vue';
import {PDate} from "../plainDate";
import {toArray} from "../../../utils/toArray";

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
            handler,
            setSelectDate,
        } = useDate({
            props,
            emit,
            jdView: UseDateJudgementView.YMD,
            customStatus: {
                active: () => {
                    let ret: PDate[] = []
                    if (!props.range) {
                        if (!!dateData.value.value) {
                            dateData.value.value.forEach((item) => ret.push(...item))
                        }
                    } else {
                        if (!!dateData.value.range.value) {
                            ret.push(...dateData.value.range.value.start)
                            ret.push(...dateData.value.range.value.end)
                        }
                    }
                    return ret
                },
                start: () => {
                    let ret: PDate[] = []
                    if (!props.range) {
                        if (!!dateData.value.current) {
                            ret.push(dateData.value.current[0])
                        }
                        if (!!dateData.value.value) {
                            dateData.value.value.forEach(([spd]) => ret.push(spd))
                        }
                    } else {
                        if (!!dateData.value.range.value) {
                            ret.push(dateData.value.range.value.start[0])
                            ret.push(dateData.value.range.value.end[0])
                        } else if (!!dateData.value.range.hover) {
                            ret.push(dateData.value.range.hover.start[0])
                            ret.push(dateData.value.range.hover.end[0])
                        }
                    }
                    return ret
                },
                end: () => {
                    let ret: PDate[] = []
                    if (!props.range) {
                        if (!!dateData.value.current) {
                            ret.push(dateData.value.current[1])
                        }
                        if (!!dateData.value.value) {
                            dateData.value.value.forEach(([, epd]) => ret.push(epd))
                        }
                    } else {
                        if (!!dateData.value.range.value) {
                            ret.push(dateData.value.range.value.start[1])
                            ret.push(dateData.value.range.value.end[1])
                        } else if (!!dateData.value.range.hover) {
                            ret.push(dateData.value.range.hover.start[1])
                            ret.push(dateData.value.range.hover.end[1])
                        }
                    }
                    return ret
                },
                hover: () => {
                    let ret: [PDate, PDate][] = []
                    if (!props.range) {
                        if (!!dateData.value.current) {
                            ret.push(dateData.value.current)
                        }
                        if (!!dateData.value.value) {
                            dateData.value.value.forEach((item) => ret.push(item))
                        }
                    } else {
                        if (!!dateData.value.range.value) {
                            ret.push([dateData.value.range.value.start[0], dateData.value.range.value.end[1]])
                        } else if (!!dateData.value.range.hover) {
                            ret.push([dateData.value.range.hover.start[0], dateData.value.range.hover.end[1]])
                        }
                    }
                    return ret
                },
            },
        })

        const externalState = reactive({
            current: null as null | DateItemData,
        })

        const dateData = computed(() => {
            return {
                value: !state.pd.vpd ? null : toArray(state.pd.vpd).map(item => utils.getDateData(item)),
                range: {
                    hover: !state.topState.range.hover ? null : {
                        start: utils.getDateData(state.topState.range.hover[0]),
                        end: utils.getDateData(state.topState.range.hover[1]),
                    },
                    value: !(!state.topState.range.hover && (!!state.pd.spd && !!state.pd.epd)) ? null : {
                        start: utils.getDateData(state.pd.spd),
                        end: utils.getDateData(state.pd.epd),
                    },
                },
                current: !!externalState.current ? utils.getDateData(externalState.current.pd) : null,
            }
        })

        const dateAttrs = computed(() => ({
            class: 'pl-date-panel-week',
            firstWeekDay: props.firstWeekDay,
            selectDate: state.selectDate,
            onMouseenter: externalHandler.onMouseenter,
            onClick: externalHandler.onClick,
            onMouseleaveDateList: () => externalState.current = null,
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
                const epd = spd.useMonthDate(spd.month, spd.date + 6)
                return [spd, epd] as [PDate, PDate]
            },
        }

        const externalHandler = {
            onClick: (did: DateItemData) => {
                const [spd] = utils.getDateData(did.pd)
                handler.onClick({...did, pd: spd})
                /*const {spd, epd} = utils.getDateData(did.pd)
                console.table({
                    '选中日期': did.pd.getDisplay(),
                    '周开始日期': spd.getDisplay(),
                    '周结束日期': epd.getDisplay(),
                })*/
            },
            onMouseenter: (did: DateItemData) => {
                if (!props.range) {
                    externalState.current = did
                } else {
                    handler.onMouseenter(did)
                }
            },
        }

        return {
            render: () => <PlDatePanelDate {...dateAttrs.value}/>
        }
    },
})