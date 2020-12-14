import {designComponent} from "../../../use/designComponent";
import {TimePublicProps} from "./time-panel.utils";
import {useModel} from "../../../use/useModel";
import {PlainDate} from "../../../utils/PlainDate";
import {computed} from 'vue';
import './time-range-panel.scss'

export enum TimeRangePanelType {
    start = 'start',
    end = 'end',
}

export default designComponent({
    name: 'pl-time-range-panel',
    props: {
        start: {type: String},
        end: {type: String},
        ...TimePublicProps,
    },
    emits: {
        onUpdateModelValue: (val: string | undefined, type: TimeRangePanelType) => true,
        onUpdateStart: (val?: string) => true,
        onUpdateEnd: (val?: string) => true,
        onMousedownStartPanel: (e: MouseEvent) => true,
        onMousedownEndPanel: (e: MouseEvent) => true,
    },
    setup({props, event: {emit}}) {

        const start = useModel(() => props.start, emit.onUpdateStart)
        const end = useModel(() => props.end, emit.onUpdateEnd)

        const formatData = computed(() => {
            const {displayFormat, valueFormat} = props
            return {
                start: new PlainDate(start.value, displayFormat, valueFormat),
                end: new PlainDate(end.value, displayFormat, valueFormat),
                max: new PlainDate(props.max, displayFormat, valueFormat),
                min: new PlainDate(props.min, displayFormat, valueFormat)
            }
        })

        const handler = {
            onStartChange: (value?: string) => {
                start.value = value
                emit.onUpdateModelValue(value, TimeRangePanelType.start)

                const {end: endPd, start: startPd} = formatData.value

                if (endPd.isNull || startPd.Hms! > endPd.Hms) {
                    end.value = start.value
                    emit.onUpdateModelValue(end.value, TimeRangePanelType.end)
                }
            },
            onEndChange: (value?: string) => {
                end.value = value
                emit.onUpdateModelValue(value, TimeRangePanelType.end)
                const {end: endPd, start: startPd} = formatData.value

                if (startPd.isNull || endPd.Hms! < startPd.Hms) {
                    start.value = end.value
                    emit.onUpdateModelValue(start.value, TimeRangePanelType.start)
                }
            },
        }

        const binding = computed(() => {
            const publicProps = Object.keys(TimePublicProps).reduce((ret: any, key) => {
                ret[key] = (props as any)[key]
                return ret
            }, {})
            const {max, min} = props
            const publicBinding = {
                ...publicProps,
                max,
                min,
                disableChangeOnScroll: true,
            }
            return {
                start: {
                    ...publicBinding,
                    modelValue: start.value,
                    onChange: handler.onStartChange,
                    onMousedown: emit.onMousedownStartPanel,
                },
                end: {
                    ...publicBinding,
                    modelValue: end.value,
                    onChange: handler.onEndChange,
                    onMousedown: emit.onMousedownEndPanel,
                },
            }
        })

        return {
            render: () => (
                <div class="pl-time-range-panel">
                    <pl-time-base-panel {...binding.value.start}/>
                    <pl-time-base-panel {...binding.value.end}/>
                </div>
            )
        }
    },
})