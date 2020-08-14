import {computed, defineComponent, reactive} from "@vue/composition-api";
import {PLC_COLLECTOR, PlcComponentPublicData, PlcComponentType, PlcProps} from "@/packages/table/plc/plc-utils";
import {useCollectChild} from "@/use/useCollect";
import {useRefer} from "@/use/useRefer";
import {FormatPropsType, useProps} from "@/use/useProps";
import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";
import {PlainExtractPropTypes} from "@/type";
import {useScopedSlots} from "@/use/useScopedSlots";
import {TableNode} from "@/packages/table/table-bak/TableNode";
import {VNode} from "vue/types/umd";
import {$plain} from "@/packages/base";

export interface TableRenderData {
    plc: PlcType,
    rowData: TableNode,
    row: any,
}


interface PlcRenderType {
    head?: (plc: any) => VNode | number | string | null | undefined,
    default?: (renderData: TableRenderData) => VNode | number | string | null | undefined,
    edit?: (renderData: TableRenderData) => VNode | number | string | null | undefined,
    summary?: (renderData: TableRenderData) => VNode | number | string | null | undefined,
}

function usePlcSetup(props: (ExtractPropTypes<typeof PlcProps>)) {

    const {$scopedSlots} = useScopedSlots({
        head: {},
        default: {},
        edit: {},
        summary: {},
    })

    const scopedSlots = $scopedSlots as {
        head: (plc: typeof refer) => VNode | number | string | null | undefined,
        default: (renderData: { rowData: TableNode, plc: typeof refer }) => VNode | number | string | null | undefined,
        edit: (renderData: { rowData: TableNode, plc: typeof refer }) => VNode | number | string | null | undefined,
        summary: (renderData: { rowData: TableNode, plc: typeof refer }) => VNode | number | string | null | undefined,
    }

    const ctx = useCollectChild({provideString: PLC_COLLECTOR})

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
        ...$plain.utils.deepcopy(PlcComponentPublicData),
        ctx,
        scopedSlots,
        type: PlcComponentType.PLC,
        /*这里之所以强制做类型变化，是因为经过了collector的计算属性转化，在使用的时候是没有Ref这一层的*/
        // @ts-ignore
        props: targetProps as (PlainExtractPropTypes<typeof PlcProps>) & PlcRenderType,
        state,
        setDurWidth,
    }

    useRefer(refer)
    useRefer({refer})

    return refer
}

export type PlcType = ReturnType<typeof usePlcSetup>

export function plcSetup(props: ExtractPropTypes<typeof PlcProps>) {
    usePlcSetup(props as any)
    return () => (<div class="plc" field={props.field} title={props.title}/>)
}

export default defineComponent({
    name: 'plc',
    props: {
        ...PlcProps,
    },
    setup: plcSetup,
})