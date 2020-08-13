import {computed, defineComponent, inject, onMounted, provide, reactive, watch} from "@vue/composition-api";
import {TableHoverPart, TableProps, TablePropsType} from "@/packages/table/table-utils";
import {useSlots} from "@/use/useSlots";
import {FormatPropsType, useProps} from "@/use/useProps";
import {PlcType} from "@/packages/table/plc/plc";
import {PlcGroupType} from "@/packages/table/plc/plc-group";
import {handlePlcConfigAndState, PlcFixedType} from "@/packages/table/plc/plc-utils";
import {CompRef, useRefs} from "@/use/useRefs";
import {printPlcData} from "@/packages/table/plc/debug";
import {PlainTable} from "@/packages/table/table-bak/table";
import './table.scss'
import {TableMark} from "@/packages/table/table-bak/TableMark";
import {getValidateConfigData} from "@/packages/form/validate";
import {useModel} from "@/use/useModel";
import {TableNode} from "@/packages/table/table-bak/TableNode";
import {$plain} from "@/packages/base";
import {EmitFunc, useEvent} from "@/use/useEvent";

const PLAIN_TABLE_PROVIDER = '@@PLAIN_TABLE_PROVIDER'
export const injectTable = () => inject(PLAIN_TABLE_PROVIDER) as PlainTable

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

    /*---------------------------------------event-------------------------------------------*/
    const {emit, on, off} = useEvent({
        scrollLeft: (e: Event, part: TableHoverPart) => {},
        updateData: EmitFunc,

        clickRow: (node: TableNode, e: MouseEvent) => {},
        dblclickRow: (node: TableNode, e: MouseEvent) => {},
    })
    /*---------------------------------------slots-------------------------------------------*/
    const {slots} = useSlots()
    /*---------------------------------------refs-------------------------------------------*/
    const refs = useRefs({collector: CompRef,})

    /*---------------------------------------state-------------------------------------------*/
    const propsState = useProps(props, {
        headRowHeight: FormatPropsType.number,
        bodyRowHeight: FormatPropsType.number,
    })

    // TableMark
    const mark = new TableMark(props, () => validateConfigData.value)
    // 绑定的数据
    const dataModel = useModel(() => props.data, emit.updateData, true, true, (val) => state.rootNode.setChildren(val as object[] || []))
    // 数据模拟出来的父节点
    const rootNode = new TableNode(`root-node-${$plain.utils.uuid()}`, {[props.childrenField]: dataModel.value || []}, props, 0, null, mark, true)
    // 合计行数据模拟出来父节点
    const summaryRootNode = new TableNode(`summary-root-node-${$plain.utils.uuid()}`, {[props.childrenField]: props.summaryData || []}, props, 0, null, mark, false)
    watch(() => props.summaryData, (val) => state.summaryRootNode.setChildren(val as object[] || []), {lazy: true})

    const state = reactive({
        tableWidth: null as null | number,                  // mounted的时候表格的宽度
        mark,                                               // TableMark
        rootNode,                                           // 模拟出来的根数据节点
        summaryRootNode,                                    // 合计行数据模拟出来的数据节点
        currentNode: null as null | TableNode,              // 当前选中的节点
    })
    /*---------------------------------------computed-------------------------------------------*/
    /**
     * 列相关数据
     * @author  韦胜健
     * @date    2020/8/13 22:29
     */
    const plcData = computed(() => {
        if (!state.tableWidth) return null
        // plc: props = props + propsState
        let items = refs.collector.items.value as (PlcType | PlcGroupType)[]
        // table: config plc, and  combine: props + config + state
        const ret = handlePlcConfigAndState(items, props.config, state.tableWidth)

        const has = computed(() => ({
            hasFixedLeft: ret.hasFixedLeft,
            hasFixedRight: ret.hasFixedRight,
        }))

        return {...ret, has}
    });
    /**
     * 表体渲染所需要的的列信息
     * @author  韦胜健
     * @date    2020/8/13 22:31
     */
    const bodyPlcList = computed(() => {
        if (!state.tableWidth) return null
        return plcData.value!.flatPlcList
    })
    /**
     * 总的列宽度
     * @author  韦胜健
     * @date    2020/8/13 22:33
     */
    const totalContentWidth = computed(() => {
        if (!bodyPlcList.value) return
        return bodyPlcList.value.reduce((ret, plc) => {
            return ret + (plc.props.width as number)
        }, 0)
    })
    /**
     * 校验所需要的的配置信息数据
     * @author  韦胜健
     * @date    2020/8/13 22:33
     */
    const validateConfigData = computed(() => getValidateConfigData(
        (bodyPlcList.value || []).map(({props: {title, field, required, rules}}) => ({label: title, field, required, rules})),
        props.rules,
    ))
    /**
     * 表格数据，TableNode格式的数据
     * @author  韦胜健
     * @date    2020/8/13 22:33
     */
    const tableData = computed(() => state.rootNode.children as TableNode[])
    /**
     * 表格合计行数据，TableNode格式的数据
     * @author  韦胜健
     * @date    2020/8/13 22:35
     */
    const tableSummaryData = computed(() => state.summaryRootNode.children as TableNode[])
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
    /**
     * 是否可以开启表格的虚拟滚动功能
     * @author  韦胜健
     * @date    2020/8/13 22:35
     */
    const isDisabledVirtualScroll = computed(() => {
        if (!plcData.value) {
            return true
        }
        if (plcData.value.notFitVirtualPlcList.length > 0) {
            return true
        }
        return !props.virtual
    })

    /*---------------------------------------utils-------------------------------------------*/
    const utils = {
        setCurrent: (node: TableNode | null) => {state.currentNode = node},
        isCurrent: (node: TableNode) => {return !!state.currentNode && state.currentNode.key === node.key},
    }
    /*---------------------------------------handler-------------------------------------------*/
    const handler = {
        hoverPart: (part: TableHoverPart, fixed: PlcFixedType) => {
            state.hoverState.part = part
            state.hoverState.fixed = fixed
        },
        clickRow: (e: MouseEvent, node: TableNode) => {
            utils.setCurrent(node)
            emit.clickRow(node, e)
        },
        dblclickRow: (e: MouseEvent, node) => {
            emit.dblclickRow(node, e)
        },
    }


    /*---------------------------------------refer-------------------------------------------*/
    const refer = {
        props,
        slots,
        state,
        propsState,
        plcData,
        bodyPlcList,
        totalContentWidth,

        refs,

        tableData,
        tableSummaryData,
        formatFlatTableData,
        isDisabledVirtualScroll,

        emit,
        on,
        off,

        validateConfigData,
        utils,
        handler,
    }

    /*---------------------------------------provider-------------------------------------------*/
    provide(PLAIN_TABLE_PROVIDER, refer)

    /*---------------------------------------lifecycle-------------------------------------------*/
    onMounted(() => {
        state.tableWidth = refs.$el.offsetWidth
    })


    return refer
}

export default defineComponent({
    name: 'pl-table',
    props: {
        ...TableProps,
    },
    setup(props) {

        const {
            slots,
            state,
            plcData,
        } = tableSetup(props)

        return () => (
            <div class="pl-table">
                <plc-collector ref="collector">
                    {slots.default()}
                </plc-collector>
                {!!state.tableWidth && [
                    <plt-head ref="head"/>,
                    <plt-body ref="body"/>,
                ]}
                {!!props.debugPlc && state.tableWidth && printPlcData(plcData.value!.plcList)}
            </div>
        )
    },
})