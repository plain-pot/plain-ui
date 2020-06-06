import {computed, defineComponent, Ref, ref} from "@vue/composition-api";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {PlainDate} from "@/util/PlainDate";
import {DateBasePanelItemData, DateEmitInputType, DatePublicProps, DateView} from "@/packages/date/date-utils";
import {useDate} from "@/packages/date/useDate";

export default defineComponent({
    name: 'pl-date-panel-week',
    props: {
        ...DatePublicProps,
    },
    setup(props) {

        const {emit} = useEvent({
            input: (value: string, type?: DateEmitInputType) => undefined,
            updateStart: EmitFunc,
            updateEnd: EmitFunc,
            mousedownPanel: (e: MouseEvent, type: DateEmitInputType) => undefined,
        })

        const {
            model,
            startModel,
            endModel,

            displayFormat,
            valueFormat,

            state,
        }
            =
            useDate({
                props,
                injectView: DateView.date,
                getProvideData(panelItemParam) {
                    const {value, hoverRange, valueRange} = panelItemParam
                    return {
                        year: {
                            range: true,
                            value: value,
                            hoverRange,
                            valueRange,
                        },
                        month: {
                            range: true,
                            value: value,
                            hoverRange,
                            valueRange,
                        },
                        date: {
                            range: true,
                            value: value,
                            hoverRange,
                            valueRange,
                        },
                    }
                },

                getChildDisabled(ipd: number | PlainDate, type: DateView): boolean {
                    if (type === DateView.date) {
                        ipd = ipd as PlainDate
                        const {max, min} = formatData.value
                        if (!max.isNull) {
                            if (ipd.YMD! > max.YMD!) {
                                return true
                            }
                        }
                        if (!min.isNull) {
                            if (ipd.YMD! < min.YMD!) {
                                return true
                            }
                        }
                    }
                    return false
                },
                getChildActive(ipd: number | PlainDate, type: DateView): boolean {
                    const {value, start, end} = WeekGetData.value

                    if (type === DateView.year) {
                        ipd = ipd as number

                        if (!this.props.range) {
                            return !value.pd.isNull && (value.pd.year == ipd)
                        } else {
                            return (!start.pd.isNull && start.pd.year == ipd) || (!end.pd.isNull && end.pd.year == ipd)
                        }
                    } else if (type === DateView.month) {
                        ipd = ipd as PlainDate
                        if (!props.range) {
                            return !value.pd.isNull && (value.pd.YM === ipd.YM)
                        } else {
                            return (!start.pd.isNull && start.pd.YM === ipd.YM) || (!end.pd.isNull && end.pd.YM === ipd.YM)
                        }
                    } else if (type === DateView.date) {

                        ipd = ipd as PlainDate
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
                getChildHoverStart(ipd: number | PlainDate, type: DateView): boolean {
                    const {start} = WeekGetData.value

                    if (type === DateView.year) {
                        ipd = ipd as number
                        return !!state.hoverRange ? false : (!start.pd.isNull && start.pd.year == ipd)
                    } else if (type === DateView.month) {
                        ipd = ipd as PlainDate
                        return !!state.hoverRange ? false : (!start.pd.isNull && start.pd.YM === ipd.YM)
                    }
                    return false
                },
                getChildHover(ipd: number | PlainDate, type: DateView): boolean {
                    const {value, start, end, hoverStart, hoverEnd, hoverRange} = WeekGetData.value

                    if (type === DateView.year) {
                        ipd = ipd as number
                        if (!props.range) {
                            return false
                        } else {
                            return !!state.hoverRange ? false : (!start.pd.isNull && start.pd.year <= ipd) && (!end.pd.isNull && end.pd.year >= ipd)
                        }
                    } else if (type === DateView.month) {
                        ipd = ipd as PlainDate
                        if (!props.range) {
                            return false
                        } else {
                            return !!state.hoverRange ? false : (!start.pd.isNull && start.pd.YM <= ipd.YM!) && (!end.pd.isNull && end.pd.YM >= ipd.YM!)
                        }
                    } else if (type === DateView.date) {
                        ipd = ipd as PlainDate

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
                getChildHoverEnd(ipd: number | PlainDate, type: DateView): boolean {
                    const {end,} = WeekGetData.value

                    if (type === DateView.year) {
                        ipd = ipd as number
                        return !!state.hoverRange ? false : (!end.pd.isNull && end.pd.year == ipd)
                    } else if (type === DateView.month) {
                        ipd = ipd as PlainDate
                        return !!state.hoverRange ? false : (!end.pd.isNull && end.pd.YM === ipd.YM)
                    }
                    return false
                },

                onModelChange(val) {
                    const vpd = new PlainDate(val, displayFormat.value, valueFormat.value)
                    state.selectDate = vpd.isNull ? state.today.copy() : vpd.copy()
                },
                onStartChange(val) {
                    const startPd = new PlainDate(val, displayFormat.value, valueFormat.value)
                    const endPd = new PlainDate(endModel.value, displayFormat.value, valueFormat.value)
                    state.valueRange = [startPd, endPd]
                    state.hoverRange = null

                    state.selectDate = startPd.isNull ? state.today.copy() : startPd.copy()
                },
                onEndChange(val) {
                    state.valueRange = [new PlainDate(startModel.value, displayFormat.value, valueFormat.value), new PlainDate(val, displayFormat.value, valueFormat.value)]
                    state.hoverRange = null
                },

            })

        const hoverPd = ref(null) as Ref<null | PlainDate>

        const formatData = computed(() => {
            return {
                value: new PlainDate(model.value, displayFormat.value, valueFormat.value),
                start: new PlainDate(startModel.value, displayFormat.value, valueFormat.value),
                end: new PlainDate(endModel.value, displayFormat.value, valueFormat.value),
                max: new PlainDate(props.max, displayFormat.value, valueFormat.value),
                min: new PlainDate(props.min, displayFormat.value, valueFormat.value),
            }
        })

        const WeekGetData = computed(() => {
            const {value} = formatData.value
            const [start, end] = state.valueRange
            const {hoverRange} = state
            const [hoverStart, hoverEnd] = (hoverRange || []) as [null | PlainDate, null | PlainDate]

            return {
                value: {
                    pd: value,
                    range: value.isNull ? null : utils.getWeekPdByPlainDate(value),
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

        const datePanelBinding = computed(() => {
            return {
                class: 'pl-date-panel-week',
                props: {
                    range: true,
                    displayFormat: displayFormat.value,
                    valueFormat: valueFormat.value,
                    value: startModel.value,
                    selectDate: state.selectDate,
                    firstWeekDay: props.firstWeekDay,

                    dateListBinding: {
                        nativeOn: {
                            'mouseleave': () => {
                                hoverPd.value = null
                            }
                        },
                    },
                },
                on: {
                    'mouseenter-item': handler.onMouseenterItem,
                    'click-item': handler.onClickItem,
                    'select-date-change': val => {
                        state.selectDate = val
                    }
                },
            }
        })

        /*---------------------------------------utils-------------------------------------------*/

        const utils = {
            getWeekPdByPlainDate(pd: PlainDate): { start: PlainDate, end: PlainDate } {
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
            isHover(weekPd: PlainDate, ipd: PlainDate) {
                const {start, end} = this.getWeekPdByPlainDate(weekPd)
                return ipd.YMD! >= start.YMD! && ipd.YMD! <= end.YMD!
            },
        }

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            onClickItem(ipd: PlainDate) {
                const {start} = utils.getWeekPdByPlainDate(ipd)

                if (!props.range) {
                    model.value = start.valueString
                } else {
                    if (!state.hoverRange) {
                        const {start: itemStart} = utils.getWeekPdByPlainDate(ipd)

                        state.hoverRange = [itemStart, itemStart]
                        state.valueRange = [itemStart, itemStart]
                    } else {
                        const [startPd, endPd] = state.hoverRange!

                        startModel.value = startPd.valueString
                        endModel.value = endPd.valueString

                        state.hoverRange = null
                        state.valueRange = [startPd, endPd]

                        emit.input(startModel.value, DateEmitInputType.start)
                        emit.input(endModel.value, DateEmitInputType.end)
                    }
                }
            },
            onMouseenterItem({ipd}: DateBasePanelItemData) {
                const {start: itemStartPd} = utils.getWeekPdByPlainDate(ipd!)
                hoverPd.value = itemStartPd

                if (!!state.hoverRange) {
                    const start = WeekGetData.value.start.range!.start
                    state.hoverRange = start.YMD! > itemStartPd.YMD! ? [itemStartPd, start] : [start, itemStartPd]
                }
            },
        }


        return () => (
            <pl-date-base-panel-date {...datePanelBinding.value} {...{on: {'mousedown-panel': emit.mousedownPanel}}}/>
        )
    },
})