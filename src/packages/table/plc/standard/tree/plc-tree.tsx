import {designPlc} from "../../core/designPlc";
import {computed, onMounted, PropType, watch} from 'vue';
import {TableNode} from "../../../core/useTableNode";
import {TreeDropType} from "../../../../tree/utils/tree-constant";
import {useScopedSlots} from "../../../../../use/useScopedSlots";
import {Plc} from "../../core/plc.type";
import {SimpleObject} from "../../../../../shims";
import {injectPlainTable} from "../../../table";
import {unit} from "plain-utils/string/unit";

/*只显示展开收起按钮的时候的基本宽度，不算content宽度*/
const size = 30

export default designPlc({
    name: 'plc-tree',
    standardProps: {
        autoFixedLeft: {default: true},
        order: {default: -9996},
        width: {default: size},
        bodyCls: {default: 'plc-tree-node'},
    },
    externalProps: {
        contentWidth: {type: Number, default: 100},                         // 显示的内容宽度
        showCheckbox: {type: Boolean},                                      // 是否显示复选框
        rowDraggable: {type: Boolean},                                      // 行是否可以拖拽排序
        allowRowDraggable: {type: Function as PropType<(node: TableNode) => boolean>},// 行是否可以被拖拽放置到其他位置
        allowRowDroppable: {type: Function as PropType<(startNode: TableNode, moveNode: TableNode, dropType: TreeDropType) => boolean>},// 行是否可以被放置（放到子节点中，放到前面，放到后面）

        folderCollapseIcon: {type: String, default: 'el-icon-folder-s'},
        folderExpandIcon: {type: String, default: 'el-icon-folder-opened'},
        leafIcon: {type: String, default: 'el-icon-document'},
    },
    setup(props, ctx) {

        const plc = ctx.proxy as any as Plc;
        const table = injectPlainTable()
        const {scopedSlots} = useScopedSlots({content: {node: Object as PropType<TableNode>, plc: Object as PropType<Plc>, row: Object as PropType<SimpleObject>},}, true)

        const maxShowLevel = computed(() => {
            let ret = 0
            table.flatNodes.value.forEach(node => node.level > ret ? (ret = node.level) : null)
            return ret
        })
        /**
         * 动态列宽，当展开收起的时候，自动更新列宽
         * @author  韦胜健
         * @date    2020/8/24 9:35
         */
        const width = computed(() => {
            // 展开按钮的基本宽度
            let expand = size
            // 内容宽度，如果有content插槽，则加上props.contentWidth
            let content = scopedSlots.content.isExist() ? props.contentWidth : 0
            // 如果显示复选框，则宽度再加上size
            let check = props.showCheckbox ? size : 0
            // 如果显示拖拽排序按钮，则宽度再加上size
            let draggable = props.rowDraggable ? size : 0

            // 每一层都增加一个左边距 (expand + check) * level，所以每一层都加上这个宽度
            const level = maxShowLevel.value
            // 最后最大层的宽度
            return expand * (level - 1) + (content + expand + check + draggable)
        })

        const utils = {
            getExpanderAttrs: (node: TableNode) => {
                return {
                    style: {marginLeft: unit((node.level - 1) * size)} as any,
                }
            },
        }

        const methods = {
            ...table.expandMethods,
            ...table.checkMethods,
        }

        const handler = {
            ...table.handler,
        }

        onMounted(() => {
            watch(() => maxShowLevel.value, () => {
                plc.state.width = width.value
            }, {immediate: true})
        })

        Object.assign(ctx.proxy, methods)

        return {
            props,
            scopedSlots,
            handler,
            utils,
        }
    },
}, {
    summary: () => null,
    default: ({refer, node, plc, row}) => {
        return (
            <>
                <div class="plc-tree-node-expander" {...refer.utils.getExpanderAttrs(node)}>
                    <pl-button
                        loading={node.loading}
                        mode="text"
                        size="normal"
                        icon={node.isLeaf ? refer.props.leafIcon : node.expand ? refer.props.folderExpandIcon : refer.props.folderCollapseIcon}
                        onClick={(e: MouseEvent) => !node.isLeaf && refer.handler.onClickExpandIcon(e, node)}/>
                </div>
                {refer.scopedSlots.content.isExist() && (
                    <div class="plc-tree-node-content">
                        {refer.scopedSlots.content({node, row, plc}, !plc.props.field ? null : row[plc.props.field])}
                    </div>
                )}
            </>
        )
    }
})