import {designComponent} from "../../../use/designComponent";
import {PlcComponentPublicData, PlcProps} from "./plc.utils";
import {PlcCollector} from "./plc-collector";
import {useScopedSlots} from "../../../use/useScopedSlots";
import {TableNode} from "../table-core/node";
import {ComponentInternalInstance, computed, PropType, reactive} from 'vue';
import {useNumber} from "../../../use/useNumber";
import {deepcopy} from "plain-utils/object/deepcopy";
import {PlcGroup, PlcType} from "./plc.type";

export default designComponent({
    name: 'plc',
    props: {
        ...PlcProps,
    },
    setup({props}) {

        const {ctx} = PlcCollector.child() as { ctx: ComponentInternalInstance }
        const {scopedSlots} = useScopedSlots({
            head: {plc: Object as PropType<PlcType | PlcGroup>},
            default: {node: Object as PropType<TableNode>, plc: Object as PropType<PlcType>},
            edit: {node: Object as PropType<TableNode>, plc: Object as PropType<PlcType>},
            summary: {node: Object as PropType<TableNode>, plc: Object as PropType<PlcType>},
        })
        const {numberState} = useNumber(props, ['width', 'fit', 'order'])
        const targetProps = computed(() => ({
            ...props,
            ...numberState,
        } as Omit<typeof props, 'width' | 'fit' | 'order'> & typeof numberState))
        /**
         * plc state：存储列动态变化的变量，优先级大于 props以及config
         * @author  韦胜健
         * @date    2020/12/16 23:19
         */
        const state = reactive(Object.keys(PlcProps).reduce((ret: any, key: string) => {
            ret[key] = null
            return ret
        }, {}) as {
            [k in keyof typeof targetProps.value]: typeof targetProps.value[k] | null
        })

        function setDurWidth(durWidth: number) {
            state.width = Number((state.width || targetProps.value.width)) + durWidth
        }

        const refer: PlcType = reactive({
            ...deepcopy(PlcComponentPublicData),
            group: false,
            ctx: ctx as any,
            scopedSlots,
            props: targetProps,
            state,
            setDurWidth,
        })

        return {
            refer,
            render: () => (
                <div>
                    {props.title}-{props.field}
                </div>
            )
        }
    },
})