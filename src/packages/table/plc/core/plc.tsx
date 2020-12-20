import {designComponent} from "../../../../use/designComponent";
import {PlcProps, PlcPublicAttrs} from "./plc.utils";
import {TablePlcCollector} from './plc-collector';
import {Plc, TablePlc} from "./plc.type";
import {useNumber} from "../../../../use/useNumber";
import {computed, ExtractPropTypes, PropType, reactive} from 'vue';
import {useScopedSlots} from "../../../../use/useScopedSlots";
import {TableNode} from "../../core/useTableNode";

export function usePlc(props: ExtractPropTypes<typeof PlcProps>) {

    const {scopedSlots} = useScopedSlots({
        head: {plc: Object as PropType<TablePlc>},
        default: {node: Object as PropType<TableNode>, plc: Object as PropType<Plc>},
        edit: {node: Object as PropType<TableNode>, plc: Object as PropType<Plc>},
        summary: {node: Object as PropType<TableNode>, plc: Object as PropType<Plc>},
    }, true)
    /*collector收集列信息*/
    TablePlcCollector.useChild()
    /*格式化props*/
    const {numberState} = useNumber(props, ['order', 'width'])
    /*目标props*/
    const formatProps = computed(() => ({
        ...props,
        ...numberState,
    }) as Omit<typeof props, 'order' | 'width'> & typeof numberState)
    /*props的一个副本，不过如果有值的情况下，优先级比props中的值高（比config值也高）*/
    const propsState = reactive(Object.keys(PlcProps).reduce((ret: any, key: string) => {
        ret[key] = null
        return ret
    }, {}) as { [k in keyof typeof formatProps.value]: typeof formatProps.value[k] | null })

    const plc: Plc = reactive({
        /*PlcPublicAttrs 在 copyPlc中会深度复制一遍，这里适配类型即可*/
        ...PlcPublicAttrs,
        group: false,
        props: formatProps,
        state: propsState,
        refer: () => plc,
        setDurWidth: (durWidth: number) => propsState.width = Number((formatProps.value.width)) + durWidth,
        scopedSlots,
    })

    return {
        refer: plc,
        render: () => (<i {...{title: props.title, field: props.field}}/>)
    }
}

export default designComponent({
    name: 'plc',
    props: {
        ...PlcProps,
    },
    setup({props}) {
        return usePlc(props)
    },
})