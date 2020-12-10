import {designComponent} from "../../../use/designComponent";
import {DateEmitRangeType, DatePublicEmits, DatePublicProps, DefaultDateFormatString} from "../date.utils";
import {useModel} from "../../../use/useModel";
import {computed, resolveComponent} from 'vue';

export const enum DatePanelType {
    year = 'year',
    month = 'month',
    date = 'date',
    datetime = 'datetime',
    week = 'week',
    dates = 'dates',
}

export default designComponent({
    name: 'pl-date-panel',
    props: {
        ...DatePublicProps,
        modelValue: {},
        panel: {type: String, default: DatePanelType.date},
    },
    emits: {
        ...DatePublicEmits,
    },
    setup({props, event: {emit}}) {

        const model = useModel(() => props.modelValue as any, emit.updateModelValue)
        const startModel = useModel(() => props.start, emit.updateStart)
        const endModel = useModel(() => props.end, emit.updateEnd)

        const handler = {
            onChange: (val: string | undefined, type?: DateEmitRangeType) => {
                if (!props.range) {
                    model.value = val
                } else {
                    if (type === DateEmitRangeType.start) {
                        startModel.value = val
                    } else {
                        endModel.value = val
                    }
                    emit.updateModelValue(val, type)
                }
            }
        }

        const binding = computed(() => {
            const {range, max, min, displayFormat, valueFormat, firstWeekDay, defaultTime,} = props
            const panel = props.panel as DatePanelType
            const value = model.value
            const start = startModel.value
            const end = endModel.value
            const publicProps = {range, modelValue: value, start, end, max, min, firstWeekDay, defaultTime,}
            const date = range ? 'pl-date-panel-date-range' : 'pl-date-base-panel-date'

            return {
                name: {
                    year: 'pl-date-base-panel-year',
                    month: 'pl-date-base-panel-month',
                    date: date,
                    datetime: date,
                    week: 'pl-date-panel-week',
                    dates: 'pl-date-panel-dates',
                }[panel] as any,
                attrs: {
                    ...publicProps,
                    onChange: handler.onChange,
                    displayFormat: displayFormat || DefaultDateFormatString[panel],
                    valueFormat: valueFormat || DefaultDateFormatString[panel],
                    datetime: props.datetime,
                },
            }
        })

        return {
            render: () => {
                const {name, attrs} = binding.value
                const Component = resolveComponent(name) as any
                return <Component {...attrs}/>
            }
        }
    },
})