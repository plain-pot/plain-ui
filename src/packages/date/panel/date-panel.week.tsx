import {designComponent} from "../../../use/designComponent";
import {DateEmitRangeType, DatePublicEmits, DatePublicProps, Dbpid} from "../date.utils";
import {useDate, UseDateJudgementView} from "../useDate";
import {computed, ref} from 'vue';
import {PlainDate, PlainDateType} from "../../../utils/PlainDate";
import {PlDateBasePanelDate} from "./date-base-panel-date";

export default designComponent({
    name: 'pl-date-panel-week',
    props: {
        ...DatePublicProps,
    },
    emits: {
        ...DatePublicEmits,
    },
    setup({props, event: {emit}}) {

        const hoverPd = ref(null as null | PlainDateType)

        const {
            today,
            state,
            model,
            startModel,
            endModel,
            displayFormat,
            valueFormat,
        } = useDate({
            props,
            emit,
            jdView: UseDateJudgementView.YMD,
            judgementForChild: {
                disabled: (ipd, view) => {
                    const {max, min} = state.topState
                    if ((!max || max.isNull) && (!min || min.isNull)) {
                        return false
                    }
                    if (!!max && !max.isNull) {
                        if (ipd[view]! > max[view]!) {
                            return true
                        }
                    }
                    if (!!min && !min.isNull) {
                        if (ipd[view]! < min[view]!) {
                            return true
                        }
                    }
                    return false
                },
                active: (ipd, view) => {
                    const {value, start, end} = WeekGetData.value
                    switch (view) {
                        case UseDateJudgementView.Y:
                            if (!props.range) {
                                return !value.pd.isNull && (value.pd.year == ipd.year)
                            } else {
                                return (!start.pd.isNull && start.pd.year == ipd.year) || (!end.pd.isNull && end.pd.year == ipd.year)
                            }
                        case UseDateJudgementView.YM:
                            if (!props.range) {
                                return !value.pd.isNull && (value.pd.YM === ipd.YM)
                            } else {
                                return (!start.pd.isNull && start.pd.YM === ipd.YM) || (!end.pd.isNull && end.pd.YM === ipd.YM)
                            }
                        case UseDateJudgementView.YMD:
                            if (!props.range) {
                                if (!value.pd.isNull) {
                                    const {start: startPd, end: endPd} = value.range!

                                    return !startPd.isNull && ((ipd.YMD === startPd.YMD) || (ipd.YMD === endPd.YMD))
                                }
                            } else {
                                if (!start.pd.isNull) {
                                    const {start: startPd, end: endPd} = start.range!
                                    if (startPd.YMD === ipd.YMD || endPd.YMD === ipd.YMD) {
                                        return true
                                    }
                                }
                                if (!end.pd.isNull) {
                                    const {start: startPd, end: endPd} = end.range!
                                    if (startPd.YMD === ipd.YMD || endPd.YMD === ipd.YMD) {
                                        return true
                                    }
                                }
                            }
                    }
                    return false
                },
                hoverStart: (ipd, view) => {
                    const {start} = WeekGetData.value
                    switch (view) {
                        case UseDateJudgementView.Y:
                            return !!state.hoverRange ? false : (!start.pd.isNull && start.pd.Y == ipd.Y)
                        case UseDateJudgementView.YM:
                            return !!state.hoverRange ? false : (!start.pd.isNull && start.pd.YM === ipd.YM)
                    }
                    return false
                },
                hoverEnd: (ipd, view) => {
                    const {end} = WeekGetData.value
                    switch (view) {
                        case UseDateJudgementView.Y:
                            return !!state.hoverRange ? false : (!end.pd.isNull && end.pd.Y == ipd.Y)
                        case UseDateJudgementView.YM:
                            return !!state.hoverRange ? false : (!end.pd.isNull && end.pd.YM === ipd.YM)
                    }
                    return false
                },
                hover: (ipd, view) => {
                    const {value, start, end, hoverStart, hoverEnd, hoverRange} = WeekGetData.value
                    switch (view) {
                        case UseDateJudgementView.Y:
                            if (!props.range) {
                                return false
                            } else {
                                return !!state.hoverRange ? false : (!start.pd.isNull && start.pd.year <= ipd.year!) && (!end.pd.isNull && end.pd.year >= ipd.year!)
                            }
                        case UseDateJudgementView.YM:
                            if (!props.range) {
                                return false
                            } else {
                                return !!state.hoverRange ? false : (!start.pd.isNull && start.pd.YM <= ipd.YM!) && (!end.pd.isNull && end.pd.YM >= ipd.YM!)
                            }
                        case UseDateJudgementView.YMD:
                            if (!!hoverPd.value) {
                                if (utils.isHover(hoverPd.value!, ipd)) {
                                    return true
                                }
                            }

                            if (!props.range) {
                                if (!value.pd.isNull) {
                                    const {start: startPd, end: endPd} = value.range!
                                    return startPd.YMD! <= ipd.YMD! && endPd.YMD! >= ipd.YMD!
                                }
                            } else {
                                if (!!hoverRange) {
                                    let startPd = hoverStart.range!.start
                                    let endPd = hoverEnd.range!.end
                                    return startPd.YMD! <= ipd.YMD! && endPd.YMD! >= ipd.YMD!
                                } else {
                                    if (!!start.range && !!end.range) {
                                        let startPd = start.range.start
                                        let endPd = end.range.end
                                        return startPd.YMD! <= ipd.YMD! && endPd.YMD! >= ipd.YMD!
                                    }
                                }
                            }
                    }
                    return false
                },
            },
            useModelConfig: {
                model: {
                    onChange: (val) => {
                        const vpd = new PlainDate(val, displayFormat, valueFormat)
                        state.selectDate = vpd.isNull ? today.copy() : vpd.copy()
                    }
                },
                start: {
                    onChange: val => {
                        const startPd = new PlainDate(val, displayFormat, valueFormat)
                        const endPd = new PlainDate(endModel.value, displayFormat, valueFormat)
                        state.valueRange = [startPd, endPd]
                        state.hoverRange = null

                        state.selectDate = startPd.isNull ? today.copy() : startPd.copy()
                    }
                },
                end: {
                    onChange: val => {
                        state.valueRange = [
                            new PlainDate(startModel.value, displayFormat, valueFormat),
                            new PlainDate(val, displayFormat, valueFormat)
                        ]
                        state.hoverRange = null
                    },
                },
            },
        })

        const WeekGetData = computed(() => {
            let {vpd} = state.topState
            const [start, end] = state.valueRange
            const {hoverRange} = state
            const [hoverStart, hoverEnd] = (hoverRange || []) as [null | PlainDateType, null | PlainDateType]
            if (!vpd) {
                vpd = new PlainDate(model.value, displayFormat, valueFormat)
            }
            return {
                value: {
                    pd: vpd,
                    range: vpd.isNull ? null : utils.getWeekPdByPlainDate(vpd),
                },
                start: {
                    pd: start,
                    range: start.isNull ? null : utils.getWeekPdByPlainDate(start),
                },
                end: {
                    pd: end,
                    range: end.isNull ? null : utils.getWeekPdByPlainDate(end),
                },
                hoverStart: {
                    pd: hoverStart,
                    range: !!hoverRange ? utils.getWeekPdByPlainDate(hoverStart!) : null,
                },
                hoverEnd: {
                    pd: hoverEnd,
                    range: !!hoverRange ? utils.getWeekPdByPlainDate(hoverEnd!) : null
                },
                hoverRange,
            }
        })

        const utils = {
            getWeekPdByPlainDate(pd: PlainDateType): { start: PlainDateType, end: PlainDateType } {
                let day = pd.day!
                let firstWeekDay = props.firstWeekDay

                const weekDayDuration = day - firstWeekDay
                let offsetDay = weekDayDuration === 0 ? 0 : weekDayDuration > 0 ? weekDayDuration : 7 + weekDayDuration

                let startPd = pd.copy()
                startPd.setMonthDate(startPd.month!, startPd.date! - offsetDay)
                let endPd = startPd.copy()
                endPd.setMonthDate(endPd.month!, endPd.date! + 6)
                return {
                    start: startPd, end: endPd
                }
            },
            /**
             * ipd是否处于weekPd所在的周范围之内
             * @author  韦胜健
             * @date    2020/4/16 16:07
             */
            isHover(weekPd: PlainDateType, ipd: PlainDateType) {
                const {start, end} = this.getWeekPdByPlainDate(weekPd)
                return ipd.YMD! >= start.YMD! && ipd.YMD! <= end.YMD!
            },
        }

        const dateAttrs = computed(() => ({
            class: 'pl-date-panel-week',
            range: true,
            displayFormat: displayFormat,
            valueFormat: valueFormat,
            modelValue: startModel.value,
            selectDate: state.selectDate,
            firstWeekDay: props.firstWeekDay,
            onMouseleaveDateList: () => hoverPd.value = null,
            onMouseenterItem: handler.onMouseenterItem,
            onClickItem: handler.onClickItem,
            onSelectDateChange: (val: PlainDateType) => state.selectDate = val
        }))

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            onClickItem(ipd: PlainDateType) {
                const {start} = utils.getWeekPdByPlainDate(ipd)

                if (!props.range) {
                    model.value = start.valueString!
                } else {
                    if (!state.hoverRange) {
                        const {start: itemStart} = utils.getWeekPdByPlainDate(ipd)

                        state.hoverRange = [itemStart, itemStart]
                        state.valueRange = [itemStart, itemStart]
                    } else {
                        const [startPd, endPd] = state.hoverRange!

                        startModel.value = startPd.valueString!
                        endModel.value = endPd.valueString!

                        state.hoverRange = null
                        state.valueRange = [startPd, endPd]

                        emit.onUpdateModelValue(startModel.value, DateEmitRangeType.start)
                        emit.onUpdateModelValue(endModel.value, DateEmitRangeType.end)
                    }
                }
            },
            onMouseenterItem({ipd}: Dbpid) {
                const {start: itemStartPd} = utils.getWeekPdByPlainDate(ipd!)
                hoverPd.value = itemStartPd

                if (!!state.hoverRange) {
                    const start = WeekGetData.value.start.range!.start
                    state.hoverRange = start.YMD! > itemStartPd.YMD! ? [itemStartPd, start] : [start, itemStartPd]
                }
            },
        }

        return {
            render: () => <PlDateBasePanelDate {...dateAttrs.value}/>
        }
    },
})