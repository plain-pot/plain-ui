import {designComponent} from "../../../use/designComponent";
import {DateEmitRangeType, DatePublicEmits, DatePublicProps, DateView, Dbpid} from "../date.utils";
import {useDate, UseDateJudgementView} from "../useDate";
import {computed, nextTick} from 'vue';
import {PlainDate, PlainDateType} from "../../../utils/PlainDate";

export default designComponent({
    name: 'pl-date-panel-date-range',
    props: {
        ...DatePublicProps,

        range: {type: Boolean, default: true},
        view: {type: String, default: DateView.date}
    },
    emits: {
        ...DatePublicEmits,
        mousedown: (e: MouseEvent, type: DateEmitRangeType) => true,
    },
    setup({props, event: {emit}}) {

        const {
            today,
            tempPd,
            state,
            startModel,
            endModel,
            displayFormat,
            valueFormat,
        } = useDate({
            props,
            emit,
            useModelConfig: {
                model: {
                    autoEmit: false,
                },
                start: {
                    autoEmit: false,
                    onChange: val => {
                        tempPd.setValue(val)
                        const startPd = tempPd.copy()
                        tempPd.setValue(endModel.value)
                        const endPd = tempPd.copy()
                        state.valueRange = [startPd, endPd]
                        state.hoverRange = null
                        state.selectDate = startPd.isNull ? today.copy() : startPd.copy()
                    },
                },
                end: {
                    autoEmit: false,
                    onChange: val => {
                        tempPd.setValue(startModel.value)
                        const startPd = tempPd.copy()
                        tempPd.setValue(val)
                        const endPd = tempPd.copy()
                        state.valueRange = [startPd, endPd]
                        state.hoverRange = null
                    }
                }
            },

            /*这个属性在这个组件里是没有用的，因为range肯定是顶层组件，不会再有useDate父组件了*/
            jdView: UseDateJudgementView.YMD,
        })

        const formatData = computed(() => {

            const start = startModel.value
            const end = endModel.value
            let defaultTimeString = props.defaultTime

            const startDate = new PlainDate(start, displayFormat, valueFormat)
            const endDate = new PlainDate(end, displayFormat, valueFormat)

            if (!defaultTimeString) defaultTimeString = '12:00:00'
            let defaultTime = new PlainDate(defaultTimeString, 'HH:mm:ss', 'HH:mm:ss')

            const startTime = defaultTime.copy()
            if (!startDate.isNull) {
                startTime.setHms(startDate)
            }

            const endTime = defaultTime.copy()
            if (!endDate.isNull) {
                endTime.setHms(endDate)
            }

            return {
                defaultTime,
                startDate,
                endDate,
                startTime,
                endTime,
            }
        })

        const binding = computed(() => {

            const selectDate = state.selectDate.copy()
            const publicProps = Object.keys(DatePublicProps).reduce((ret, key) => {
                (ret as any)[key] = (props as any)[key]
                return ret
            }, {})
            Object.assign(publicProps, {
                displayFormat: displayFormat,
                valueFormat: valueFormat,
                range: true
            })
            const start = {
                ...publicProps,
                selectDate: selectDate,
                modelValue: startModel.value,

                onSelectDateChange: (val: PlainDateType) => state.selectDate = val.copy(),
                onMouseenterItem: handler.onMouseenterItem,
                onClickItem: handler.onClickItem,
                onSelectTime: (val: string) => handler.onSelectTime(val, DateEmitRangeType.start),
                onMousedown: (e: MouseEvent) => emit.mousedown(e, DateEmitRangeType.start),
            }

            const endSelectDate = selectDate.copy()
            endSelectDate.setMonthDate(endSelectDate.month! + 1, 1)
            const end = {
                ...publicProps,
                selectDate: endSelectDate,
                modelValue: endModel.value,

                onSelectDateChange: (val: PlainDateType) => {
                    val.setMonthDate(val.month! - 1, 1)
                    state.selectDate = val.copy()
                },
                onMouseenterItem: handler.onMouseenterItem,
                onClickItem: handler.onClickItem,
                onSelectTime: (val: string) => handler.onSelectTime(val, DateEmitRangeType.end),
                onMousedown: (e: MouseEvent) => emit.mousedown(e, DateEmitRangeType.end),
            }

            return {
                start,
                end
            }
        })

        const utils = {
            emitValue(startPd: PlainDateType, endPd: PlainDateType) {

                const {max, min} = state.topState

                if (!!max && !max.isNull && (props.datetime ? max.YMDHms < startPd.YMDHms! : max.YMD < startPd.YMD!)) {
                    startPd = max
                } else if (!!min && !min.isNull && (props.datetime ? min.YMDHms > startPd.YMDHms! : min.YMD > startPd.YMD!)) {
                    startPd = min
                }

                if (!!max && !max.isNull && (props.datetime ? max.YMDHms < endPd.YMDHms! : max.YMD < endPd.YMD!)) {
                    endPd = max
                } else if (!!min && !min.isNull && (props.datetime ? min.YMDHms > endPd.YMDHms! : min.YMD > endPd.YMD!)) {
                    endPd = min
                }

                startModel.value = startPd.valueString!
                endModel.value = endPd.valueString!

                state.hoverRange = null
                state.valueRange = [startPd, endPd]

                emit.updateStart(startModel.value)
                emit.updateModelValue(startModel.value, DateEmitRangeType.start)
                emit.updateEnd(endModel.value)
                emit.updateModelValue(endModel.value, DateEmitRangeType.end)
            },
        }

        const handler = {
            async onClickItem(ipd: PlainDateType) {
                const {startTime, endTime} = formatData.value
                const {hoverRange} = state

                if (!hoverRange) {
                    ipd = ipd.copy()
                    state.hoverRange = [ipd, ipd]
                    state.valueRange = [ipd, ipd]
                } else {
                    let [startPd, endPd] = hoverRange
                    startPd = startPd.copy()
                    endPd = endPd.copy()

                    startPd.setHms(startTime)
                    endPd.setHms(endTime)

                    if ((props.datetime ? startPd.YMDHms! > endPd.YMDHms! : startPd.YMD! > endPd.YMD!)) {
                        endPd = startPd
                    }

                    utils.emitValue(startPd, endPd)
                }
            },
            onMouseenterItem({ipd}: Dbpid) {
                if (!!state.hoverRange) {
                    let midPd = state.valueRange[0]
                    ipd = ipd!.copy()
                    state.hoverRange = midPd.YMD! > ipd.YMD! ? [ipd, midPd] : [midPd, ipd]
                }
            },
            async onSelectTime(val: string, type: DateEmitRangeType) {
                await nextTick()

                let {selectDate} = state
                let {startDate, endDate, defaultTime} = formatData.value
                defaultTime = defaultTime.copy()
                defaultTime.setValue(val)

                if (type === DateEmitRangeType.start) {
                    if (startDate.isNull) {
                        startDate.setYMD(selectDate)
                    }
                    startDate.setHms(defaultTime)
                    if (endDate.isNull) {
                        endDate = startDate.copy()
                    } else {
                        if ((props.datetime ? startDate.YMDHms! > endDate.YMDHms! : startDate.YMD! > endDate.YMD!)) {
                            endDate = startDate.copy()
                        }
                    }
                } else if (type === DateEmitRangeType.end) {
                    if (endDate.isNull) {
                        endDate.setYMD(selectDate)
                    }
                    endDate.setHms(defaultTime)
                    if (startDate.isNull) {
                        startDate = endDate.copy()
                    } else {
                        if ((props.datetime ? startDate.YMDHms! > endDate.YMDHms! : startDate.YMD! > endDate.YMD!)) {
                            startDate = endDate.copy()
                        }
                    }
                }

                utils.emitValue(startDate, endDate)
            },
        }

        return {
            render: () => (
                <div class="pl-date-base-panel pl-date-panel-date-range">
                    <pl-date-base-panel-date {...binding.value.start}/>
                    <pl-date-base-panel-date {...binding.value.end}/>
                </div>
            )
        }
    },
})