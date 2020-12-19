import {designComponent} from "../../../../use/designComponent";
import {PlcGroupProps, PlcPublicAttrs} from "./plc.utils";
import {TablePlcCollector} from './plc-collector';
import {useSlots} from "../../../../use/useSlots";
import {PlcGroup} from "./plc.type";
import {useNumber} from "../../../../use/useNumber";
import {computed, PropType, reactive} from 'vue';
import {useScopedSlots} from "../../../../use/useScopedSlots";

export default designComponent({
    name: 'plc-group',
    props: {
        ...PlcGroupProps,
    },
    setup({props}) {
        /*插槽*/
        const {slots} = useSlots()
        const {scopedSlots} = useScopedSlots({
            head: {plc: Object as PropType<PlcGroup>},
        }, true)
        /*collector收集列信息*/
        TablePlcCollector.useChild()
        /*子列信息*/
        const {children} = TablePlcCollector.useParent()
        /*格式化props*/
        const {numberState} = useNumber(props, ['order'])
        /*目标props*/
        const formatProps = computed(() => ({
            ...props,
            ...numberState,
        }) as Omit<typeof props, 'order'> & typeof numberState)
        /*props的一个副本，不过如果有值的情况下，优先级比props中的值高（比config值也高）*/
        const propsState = reactive(Object.keys(PlcGroupProps).reduce((ret: any, key: string) => {
            ret[key] = null
            return ret
        }, {}) as { [k in keyof typeof formatProps.value]: typeof formatProps.value[k] | null })

        /*核心暴露对象*/
        const group: PlcGroup = reactive({
            /*PlcPublicAttrs 在 copyPlc中会深度复制一遍，这里适配类型即可*/
            ...PlcPublicAttrs,
            group: true,
            children,
            props: formatProps,
            state: propsState,
            refer: () => group,
            setDurWidth: (durWidth: number) => {
                const itemDurWidth = Math.floor(durWidth / (children.length))
                children.forEach(item => item.setDurWidth(itemDurWidth))
            },
            scopedSlots,
        })

        return {
            refer: group,
            render: () => (
                <div>
                    {slots.default()}
                </div>
            )
        }
    },
})