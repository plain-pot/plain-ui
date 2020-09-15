import {computed, defineComponent, inject, onMounted, provide, reactive, watch} from "@vue/composition-api";
import {TableHoverPart, TableProps, TablePropsType} from "@/packages/table/table-utils";
import {useSlots} from "@/use/useSlots";
import {FormatPropsType, useProps} from "@/use/useProps";
import {PlcType} from "@/packages/table/plc/plc";
import {PlcGroupType} from "@/packages/table/plc/plc-group";
import {CompRef, useRefs} from "@/use/useRefs";
import {printPlcData} from "@/packages/table/plc/debug";
import './table.scss'
import {TableMark} from "@/packages/table/table/TableMark";
import {getValidateConfigData} from "@/packages/form/validate";
import {useModel} from "@/use/useModel";
import {TableNode} from "@/packages/table/table/TableNode";
import {$plain} from "@/packages/base";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {StyleShape, StyleSize, useStyle} from "@/use/useStyle";
import {PlainScroll} from "@/packages/scroll/scroll";
import {formatPlc} from "@/packages/table/plc/format/formatPlc";
import {useRefer} from "@/use/useRefer";
import {useFixedShadow} from "@/packages/table/plc/plc-fixed";

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

        clickRow: (node: TableNode, e: MouseEvent) => {},                                       // 点击行事件
        dblclickRow: (node: TableNode, e: MouseEvent) => {},                                    // 双击行事件

        clickCell: (node: TableNode, e: MouseEvent) => {},                                      // 点击单元格事件（如果点击的内容节点不是 plt-inner-cell ，则不会触发该事件）
        dblclickCell: (node: TableNode, e: MouseEvent) => {},                                   // 双击单元格事件（如果点击的内容节点不是 plt-inner-cell ，则不会触发该事件）
    })
    /*---------------------------------------slots-------------------------------------------*/
    const {slots} = useSlots()
    /*---------------------------------------refs-------------------------------------------*/
    const refs = useRefs({
        collector: CompRef,
        body: CompRef,
        head: CompRef,
    })

    /*---------------------------------------state-------------------------------------------*/
    const propsState = useProps(props, {
        headRowHeight: FormatPropsType.number,
        bodyRowHeight: FormatPropsType.number,
    })

    // TableMark
    const mark = new TableMark(() => ({
        lazy: props.lazy as any,
        according: props.according as any,
        keyField: props.keyField as any,
        childrenField: props.childrenField as any,
        getChildren: props.getChildren as any,
        isCheckable: props.isCheckable as any,
        isLeaf: props.isLeaf as any,
        filterNodeMethod: props.filterNodeMethod as any,
        checkStrictly: props.checkStrictly as any,
        autoExpandParent: props.autoExpandParent as any,
    }), () => validateConfigData.value)

    // 绑定的数据
    const dataModel = useModel(() => props.data, emit.updateData, true, true, (val) => rootNode.setChildren(val as object[] || []))
    // 数据模拟出来的父节点
    const rootNode = mark.node.get({[props.childrenField]: dataModel.value}, 0, () => null as any, false)

    const state = reactive({
        tableWidth: null as null | number,                  // mounted的时候表格的宽度
        current: null as null | TableNode,                  // 当前选中的节点
        hoverPart: null as null | TableHoverPart,           // 当前鼠标所在的区域
        loading: null as null | boolean,                    // 表格内部自定义的加载行为
        bodyScrollGetter: null as (null | (() => PlainScroll)),// 获取body的函数，当body组件初始化之后，body会自动设置这个变量
        mark,
        rootNode,
    })

    const isLoading = computed({
        get() {
            return props.loading != null ? props.loading : state.loading
        },
        set(val: boolean | null) {
            state.loading = val
        },
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
    const tableData = computed(() => mark.node.getList(dataModel.value, 1, () => state.rootNode as TableNode, false))

    /**
     * 表格合计行数据，TableNode格式的数据
     * @author  韦胜健
     * @date    2020/8/13 22:35
     */
    const tableSummaryData = computed(() => mark.node.getList(props.summaryData, 1, () => null as any, true))


    const tableDataFlatter = computed(() => {
        const formatData = tableData.value          // 格式化之后的数据
        let index = 0                               // 索引
        const formatDataFlat: TableNode[] = []      // 格式化之后的展开的数据
        let maxShowLevel = 1                        // 树格式数据中，显示的最大层级数

        iterateTableNode(
            formatData,
            (node) => {
                if (node.level > maxShowLevel) {
                    maxShowLevel = node.level
                }
                // 这个index应该是一个非响应式属性，避免出现计算属性死循环的情况
                node.index = index++
                formatDataFlat.push(node)
            },
            (node) => {
                return !!props.childrenField && node.isExpand
            },
        )
        return {
            formatDataFlat: formatDataFlat.filter(node => node.isVisible),
            maxShowLevel,
        }
    })

    const formatFlatTableData = computed(() => tableDataFlatter.value.formatDataFlat)
    const maxShowLevel = computed(() => tableDataFlatter.value.maxShowLevel)

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

    // @ts-ignore
    const {fixedShadowClass} = useFixedShadow(() => !!state.bodyScrollGetter ? state.bodyScrollGetter!() : null)

    const classes = computed(() => [
        'pl-table',
        `pl-table-size-${styleComputed.value.size}`,
        `pl-table-shape-${styleComputed.value.shape}`,
        {
            'pl-table-border': props.border,
        },
        ...fixedShadowClass.value,
    ])

    /*---------------------------------------utils-------------------------------------------*/
    const utils = {
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
            methods.setCurrent(node)
            emit.clickRow(node, e)

            if ($plain.utils.hasClass(e.target as HTMLElement, ['plt-inner-cell', 'plt-cell'])) {
                emit.clickCell(node, e)
            }
        },
        dblclickRow: (e: MouseEvent, node) => {
            emit.dblclickRow(node, e)

            if ($plain.utils.hasClass(e.target as HTMLElement, ['plt-inner-cell', 'plt-cell'])) {
                emit.dblclickCell(node, e)
            }
        },
    }

    const methods = {
        setCurrent: (keyOrNode: string | TableNode | null) => {
            if (typeof keyOrNode === "string") {
                const node = mark.node.getByKey(keyOrNode)
                state.current = node as TableNode
            } else {
                state.current = keyOrNode
            }
        },
        getCurrent: () => {
            return state.current
        }
    }


    /*---------------------------------------refer-------------------------------------------*/
    const refer = {
        rootNode,

        dataModel,
        props,
        mark,
        slots,
        state,
        isLoading,
        propsState,
        plcData,
        bodyPlcList,
        totalContentWidth,

        refs,

        tableData,
        tableSummaryData,
        formatFlatTableData,
        maxShowLevel,
        isDisabledVirtualScroll,
        classes,

        emit,
        on,
        off,

        validateConfigData,
        utils,
        handler,
        methods,
    }

    useRefer(refer)

    /*---------------------------------------provider-------------------------------------------*/
    provide(PLAIN_TABLE_PROVIDER, refer)

    /*---------------------------------------lifecycle-------------------------------------------*/
    onMounted(() => {
        state.tableWidth = refs.$el.offsetWidth
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
            state,
            plcData,
            classes,
            isLoading,
        } = tableSetup(props)

        return () => (
            <div class={classes.value} {...{directives: [{name: 'loading', value: isLoading.value}]}}>

                <plc-collector ref="collector">{slots.default()}</plc-collector>

                {!!state.tableWidth && [<plt-head ref="head"/>, <plt-body ref="body"/>,]}

                {!!props.debugPlc && state.tableWidth && printPlcData(plcData.value!.plcList)}
            </div>
        )
    },
})