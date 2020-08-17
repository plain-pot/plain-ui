import {definePlc} from "@/packages/table/plc-components/register";
import {PlcType, TableRenderData} from "@/packages/table/plc/plc";
import {TableNode} from "@/packages/table/table-bak/TableNode";
import {injectTable} from "@/packages/table/table/table";
import {getCurrentInstance, Ref, watch} from "@vue/composition-api";
import {$plain} from "@/packages/base";
import {usePlcTree} from "@/packages/table/plc-components/standard/tree/use-plc-tree";

const size = 30

export default definePlc({
    name: 'plc-tree',
    props: {

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
                    <pl-button
                        {...{directives: [{name: 'tooltip', value: '全部收起'}]}}
                        mode="text"
                        icon="el-icon-arrow-right"
                        onClick={(plc.ctx as any).treePlc.methods.collapseAll}
                    />
                )
            }
        },
        default: {
            type: Function,
            default: function ({rowData, plc}: TableRenderData) {
                const ctx = plc.ctx as any
                return (
                    <div style={ctx.treePlc.styleUtils.getStyles(rowData)} class={ctx.treePlc.styleUtils.getClasses(rowData)}>
                        <div class="pl-tree-node-expander">
                            {rowData.isLoading ? <pl-loading type="beta"/> : (
                                <pl-button mode="text"
                                           disabled={rowData.isLeaf}
                                           icon="el-icon-arrow-right"
                                           onClick={(e) => ctx.treePlc.handler.clickExpandIcon(e, rowData)}/>
                            )}
                        </div>
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

        watch(() => table.maxShowLevel.value, val => ctx.state.width = val * size, {lazy: true})

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