import {definePlc} from "@/packages/table/plc-components/register";
import {PlcType, TableRenderData} from "@/packages/table/plc/plc";
import {TableNode} from "@/packages/table/table-bak/TableNode";
import {injectTable} from "@/packages/table/table/table";
import {getCurrentInstance, Ref, watch} from "@vue/composition-api";
import {$plain} from "@/packages/base";
import {usePlcTree} from "@/packages/table/plc-components/standard/tree/use-plc-tree";

export default definePlc({
    name: 'plc-tree',
    props: {

        //standard
        autoFixedLeft: {default: true},
        order: {default: -9996},
        width: {default: 60},
        summary: {
            type: Function,
            default: function () {return null}
        },
        head: {
            type: Function,
            default: function (plc: PlcType) {
                return '收起'
            }
        },
        default: {
            type: Function,
            default: function ({rowData, plc}: TableRenderData) {
                const ctx = plc.ctx as any
                return (
                    <div style={ctx.treePlc.styleUtils.getStyles(rowData)} class={ctx.treePlc.styleUtils.getClasses(rowData)}>
                        <span class="pl-tree-node-expander">
                            {rowData.isLoading ? <pl-loading type="beta"/> : (
                                !rowData.isLeaf && <pl-button mode="text" icon="el-icon-caret-right" onClick={(e) => ctx.treePlc.handler.clickExpandIcon(e, rowData)}/>
                            )}
                        </span>
                    </div>
                )
            }
        },
    },
    setup() {

        const table = injectTable()
        const ctx = getCurrentInstance() as any

        const {
            utils,
            methods,
            handler,
            emitExpandKeys,
            emitCheckKeys,
        } = usePlcTree({
            mark: table.mark,
            loading: table.loading,
            getChildren: table.props.getChildren,
            lazy: table.props.lazy,
            rootTableNode: table.state.rootNode,
            according: table.props.according,
            autoExpandParent: table.props.autoExpandParent,
            emit: table.emit,
            tableData: table.tableData as Ref<TableNode[]>,
        })

        const styleUtils = {
            getStyles(rowData: TableNode) {
                return {
                    paddingLeft: $plain.utils.suffixPx((rowData.level - 1) * 60)
                }
            },
            getClasses(rowData: TableNode) {
                return [
                    'plc-tree-node',
                    {'plc-tree-node-expanded': rowData.isExpand},
                ]
            },
        }

        watch(() => table.maxShowLevel.value, val => ctx.state.width = val * 60, {lazy: true})

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