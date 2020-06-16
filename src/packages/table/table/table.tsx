import {computed, defineComponent, onMounted, provide, reactive, watch} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";
import {CompRef, useRefs} from "@/use/useRefs";
import {PlcType} from "@/packages/table/plc/plc";
import {PlcGroupType} from "@/packages/table/plc/plc-group";
import {TABLE_PROVIDER, TableHoverPart, TableProps, TablePropsType} from "@/packages/table/table-utils";
import {printPlcData} from "@/packages/table/plc/debug";
import {handlePlcConfigAndState, PlcFixedType} from "@/packages/table/plc/plc-utils";
import {FormatPropsType, useProps} from "@/use/useProps";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {useModel} from "@/use/useModel";
import {TableNode} from "@/packages/table/table/TableNode";
import {TableMark} from "@/packages/table/table/TableMark";
import {$plain} from "@/packages/base";


function tableSetup(props: TablePropsType) {

    const {emit, on, off} = useEvent({
        scrollLeft: (e: Event, part: TableHoverPart) => {},
        updateData: EmitFunc,
    })

    const {slots} = useSlots()

    const refs = useRefs({
        collector: CompRef,
    })

    /*---------------------------------------state-------------------------------------------*/
    const mark = new TableMark(props)

    const dataModel = useModel(() => props.data, emit.updateData, true, true, (val) => state.rootNode.setChildren(val as object[] || []))
    const rootNode = new TableNode(`root-node-${$plain.utils.uuid()}`, {[props.childrenField]: dataModel.value || []}, props, 0, null, mark)

    const summaryRootNode = new TableNode(`summary-root-node-${$plain.utils.uuid()}`, {[props.childrenField]: props.summaryData || []}, props, 0, null, mark)
    watch(() => props.summaryData, (val) => state.summaryRootNode.setChildren(val as object[] || []), {lazy: true})

    const state = reactive({
        tableWidth: null as null | number,
        hoverState: {
            part: TableHoverPart.body,
            fixed: PlcFixedType.center,
            node: null as null | TableNode,
        },
        mark,
        rootNode,
        summaryRootNode,
        currentNode: null as null | TableNode,
    })

    const propsState = useProps(props, {
        headRowHeight: FormatPropsType.number,
        bodyRowHeight: FormatPropsType.number,
    })

    /*---------------------------------------computer-------------------------------------------*/

    const plcData = computed(() => {
        if (!state.tableWidth) return null
        // plc: props = props + propsState
        let items = refs.collector.items.value as (PlcType | PlcGroupType)[]
        // table: config plc, and  combine: props + config + state
        const ret = handlePlcConfigAndState(items, props.config, state.tableWidth)

        const has = computed(()=>({
            hasFixedLeft: ret.hasFixedLeft,
            hasFixedRight: ret.hasFixedRight,
        }))

        return {...ret, has}
    });

    const bodyPlcList = computed(() => {
        if (!state.tableWidth) return null
        return plcData.value!.flatPlcList
    })

    const totalContentWidth = computed(() => {
        if (!bodyPlcList.value) return
        return bodyPlcList.value.reduce((ret, plc) => {
            return ret + (plc.props.width as number)
        }, 0)
    })

    const tableData = computed(() => state.rootNode.children as TableNode[])

    const tableSummaryData = computed(() => state.summaryRootNode.children as TableNode[])

    const isDisabledVirtualScroll = computed(() => {
        return !props.virtual
    })

    /*---------------------------------------utils-------------------------------------------*/

    const utils = {
        setHover: (node: TableNode | null) => {state.hoverState.node = node},
        isHover: (node: TableNode) => {return !!state.hoverState.node && state.hoverState.node.key === node.key},

        setCurrent: (node: TableNode | null) => {state.currentNode = node},
        isCurrent: (node: TableNode) => {return !!state.currentNode && state.currentNode.key === node.key},
    }

    /*---------------------------------------handler-------------------------------------------*/

    const handler = {
        hoverPart: (part: TableHoverPart, fixed: PlcFixedType) => {
            state.hoverState.part = part
            state.hoverState.fixed = fixed
        },
        hoverRow: (node: TableNode) => {utils.setHover(node)},
        clickRow: (node: TableNode) => {utils.setCurrent(node)},
        leaveTable: () => {utils.setHover(null)},
    }

    const refer = {
        props,
        slots,
        refs,

        plcData,
        bodyPlcList,
        totalContentWidth,
        tableData,
        tableSummaryData,
        isDisabledVirtualScroll,

        state,
        propsState,

        emit,
        on,
        off,

        utils,
        handler,
    }

    provide(TABLE_PROVIDER, refer)

    onMounted(() => state.tableWidth = refs.$el.offsetWidth)

    return refer
}

export type PlainTable = ReturnType<typeof tableSetup>

export default defineComponent({
    name: 'pl-table',
    props: {
        ...TableProps,
    },
    setup(props) {

        const {
            slots,
            refs,
            plcData,
            state,
            handler,
        } = tableSetup(props)

        const classes = computed(() => [
            'pl-table', {
                'pl-table-border': props.border,
                'pl-table-disabled-high-current': props.disabledHighCurrentRow,
            }
        ])

        return () => {

            return (
                <div class={classes.value} onMouseleave={handler.leaveTable}>
                    <plc-collector ref="collector">{slots.default()}</plc-collector>
                    {!!state.tableWidth && [
                        <plt-head ref="head"/>,
                        <plt-body ref="body"/>,
                    ]}
                    {!!props.debugPlc && state.tableWidth && printPlcData(plcData.value!.plcList)}
                </div>
            )
        }
    },
})