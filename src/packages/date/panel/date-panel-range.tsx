import {designComponent} from "../../../use/designComponent";
import {DateEmitRangeType, DatePublicEmits, DatePublicProps, DateView, DefaultDateFormatString} from "../date.utils";
import {computed, PropType} from 'vue';
import {useDate, UseDateJudgementView} from "../useDate";
import {PDate, plainDate} from "../plainDate";
import {PlDatePanelDate} from "./date-panel-date";

const DefaultTime = {
    start: '00:00:00',
    end: '23:59:59'
}

export const PlDatePanelRange = designComponent({
    name: 'pl-date-panel-range',
    props: {
        ...DatePublicProps,
        range: {type: Boolean, default: true},
        view: {type: String as PropType<DateView>, default: DateView.date}
    },
    emits: {
        ...DatePublicEmits,
        mousedown: (e: MouseEvent, type: DateEmitRangeType) => true,
    },
    setup({props, event: {emit}}) {

        const {
            state,
            displayFormat,
            valueFormat,
            startModel,
            endModel,
            handler,
            setSelectDate,
            today,
        } = useDate({
            props,
            emit,
            jdView: UseDateJudgementView.YMD,
            processPd: {range: (spd, epd) => utils.processPd(spd, epd),},
        })

        const defaultTimePd = computed(() => {
            const config = {displayFormat: DefaultDateFormatString.Hms, valueFormat: DefaultDateFormatString.Hms}
            return {
                start: plainDate(props.defaultStartTime || DefaultTime.start, config),
                end: plainDate(props.defaultEndTime || DefaultTime.end, config),
            }
        })

        const timePd = computed(() => {
            const start = state.pd.spd || defaultTimePd.value.start
            const epd = state.pd.epd || defaultTimePd.value.end
            return {start, epd}
        })

        const utils = {
            processPd: (argSpd: PDate | null, argEpd: PDate | null) => {
                let spd = argSpd || argEpd!
                let epd = argEpd || argSpd!
                const {max, min} = state.topState
                const jdView = props.datetime ? 'YMDHms' : 'YMD'
                if (!!max) {
                    if (max[jdView] < spd[jdView]) spd = max
                    if (max[jdView] < epd[jdView]) epd = max
                }
                if (!!min) {
                    if (min[jdView] > spd[jdView]) spd = min
                    if (min[jdView] > epd[jdView]) epd = min
                }
                return spd[jdView] > epd[jdView] ? {
                    spd: epd,
                    epd: spd,
                } : {
                    spd, epd
                }
            },
        }

        const externalHandler = {
            onSelectTime: (val: string, type: DateEmitRangeType) => {
                let pd = (type === DateEmitRangeType.start ? state.pd.spd : state.pd.epd) || today
                pd = pd.useHms(timePd.value.start.useValue(val))
                const {spd, epd} = utils.processPd(type === DateEmitRangeType.start ? pd : state.pd.spd, type === DateEmitRangeType.end ? pd : state.pd.epd)
                startModel.value = spd.getDisplay()
                endModel.value = epd.getDisplay()
                state.range = {
                    hover: null,
                    value: [spd, epd],
                }
                emit.onUpdateModelValue(startModel.value, DateEmitRangeType.start)
                emit.onUpdateModelValue(endModel.value, DateEmitRangeType.end)
            }
        }

        const binding = computed(() => {
            const startSelectDate = state.selectDate
            const publicProps = Object.keys(DatePublicProps).reduce((ret, key) => {
                (ret as any)[key] = (props as any)[key]
                return ret
            }, {})
            Object.assign(publicProps, {
                displayFormat: displayFormat,
                valueFormat: valueFormat,
            })
            const start = {
                ...publicProps,
                selectDate: startSelectDate,
                modelValue: startModel.value,
                defaultTime: props.defaultStartTime || DefaultTime.start,

                onSelectDateChange: setSelectDate,
                onMouseenter: handler.onMouseenter,
                onClick: handler.onClick,
                onSelectTime: (val: string) => externalHandler.onSelectTime(val, DateEmitRangeType.start),
                onMousedown: (e: MouseEvent) => emit.mousedown(e, DateEmitRangeType.start),
            }
            const endSelectDate = startSelectDate.useMonthDate(startSelectDate.month + 1, 1)
            const end = {
                ...publicProps,
                selectDate: endSelectDate,
                modelValue: endModel.value,
                defaultTime: props.defaultEndTime || DefaultTime.end,

                onSelectDateChange: (val: PDate) => setSelectDate(val.useMonthDate(val.month - 1, 1)),
                onMouseenter: handler.onMouseenter,
                onClick: handler.onClick,
                onSelectTime: (val: string) => externalHandler.onSelectTime(val, DateEmitRangeType.end),
                onMousedown: (e: MouseEvent) => emit.mousedown(e, DateEmitRangeType.end),
            }
            return {start, end}
        })

        return {
            render: () => (
                <div class="pl-date-base-panel pl-date-panel-date-range">
                    <PlDatePanelDate {...binding.value.start}/>
                    <PlDatePanelDate {...binding.value.end}/>
                </div>
            )
        }
    },
})