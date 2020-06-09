import {computed, defineComponent, watch} from "@vue/composition-api";
import {DateBasePanelItemData, DateEmitInputType, DatePublicProps, DateView} from "@/packages/date/date-utils";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {useDate} from "@/packages/date/useDate";
import {PlainDate} from "@/util/PlainDate";
import {$plain} from "@/packages/base";

export default defineComponent({
    name: 'pl-date-panel-date-range',
    props: {
        ...DatePublicProps,

        range: {type: Boolean, default: true},
        view: {type: String, default: DateView.date}
    },
    setup(props) {

        const {emit} = useEvent({
            input: (value: string, type: DateEmitInputType) => undefined,
            updateStart: EmitFunc,
            updateEnd: EmitFunc,
            mousedownPanel: (e: MouseEvent, type: DateEmitInputType) => undefined,
        })

        const {
            state,
            panelItemParam,
            startModel,
            endModel,
            displayFormat,
            valueFormat,
        } = useDate({
            props,
            injectView: DateView.date,
            getProvideData: (panelItemParam) => {
                const {value, hoverRange, valueRange, max, min} = panelItemParam
                return {
                    year: {
                        range: true,
                        value,
                        hoverRange,
                        valueRange,
                    },
                    month: {
                        range: true,
                        value,
                        hoverRange,
                        valueRange,
                    },
                    date: {
                        range: true,
                        value,
                        hoverRange,
                        valueRange,
                        max,
                        min,
                    },
                }
            },

            modelAutoEmit: false,
            startModelAutoEmit: false,
            endModelAutoEmit: false,

            onStartChange(val) {
                state.valueRange = [new PlainDate(val, displayFormat.value, valueFormat.value), new PlainDate(endModel.value, displayFormat.value, valueFormat.value)]
                state.hoverRange = null
                const startPd = new PlainDate(val, displayFormat.value, valueFormat.value)
                state.selectDate = startPd.isNull ? state.today : startPd.copy()
            },
            onEndChange(val) {
                state.valueRange = [new PlainDate(startModel.value, displayFormat.value, valueFormat.value), new PlainDate(val, displayFormat.value, valueFormat.value)]
                state.hoverRange = null
            },
        })

        const formatData = computed(() => {

            const start = startModel.value
            const end = endModel.value
            let defaultTimeString = props.defaultTime

            const startDate = new PlainDate(start, displayFormat.value, valueFormat.value)
            const endDate = new PlainDate(end, displayFormat.value, valueFormat.value)

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
                ret[key] = props[key]
                return ret
            }, {})

            Object.assign(publicProps, {
                displayFormat: displayFormat.value,
                valueFormat: valueFormat.value,
                range: true
            })

            const start = {
                props: {
                    ...publicProps,
                    selectDate: selectDate,
                    value: startModel.value,
                },
                on: {
                    'select-date-change': (val: PlainDate) => {
                        state.selectDate = val
                    },
                    'mouseenter-item': handler.onMouseenterItem,
                    'click-item': (item) => handler.onClickItem(item),
                    'select-time': (val) => handler.onSelectTime(val, DateEmitInputType.start)
                },
            }

            const endSelectDate = selectDate.copy()
            endSelectDate.setMonthDate(endSelectDate.month + 1, 1)

            const end = {
                props: {
                    ...publicProps,
                    selectDate: endSelectDate,
                    value: endModel.value,
                },
                on: {
                    'select-date-change': (val: PlainDate) => {
                        val.setMonthDate(val.month! - 1, 1)
                        state.selectDate = val.copy()
                    },
                    'mouseenter-item': handler.onMouseenterItem,
                    'click-item': (item) => handler.onClickItem(item,),
                    'select-time': (val) => handler.onSelectTime(val, DateEmitInputType.end)
                },
            }

            return {
                start,
                end
            }
        })

        const utils = {
            emitValue(startPd: PlainDate, endPd: PlainDate) {

                const {max, min} = panelItemParam.value

                if (!max.isNull && (props.datetime ? max.YMDHms < startPd.YMDHms! : max.YMD < startPd.YMD!)) {
                    startPd = max
                } else if (!min.isNull && (props.datetime ? min.YMDHms > startPd.YMDHms! : min.YMD > startPd.YMD!)) {
                    startPd = min
                }

                if (!max.isNull && (props.datetime ? max.YMDHms < endPd.YMDHms! : max.YMD < endPd.YMD!)) {
                    endPd = max
                } else if (!min.isNull && (props.datetime ? min.YMDHms > endPd.YMDHms! : min.YMD > endPd.YMD!)) {
                    endPd = min
                }

                startModel.value = startPd.valueString
                endModel.value = endPd.valueString

                state.hoverRange = null
                state.valueRange = [startPd, endPd]

                emit.updateStart(startModel.value)
                emit.input(startModel.value, DateEmitInputType.start)
                emit.updateEnd(endModel.value)
                emit.input(endModel.value, DateEmitInputType.end)
            },
        }

        const handler = {
            async onClickItem(ipd: PlainDate) {
                await $plain.nextTick()
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

                    if ((props.datetime ? startPd.YMDHms > endPd.YMDHms : startPd.YMD > endPd.YMD)) {
                        endPd = startPd
                    }

                    utils.emitValue(startPd, endPd)
                }
            },
            onMouseenterItem({ipd}: DateBasePanelItemData) {
                if (!!state.hoverRange) {
                    let midPd = state.valueRange[0] as PlainDate
                    ipd = ipd!.copy()
                    state.hoverRange = midPd.YMD! > ipd.YMD! ? [ipd, midPd] : [midPd, ipd]
                }
            },
            async onSelectTime(val: string, type: 'start' | 'end') {
                await $plain.nextTick()

                let {selectDate} = state
                let {startDate, endDate, defaultTime} = formatData.value
                defaultTime = defaultTime.copy()
                defaultTime.setValue(val)

                if (type === 'start') {
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
                } else if (type === 'end') {
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

        return () => (
            <div class="pl-date-base-panel pl-date-panel-date-range">
                <pl-date-base-panel-date {...binding.value.start} {...{on: {'mousedown-panel': e => emit.mousedownPanel(e, DateEmitInputType.start)}}}/>
                <pl-date-base-panel-date {...binding.value.end} {...{on: {'mousedown-panel': e => emit.mousedownPanel(e, DateEmitInputType.end)}}}/>
            </div>
        )
    },
})