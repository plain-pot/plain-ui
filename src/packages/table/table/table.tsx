import {computed, defineComponent, inject, onMounted, provide, reactive, watch} from "@vue/composition-api";
import {TableHoverPart, TableProps, TablePropsType} from "@/packages/table/table-utils";
import {useSlots} from "@/use/useSlots";
import {FormatPropsType, useProps} from "@/use/useProps";
import {PlcType} from "@/packages/table/plc/plc";
import {PlcGroupType} from "@/packages/table/plc/plc-group";
import {CompRef, useRefs} from "@/use/useRefs";
import {printPlcData} from "@/packages/table/plc/debug";
import './table.scss'
import {TableMark} from "@/packages/table/table-bak/TableMark";
import {getValidateConfigData} from "@/packages/form/validate";
import {useModel} from "@/use/useModel";
import {TableNode} from "@/packages/table/table-bak/TableNode";
import {$plain} from "@/packages/base";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {StyleShape, StyleSize, useStyle} from "@/use/useStyle";
import {PlainScroll} from "@/packages/scroll/scroll";
import {formatPlc} from "@/packages/table/plc/format/formatPlc";

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
        if (!!node.children && (!!iterateChildren && iterateChildren(node))) {
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
        hoverPart: null as null | TableHoverPart,           // 当前鼠标所在的区域
    })
    /*---------------------------------------computed-------------------------------------------*/
    /**
     * 列相关数据
     * @author  韦胜健
     * @date    2020/8/13 22:29
     */
    const plcData = computed(() => {
        // todo  plc的width属性变化之后，这里执行了两次，很奇怪

        if (!state.tableWidth) return null
        // plc: props = props + propsState
        let items = refs.collector.items.value as (PlcType | PlcGroupType)[]
        // table: config plc, and  combine: props + config + state
        const result = formatPlc({
            items,
            config: props.config,
            tableWidth: state.tableWidth,
            headRowHeight: propsState.headRowHeight,
            bodyRowHeight: propsState.bodyRowHeight,
        })
        return result
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
                return !!props.childrenField && node.isExpand
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

    const {styleComputed} = useStyle({shape: StyleShape.square, size: StyleSize.mini, status: null})
    const classes = computed(() => [
        'pl-table',
        `pl-table-size-${styleComputed.value.size}`,
        `pl-table-shape-${styleComputed.value.shape}`,
        {
            'pl-table-border': props.border,
        },
    ])

    /*---------------------------------------utils-------------------------------------------*/
    const utils = {
        setCurrent: (node: TableNode | null) => {state.currentNode = node},
        isCurrent: (node: TableNode) => {return !!state.currentNode && state.currentNode.key === node.key},
        bindScroll: (part: TableHoverPart, setLeft: (scrollLeft: number, part: TableHoverPart) => void) => {

            on.scrollLeft((e: any, part) => setLeft(e.target.scrollLeft, part))

            return {
                handler: {
                    mouseenter: () => state.hoverPart = part,
                    scroll: (e: Event) => {
                        if (state.hoverPart !== part) {
                            return
                        }
                        emit.scrollLeft(e, part)
                    },
                }
            }
        }
    }
    /*---------------------------------------handler-------------------------------------------*/
    const handler = {
        headMousewheel: (e: MouseEvent, scroll: PlainScroll) => {
            e.preventDefault();

            const {deltaX, deltaY} = e as any
            // @ts-ignore
            emit.scrollLeft({target: {scrollLeft: scroll.state.wrapperScrollLeft + (deltaX || deltaY)}}, null)
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
        classes,

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

type PlainTable = ReturnType<typeof tableSetup>

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
            classes,
        } = tableSetup(props)

        return () => (
            <div class={classes.value}>

                <plc-collector ref="collector">{slots.default()}</plc-collector>

                {!!state.tableWidth && [<plt-head ref="head"/>, <plt-body ref="body"/>,]}

                {!!props.debugPlc && state.tableWidth && printPlcData(plcData.value!.plcList)}
            </div>
        )
    },
})