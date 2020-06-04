import {computed, defineComponent} from "@vue/composition-api";
import {TimePublicProps} from "@/packages/time/subs/time-subs";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {useModel} from "@/use/useModel";
import {$plain} from "@/packages/base";
import {TimeRangePanelType} from "@/packages/time/subs/time-range-panel";

export default defineComponent({
    name: 'pl-time-panel',
    props: {
        value: {type: String},
        start: {type: String},
        end: {type: String},
        range: {type: Boolean},
        ...TimePublicProps,
    },
    setup(props) {

        const {emit} = useEvent({
            input: (value: string | undefined, type: TimeRangePanelType) => undefined,
            updateStart: EmitFunc,
            updateEnd: EmitFunc,

            mousedownBasePanel: EmitFunc,
            mousedownStartPanel: EmitFunc,
            mousedownEndPanel: EmitFunc,
        })

        const value = useModel(() => props.value, emit.input)
        const start = useModel(() => props.start, emit.updateStart)
        const end = useModel(() => props.end, emit.updateEnd)

        const bindingProps = computed(() => {
            const publicProps = Object.keys(TimePublicProps).reduce((ret, key) => {
                ret[key] = props[key]
                return ret
            }, {})

            const base = {
                props: {
                    ...publicProps,
                    value: value.value,
                },
                on: {
                    change: async (val) => {
                        await $plain.nextTick()
                        value.value = val
                    },
                    'mousedown-panel': emit.mousedownBasePanel,
                },
            }

            const range = {
                props: {
                    ...publicProps,
                    start: start.value,
                    end: end.value,
                },
                on: {
                    change: async (val, type) => {
                        await $plain.nextTick()
                        if (type === TimeRangePanelType.start) {
                            start.value = val
                        } else if (type === TimeRangePanelType.end) {
                            end.value = val
                        }
                        emit.input(val, type)
                    },
                    'mousedown-start-panel': emit.mousedownStartPanel,
                    'mousedown-end-panel': emit.mousedownEndPanel,
                },
            }

            return {
                base, range
            }
        })

        return () => {
            return !props.range ?
                <pl-time-base-panel class="pl-time-panel" {...bindingProps.value.base} key="base"/> :
                <pl-time-range-panel class="pl-time-panel" {...bindingProps.value.range} key="range"/>
        }
    },
})