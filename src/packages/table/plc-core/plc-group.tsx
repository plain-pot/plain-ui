import {designComponent} from "../../../use/designComponent";
import {useSlots} from "../../../use/useSlots";
import {PlcComponentPublicData, PlcGroupProps} from "./plc.utils";
import {PlcCollector} from "./plc-collector";
import {computed, PropType, reactive} from 'vue';
import {PlcGroup, PlcType} from "./plc.type";
import {deepcopy} from "plain-utils/object/deepcopy";
import {useScopedSlots} from "../../../use/useScopedSlots";
import {useNumber} from "../../../use/useNumber";

export default designComponent({
    name: 'plc-group',
    props: {
        ...PlcGroupProps,
    },
    setup({props}) {

        const {slots} = useSlots()
        const {scopedSlots} = useScopedSlots({
            head: {plc: Object as PropType<PlcType | PlcGroup>},
        })
        const {children} = PlcCollector.parent() as any as { children: (PlcType | PlcGroup)[] }
        PlcCollector.child()
        const {numberState} = useNumber(props, ['order'])
        const targetProps = computed(() => ({
            ...props,
            ...numberState,
        } as Omit<typeof props, 'order'> & typeof numberState))
        /**
         * plc state：存储列动态变化的变量，优先级大于 props以及config
         * @author  韦胜健
         * @date    2020/12/16 23:19
         */
        const state = reactive(Object.keys(PlcGroupProps).reduce((ret: any, key: string) => {
            ret[key] = null
            return ret
        }, {}) as {
            [k in keyof typeof targetProps.value]: typeof targetProps.value[k] | null
        })

        function setDurWidth(durWidth: number) {
            const itemDurWidth = Math.floor(durWidth / (children.length))
            children.forEach(item => item.setDurWidth(itemDurWidth))
        }

        const refer: PlcGroup = reactive({
            ...deepcopy(PlcComponentPublicData),
            group: true,
            scopedSlots,
            props: targetProps,
            state,
            setDurWidth,
            children,
        })

        return {
            refer,
            render: () => (<div class="plc-group">{slots.default()}</div>)
        }
    },
})