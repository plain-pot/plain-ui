import {designComponent} from "../../../use/designComponent";
import {TimePublicProps} from "./time-panel.utils";
import {useModel} from "../../../use/useModel";
import {nextTick, computed} from 'vue';
import {TimeRangePanelType} from "./time-range-panel";

export const TimePanelProps = {
    modelValue: {type: String},
    start: {type: String},
    end: {type: String},
    range: {type: Boolean},
    ...TimePublicProps,
}

export default designComponent({
    name: 'pl-time-panel',
    props: {
        ...TimePanelProps,
    },
    emits: {
        updateModelValue: (val: string | undefined, type: TimeRangePanelType) => true,
        updateStart: (val?: string) => true,
        updateEnd: (val?: string) => true,

        mousedownBasePanel: (e: MouseEvent) => true,
        mousedownStartPanel: (e: MouseEvent) => true,
        mousedownEndPanel: (e: MouseEvent) => true,
    },
    setup({props, event: {emit}}) {

        const model = useModel(() => props.modelValue, emit.updateModelValue as any)
        const start = useModel(() => props.start, emit.updateStart)
        const end = useModel(() => props.end, emit.updateEnd)

        const handler = {
            onBaseChange: async (val?: string) => {
                await nextTick()
                model.value = val
            },
            onRangeChange: async (val: string | undefined, type: TimeRangePanelType) => {
                await nextTick()
                if (type === TimeRangePanelType.start) {
                    start.value = val
                } else if (type === TimeRangePanelType.end) {
                    end.value = val
                }
                emit.updateModelValue(val, type)
            },
        }

        const binding = computed(() => {

            const publicProps = Object.keys(TimePublicProps).reduce((ret: any, key) => {
                ret[key] = (props as any)[key]
                return ret
            }, {})

            return {
                base: {
                    ...publicProps,
                    modelValue: model.value,
                    onChange: handler.onBaseChange,
                    onMousedown: emit.mousedownBasePanel,
                },
                range: {
                    ...publicProps,
                    start: start.value,
                    end: end.value,
                    onChange: handler.onRangeChange,
                    onMousedownStartPanel: emit.mousedownStartPanel,
                    onMousedownEndPanel: emit.mousedownEndPanel,
                },
            }
        })

        return {
            render: () => (
                !props.range ?
                    <pl-time-base-panel class="pl-time-panel" {...binding.value.base} key="base"/> :
                    <pl-time-range-panel class="pl-time-panel" {...binding.value.range} key="range"/>
            )
        }

    },
})