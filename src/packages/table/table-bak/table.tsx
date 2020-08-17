import {computed, defineComponent, onMounted, provide, reactive, watch} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";
import {CompRef, useRefs} from "@/use/useRefs";
import {PlcType} from "@/packages/table/plc/plc";
import {PlcGroupType} from "@/packages/table/plc/plc-group";
import {TABLE_PROVIDER, TableHoverPart, TableProps, TablePropsType} from "@/packages/table/table-utils";
import {printPlcData} from "@/packages/table/plc/debug";
import {FormatPropsType, useProps} from "@/use/useProps";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {useModel} from "@/use/useModel";
import {TableNode} from "@/packages/table/table-bak/TableNode";
import {TableMark} from "@/packages/table/table-bak/TableMark";
import {$plain} from "@/packages/base";
import {getValidateConfigData} from "@/packages/form/validate";
import {useStyle} from "@/use/useStyle";
import {PlcFixedType} from "@/packages/table/plc/plc-utils";

/**
 * 递归遍历树形结构的表格数据
 * @author  韦胜健
 * @date    2020/6/16 16:20
 */
function iterateTableNode(
    tableNodes: TableNode[] | Readonly<TableNode[]> | null,
    fn: (node: TableNode) => void,
    iterateChildren?: (node: TableNode) => boolean
) {
    if (!tableNodes) return
    tableNodes.forEach(node => {
        fn(node)
        if (!!node.children && (!iterateChildren || iterateChildren(node))) {
            iterateTableNode(node.children, fn, iterateChildren)
        }
    })
}


function tableSetup(props: TablePropsType) {

    const {emit, on, off} = useEvent({
        scrollLeft: (e: Event, part: TableHoverPart) => {},
        updateData: EmitFunc,

        clickRow: (node: TableNode, e: MouseEvent) => {},
        dblclickRow: (node: TableNode, e: MouseEvent) => {},
    })

    useStyle({shape: null, size: null, status: null})

    const {slots} = useSlots()

    const refs = useRefs({
        collector: CompRef,
    })

    /*---------------------------------------state-------------------------------------------*/
    const mark = new TableMark(props, () => validateConfigData.value)

    // data
    const dataModel = useModel(() => props.data, emit.updateData, true, true, (val) => state.rootNode.setChildren(val as object[] || []))
    const rootNode = new TableNode(`root-node-${$plain.utils.uuid()}`, {[props.childrenField]: dataModel.value || []}, props, 0, null, mark, true)

    // summary data
    const summaryRootNode = new TableNode(`summary-root-node-${$plain.utils.uuid()}`, {[props.childrenField]: props.summaryData || []}, props, 0, null, mark, false)
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
        // @ts-ignore
        const ret = handlePlcConfigAndState(items, props.config, state.tableWidth)


        const has = computed(() => ({
            // @ts-ignore
            hasFixedLeft: ret.hasFixedLeft,
            // @ts-ignore
            hasFixedRight: ret.hasFixedRight,
        }))

        return {...ret, has}
    });

    const bodyPlcList = computed(() => {
        if (!state.tableWidth) return null
        return plcData.value!.flatPlcList
    })

    const validateConfigData = computed(() => getValidateConfigData(
        (bodyPlcList.value || []).map(({props: {title, field, required, rules}}) => ({label: title, field, required, rules})),
        props.rules,
    ))

    const totalContentWidth = computed(() => {
        if (!bodyPlcList.value) return
        return bodyPlcList.value.reduce((ret, plc) => {
            return ret + (plc.props.width as number)
        }, 0)
    })

    const tableData = computed(() => state.rootNode.children as TableNode[])

    const tableSummaryData = computed(() => state.summaryRootNode.children as TableNode[])

    const isDisabledVirtualScroll = computed(() => {
        if (!plcData.value) {
            return true
        }
        if (plcData.value.notFitVirtualPlcList.length > 0) {
            return true
        }
        return !props.virtual
    })

    const formatFlatTableData = computed(() => {
        const formatData = tableData.value
        let index = 0
        const formatDataFlat: TableNode[] = []

        iterateTableNode(
            formatData,
            (node) => {

                // 这个index应该是一个非响应式属性，避免出现计算属性死循环的情况
                node.index = index++
                formatDataFlat.push(node)
            },
            (node) => {
                return !props.childrenField || node.isExpand
            },
        )

        return formatDataFlat
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
        hoverRow: (e: MouseEvent, node: TableNode) => {
            utils.setHover(node)
        },
        clickRow: (e: MouseEvent, node: TableNode) => {
            utils.setCurrent(node)
            emit.clickRow(node, e)
        },
        dblclickRow: (e: MouseEvent, node) => {
            emit.dblclickRow(node, e)
        },

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
        formatFlatTableData,
        isDisabledVirtualScroll,

        state,
        propsState,

        emit,
        on,
        off,

        validateConfigData,
        utils,
        handler,
    }

    provide(TABLE_PROVIDER, refer)

    onMounted(() => {
        state.tableWidth = refs.$el.offsetWidth

        if (plcData.value!.notFitVirtualPlcList.length > 0 && props.virtual) {
            console.error('存在列不支持虚拟滚动的列，已经禁用了表格的虚拟滚动功能！')
        }
    })

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
                // @ts-ignore
                'pl-table-disabled-high-current': props.disabledHighCurrentRow,
            }
        ])

        return () => {

            return (
                <div class={classes.value} onMouseleave={handler.leaveTable}>
                    <plc-collector ref="collector">
                        <plc-index/>
                        {slots.default()}
                    </plc-collector>
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