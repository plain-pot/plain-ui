import {computed, defineComponent} from "@vue/composition-api";
import {DateEmitInputType, DatePublicProps} from "@/packages/date/date-utils";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {useModel} from "@/use/useModel";

export const enum DatePanelType {
    year = 'year',
    month = 'month',
    date = 'date',
    datetime = 'datetime',
    week = 'week',
    dates = 'dates',
}

export default defineComponent({
    name: 'pl-date-panel',
    props: {
        ...DatePublicProps,

        panel: {type: String, default: DatePanelType.date},
    },
    setup(props) {

        const {emit} = useEvent({
            input: (val: string | undefined, type?: DateEmitInputType) => undefined,
            updateStart: EmitFunc,
            updateEnd: EmitFunc,
            mousedownPanel: EmitFunc,
        })

        const model = useModel(() => props.value, emit.input)
        const startModel = useModel(() => props.start, emit.updateStart)
        const endModel = useModel(() => props.end, emit.updateEnd)

        const panelBinding = computed(() => {
            const {
                range,
                max,
                min,
                displayFormat,
                valueFormat,
                firstWeekDay,
                defaultTime,
            } = props

            const value = model.value
            const start = startModel.value
            const end = endModel.value

            const publicProps = {
                range,
                value,
                start,
                end,
                max,
                min,

                firstWeekDay,
                defaultTime,
            }
            const publicChange = (val: string | undefined, type?: DateEmitInputType) => {
                if (!range) {
                    model.value = val
                } else {
                    if (type === DateEmitInputType.start) {
                        startModel.value = val
                    } else {
                        endModel.value = val
                    }
                    emit.input(val, type)
                }
            }

            switch (props.panel) {
                case DatePanelType.year:
                    return {
                        props: {
                            ...publicProps,
                            displayFormat: displayFormat || 'YYYY',
                            valueFormat: valueFormat || 'YYYY',
                        },
                        on: {change: publicChange,},
                    }
                case DatePanelType.month:
                    return {
                        props: {
                            ...publicProps,
                            displayFormat: displayFormat || 'YYYY-MM',
                            valueFormat: valueFormat || 'YYYY-MM',
                        },
                        on: {change: publicChange,},
                    }
                case DatePanelType.date:
                    return {
                        props: {
                            ...publicProps,
                            displayFormat: displayFormat || 'YYYY-MM-DD',
                            valueFormat: valueFormat || 'YYYY-MM-DD',
                        },
                        on: {change: publicChange,},
                    }
                case DatePanelType.datetime:
                    return {
                        props: {
                            ...publicProps,
                            displayFormat: displayFormat || 'YYYY-MM-DD HH:mm:ss',
                            valueFormat: valueFormat || 'YYYY-MM-DD HH:mm:ss',
                            datetime: true,
                        },
                        on: {change: publicChange,},
                    }
                case DatePanelType.week:
                    return {
                        props: {
                            ...publicProps,
                            displayFormat: displayFormat || 'YYYY-MM-DD',
                            valueFormat: valueFormat || 'YYYY-MM-DD',
                        },
                        on: {change: publicChange,},
                    }
                case DatePanelType.dates:
                    return {
                        props: {
                            ...publicProps,
                            displayFormat: displayFormat || 'YYYY-MM-DD',
                            valueFormat: valueFormat || 'YYYY-MM-DD',
                        },
                        on: {change: publicChange,},
                    }
                default:
                    throw new Error(`pl-date-panel: invalid panel:${props.panel}`)
            }
        })

        return () => {
            const binding = panelBinding.value

            const panel = {
                year: 'pl-date-base-panel-year',
                month: 'pl-date-base-panel-month',
                date: binding.props.range ? 'pl-date-panel-date-range' : 'pl-date-base-panel-date',
                datetime: binding.props.range ? 'pl-date-panel-date-range' : 'pl-date-base-panel-date',
                week: 'pl-date-panel-week',
                dates: 'pl-date-panel-dates',
            }
            const Component = panel[props.panel]

            return <Component {...panelBinding.value} {...{
                on: {
                    'mousedown-panel': emit.mousedownPanel
                }
            }}/>
        }
    },
})