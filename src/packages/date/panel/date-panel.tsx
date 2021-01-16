import {designComponent} from "../../../use/designComponent";
import {DateEmitRangeType, DatePublicEmits, DatePublicProps, DefaultDateFormatString} from "../date.utils";
import {useModel} from "../../../use/useModel";
import {computed} from 'vue';
import {PlDateBasePanelYear} from "./date-base-panel-year";
import {PlDateBasePanelMonth} from "./date-base-panel-month";
import {PlDateBasePanelDate} from "./date-base-panel-date";
import {PlDatePanelWeek} from "./date-panel.week";
import {PlDatePanelDates} from "./date-panel-dates";
import {PlDatePanelDateRange} from "./date-panel-date-range";

export const enum DatePanelType {
    year = 'year',
    month = 'month',
    date = 'date',
    datetime = 'datetime',
    week = 'week',
    dates = 'dates',
}

export const PlDatePanel = designComponent({
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

        const model = useModel(() => props.modelValue as any, emit.onUpdateModelValue)
        const startModel = useModel(() => props.start, emit.onUpdateStart)
        const endModel = useModel(() => props.end, emit.onUpdateEnd)

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
                    emit.onUpdateModelValue(val, type)
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
            const date = range ? PlDatePanelDateRange : PlDateBasePanelDate

            return {
                name: {
                    year: PlDateBasePanelYear,
                    month: PlDateBasePanelMonth,
                    date: date,
                    datetime: date,
                    week: PlDatePanelWeek,
                    dates: PlDatePanelDates,
                }[panel] as any,
                attrs: {
                    ...publicProps,
                    onChange: handler.onChange,
                    displayFormat: displayFormat || DefaultDateFormatString[panel],
                    valueFormat: valueFormat || DefaultDateFormatString[panel],
                    datetime: panel === DatePanelType.datetime,
                },
            }
        })

        return {
            render: () => {
                const {name: Component, attrs} = binding.value
                return <Component {...attrs}/>
            }
        }
    },
})