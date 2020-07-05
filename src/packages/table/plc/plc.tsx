import {computed, defineComponent, reactive, SetupContext} from "@vue/composition-api";
import {PLC_COLLECTOR, PlcComponentPublicData, PlcComponentType, PlcProps} from "@/packages/table/plc/plc-utils";
import {useCollectChild} from "@/use/useCollect";
import {useRefer} from "@/use/useRefer";
import {FormatPropsType, useProps} from "@/use/useProps";
import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";
import {PlainExtractPropTypes} from "@/type";
import {useScopedSlots} from "@/use/useScopedSlots";
import {TableNode} from "@/packages/table/table/TableNode";

function usePlcSetup(props: ExtractPropTypes<typeof PlcProps>) {

    const {scopedSlots, $scopedSlots} = useScopedSlots({
        head: {} as typeof refer,
        default: {} as TableNode,
        summary: {} as TableNode,
        edit: {} as TableNode,
    })

    useCollectChild({provideString: PLC_COLLECTOR})

    // 转化后的 props
    const propsState = useProps(props, {
        width: FormatPropsType.number,
        fit: FormatPropsType.number,
        order: FormatPropsType.number,
    })

    // props = props + propsState
    const targetProps = computed(() => ({
        ...props,
        ...propsState,
    }))

    // plc state：存储列动态变化的变量，优先级大于 props以及config
    const state = reactive(Object.keys(PlcProps).reduce((ret, key) => {
        ret[key] = null
        return ret
    }, {}) as PlainExtractPropTypes<typeof PlcProps> & { level: number })

    function setDurWidth(durWidth: number) {
        state.width = Number((state.width || targetProps.value.width)) as number + durWidth
    }

    const refer = {
        ...PlcComponentPublicData,
        scopedSlots,
        _$scopedSlots: $scopedSlots,
        type: PlcComponentType.PLC,
        /*这里之所以强制做类型变化，是因为经过了collector的计算属性转化，在使用的时候是没有Ref这一层的*/
        // @ts-ignore
        props: targetProps as PlainExtractPropTypes<typeof PlcProps>,
        state,
        setDurWidth,
    }

    useRefer(refer)
    useRefer({refer})

    return refer
}

export type PlcType = ReturnType<typeof usePlcSetup>

export function plcSetup(props: ExtractPropTypes<typeof PlcProps>) {
    usePlcSetup(props)
    return () => (<div class="plc" field={props.field} title={props.title}/>)
}

export default defineComponent({
    name: 'plc',
    props: {
        ...PlcProps,
    },
    setup: plcSetup,
})