import {definePlc} from "@/packages/table/plc-components/register";
import {PlcType, TableRenderData} from "@/packages/table/plc/plc";
import {TableNode} from "@/packages/table/table/TableNode";
import {injectTable} from "@/packages/table/table/table";
import {computed, getCurrentInstance, onMounted, Ref, watch} from "@vue/composition-api";
import {$plain} from "@/packages/base";
import {usePlcTree} from "@/packages/table/plc-components/standard/tree/use-plc-tree";
import {ScopedSlotFunc, useScopedSlots} from "@/use/useScopedSlots";
import {useEvent} from "@/use/useEvent";
import {usePlcTreeRowDraggable} from "@/packages/table/plc-components/standard/tree/use-plc-tree-row-draggable";
import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";
import {PlcProps} from "@/packages/table/plc/plc-utils";

/*只显示展开收起按钮的时候的基本宽度，不算content宽度*/
const size = 30

const CustomProps = {
    contentWidth: {type: Number, default: 100},                       // 显示的内容宽度
    showCheckbox: {type: Boolean},                                    // 是否显示复选框
    checkStrictly: {type: Boolean},                                   // 是否严格按照父子关联进行选择
    rowDraggable: {type: Boolean},                                    // 行是否可以拖拽排序
}

export default definePlc({
    name: 'plc-tree',
    props: {
        // custom
        ...CustomProps,

        //standard
        autoFixedLeft: {default: true},
        noPadding: {default: true},
        order: {default: -9996},
        width: {default: size},
        summary: {
            type: Function,
            default: function () {return null}
        },
        head: {
            type: Function,
            default: function (plc: PlcType) {
                return (
                    <pl-dropdown>
                        <pl-button mode="text" icon="el-icon-menu" size={'normal'}/>
                        <pl-dropdown-menu slot="dropdown">
                            <pl-dropdown-item label={'全部展开'} onClick={(plc.ctx as any).treePlc.methods.expandAll} icon={'el-icon-caret-right'}/>
                            <pl-dropdown-item label={'全部收起'} onClick={(plc.ctx as any).treePlc.methods.collapseAll} icon={'el-icon-caret-bottom'}/>
                            {
                                (plc as any).ctx.showCheckbox && [
                                    <pl-dropdown-item label={'全选'} onClick={(plc.ctx as any).treePlc.methods.checkAll} icon={'el-icon-check'}/>,
                                    <pl-dropdown-item label={'反选'} onClick={(plc.ctx as any).treePlc.methods.uncheckAll} icon={'el-icon-close'}/>,
                                ]
                            }
                        </pl-dropdown-menu>
                    </pl-dropdown>
                )
            }
        },
        default: {
            type: Function,
            default: function (renderData: TableRenderData) {
                const {rowData, plc} = renderData
                const ctx = plc.ctx as any
                return (
                    <div style={ctx.treePlc.styleUtils.getStyles(rowData)}
                         class={ctx.treePlc.styleUtils.getClasses(rowData)}>
                        <div class="plc-tree-node-expander">
                            {rowData.isLoading ? <pl-loading type="beta"/> : (
                                !rowData.isLeaf && <pl-button mode="text"
                                                              size={'normal'}
                                                              icon={rowData.isExpand ? 'el-icon-caret-bottom' : 'el-icon-caret-right'}
                                                              onClick={(e) => ctx.treePlc.handler.clickExpandIcon(e, rowData)}/>
                            )}
                        </div>
                        {!!ctx.rowDraggable && (
                            <pl-button icon="el-icon-rank"
                                       mode="text"
                                       {...{nativeOn: {mousedown: ctx.treeDraggablePlc.handler.mousedown}}}
                                       class="plc-tree-drag-btn"
                            />
                        )}
                        {!!ctx.showCheckbox && (
                            <div class="plc-tree-node-check">
                                <pl-checkbox-indeterminate
                                    size={'normal'}
                                    checkboxProps={{value: rowData.checkStatus === 'check'}}
                                    status={rowData.checkStatus}
                                    disabled={!rowData.isCheckable}
                                    {...{nativeOn: {click: e => ctx.treePlc.handler.clickCheckbox(e, rowData)}}}
                                />
                            </div>
                        )}
                        {
                            !!ctx.$scopedSlots.content && (
                                <div class="plc-tree-node-content">
                                    {ctx.$scopedSlots.content(renderData)}
                                </div>
                            )
                        }
                    </div>
                )
            }
        },
    },
    // @ts-ignore
    setup(props: ExtractPropTypes<typeof PlcProps> & ExtractPropTypes<typeof CustomProps>) {

        const table = injectTable()
        const ctx = getCurrentInstance() as any
        const {$scopedSlots} = useScopedSlots({
            content: ScopedSlotFunc,    // 自定义显示的内容的作用域插槽
        })

        const {emit} = useEvent({
            expand: (node: TableNode) => {},
            collapse: (node: TableNode) => {},
            expandChange: (expandKeys: string[]) => {},

            check: (node: TableNode) => {},
            uncheck: (node: TableNode) => {},
            checkChange: (checkKeys: string[]) => {},
        })

        const {
            utils,
            methods,
            handler,
            emitExpandKeys,
            emitCheckKeys,
        } = usePlcTree({
            mark: table.mark,
            isLoading: table.isLoading,
            getChildren: table.props.getChildren,
            lazy: table.props.lazy,
            rootTableNode: table.state.rootNode,
            according: table.props.according,
            autoExpandParent: table.props.autoExpandParent,
            emit,
            tableData: table.tableData as Ref<TableNode[]>,
            checkStrictly: props.checkStrictly,
        })

        const styleUtils = {
            getStyles(rowData: TableNode) {
                return {
                    paddingLeft: $plain.utils.suffixPx((rowData.level - 1) * size)
                }
            },
            getClasses(rowData: TableNode) {
                return [
                    'plc-tree-node',
                    {'plc-tree-node-expanded': rowData.isExpand},
                ]
            },
        }

        /**
         * 动态列宽，当展开收起的时候，自动更新列宽
         * @author  韦胜健
         * @date    2020/8/24 9:35
         */
        const width = computed(() => {
            // 展开按钮的基本宽度
            let expand = size
            // 内容宽度，如果有content插槽，则加上props.contentWidth
            let content = !!$scopedSlots.content ? (props as any).contentWidth as number : 0
            // 如果显示复选框，则宽度再加上size
            let check = !!(props as any).showCheckbox ? size : 0
            // 如果显示拖拽排序按钮，则宽度再加上size
            let draggable = !!(props as any).rowDraggable ? size : 0

            // 每一层都增加一个左边距 (expand + check) * level，所以每一层都加上这个宽度
            const level = table.maxShowLevel.value

            // 最后最大层的宽度
            return expand * (level - 1) + (content + expand + check + draggable)
        })

        onMounted(() => {
            watch(() => table.maxShowLevel.value, () => {
                ctx.state.width = width.value
            })
        })

        const treeDraggablePlc = usePlcTreeRowDraggable({
            flatDataList: table.formatFlatTableData,
            rowDraggable: props.rowDraggable,
            rowClass: 'plt-row',
            nodeClass: 'plc-tree-node',
            levelPadding: size,
            showCheckbox: props.showCheckbox,
            checkStrictly: props.checkStrictly,
        })

        return {
            treePlc: {
                styleUtils,

                utils,
                methods,
                handler,
                emitExpandKeys,
                emitCheckKeys,
            },
            treeDraggablePlc,
        }
    },
})