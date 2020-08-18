import {definePlc} from "@/packages/table/plc-components/register";
import {PlcType, TableRenderData} from "@/packages/table/plc/plc";
import {TableNode} from "@/packages/table/table/TableNode";
import {injectTable} from "@/packages/table/table/table";
import {computed, getCurrentInstance, onMounted, Ref, watch} from "@vue/composition-api";
import {$plain} from "@/packages/base";
import {usePlcTree} from "@/packages/table/plc-components/standard/tree/use-plc-tree";
import {ScopedSlotFunc, useScopedSlots} from "@/use/useScopedSlots";
import {useEvent} from "@/use/useEvent";

const size = 30

export default definePlc({
    name: 'plc-tree',
    props: {
        // custom
        contentWidth: {type: Number, default: 100},                       // 显示的内容宽度
        showCheckbox: {type: Boolean},                                    // 是否显示复选框

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
                    <div style={ctx.treePlc.styleUtils.getStyles(rowData)} class={ctx.treePlc.styleUtils.getClasses(rowData)}>
                        <div class="plc-tree-node-expander">
                            {rowData.isLoading ? <pl-loading type="beta"/> : (
                                !rowData.isLeaf && <pl-button mode="text"
                                                              size={'normal'}
                                                              icon={rowData.isExpand ? 'el-icon-caret-bottom' : 'el-icon-caret-right'}
                                                              onClick={(e) => ctx.treePlc.handler.clickExpandIcon(e, rowData)}/>
                            )}
                        </div>
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
    setup(props) {

        const table = injectTable()
        const ctx = getCurrentInstance() as any
        const {$scopedSlots} = useScopedSlots({
            content: ScopedSlotFunc,
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
            checkStrictly: table.props.checkStrictly,
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

        const width = computed(() => {
            let expand = size
            let content = !!$scopedSlots.content ? (props as any).contentWidth as number : 0
            let check = !!(props as any).showCheckbox ? size : 0

            const level = table.maxShowLevel.value

            return (expand + check) * level + content
        })

        onMounted(() => {
            watch(() => table.maxShowLevel.value, () => {
                ctx.state.width = width.value
            })
        })

        return {
            treePlc: {
                styleUtils,

                utils,
                methods,
                handler,
                emitExpandKeys,
                emitCheckKeys,
            }
        }
    },
})