import {computed, defineComponent} from "@vue/composition-api";
import {TimePublicProps} from "@/packages/time/subs/time-subs";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {useModel} from "@/use/useModel";
import {PlainDate} from "@/util/PlainDate";

export enum TimeRangePanelType {
    start = 'start',
    end = 'end',
}

export default defineComponent({
    name: 'pl-time-range-panel',
    props: {
        start: {type: String},
        end: {type: String},
        ...TimePublicProps,
    },
    setup(props) {

        const {emit} = useEvent({
            input: (value: string | undefined, type: TimeRangePanelType) => undefined,
            updateStart: EmitFunc,
            updateEnd: EmitFunc,

            mousedownStartPanel: EmitFunc,
            mousedownEndPanel: EmitFunc,
        })

        const start = useModel(() => props.start, emit.updateStart)
        const end = useModel(() => props.end, emit.updateEnd)
        const formatData = computed(() => {
            const {displayFormat, valueFormat} = props
            return {
                start: new PlainDate(start.value, displayFormat, valueFormat),
                end: new PlainDate(end.value, displayFormat, valueFormat),
                max: new PlainDate(props.max, displayFormat, valueFormat),
                min: new PlainDate(props.min, displayFormat, valueFormat)
            }
        })
        const bindind = computed(() => {
            const publicProps = Object.keys(TimePublicProps).reduce((ret, key) => {
                ret[key] = props[key]
                return ret
            }, {})

            const {max, min} = props

            const startBinding = {
                props: {
                    value: start.value,
                    ...publicProps,
                    max,
                    min,
                },
                on: {
                    change: (value) => {
                        start.value = value
                        emit.input(value, TimeRangePanelType.start)

                        const {end: endPd, start: startPd} = formatData.value

                        if (endPd.isNull || startPd.Hms! > endPd.Hms!) {
                            end.value = start.value
                            emit.input(end.value, TimeRangePanelType.end)
                        }
                    },
                    'mousedown-panel': emit.mousedownStartPanel,
                }
            }

            const endBinding = {
                props: {
                    value: end.value,
                    ...publicProps,
                    max,
                    min,
                },
                on: {
                    change: (value) => {
                        end.value = value
                        emit.input(value, TimeRangePanelType.end)
                        const {end: endPd, start: startPd} = formatData.value

                        if (startPd.isNull || endPd.Hms! < startPd.Hms!) {
                            start.value = end.value
                            emit.input(start.value, TimeRangePanelType.start)
                        }
                    },
                    'mousedown-panel': emit.mousedownEndPanel,
                }
            }

            return {
                start: startBinding,
                end: endBinding,
            }
        })

        return () => (
            <div class="pl-time-range-panel">
                <pl-time-base-panel {...bindind.value.start}/>
                <pl-time-base-panel {...bindind.value.end}/>
            </div>
        )
    },
})