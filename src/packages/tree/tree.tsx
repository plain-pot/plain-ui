import {designComponent} from "../../use/designComponent";
import {useScopedSlots} from "../../use/useScopedSlots";
import {computed, nextTick, PropType} from 'vue';
import './tree.scss'
import {useStyles} from "../../use/useStyles";
import {TreeProps} from "./core/props";
import {TreeUtils} from "./core/utils";
import {TreeNode} from "./core/type";
import VirtualList from '../virutal-list/virtual-list'
import {useRefs} from "../../use/useRefs";
import {useTreeDraggier} from './core/drag';
import Scroll from '../scroll/scroll'
import {delay} from "plain-utils/utils/delay";
import {useTree} from "./core/useTree";
import {createKeyHandler} from "../../utils/createKeyHandler";

export default designComponent({
    name: 'pl-tree',
    props: {
        ...TreeProps,
    },
    emits: {
        onClickNode: (node: TreeNode) => true,                        // 点击节点事件
        onUpdateCurrent: (current?: string) => true,                  // 当前高亮节点key变化绑定事件
        onCurrentChange: (node: TreeNode | null) => true,             // 当前高亮节点变化事件
        onUpdateData: (data?: any[]) => true,                         // 数据变化事件（拖拽排序、数据懒加载）

        onExpandChange: (expandKeys: string[]) => true,               // 展开节点变化事件
        onExpand: (node: TreeNode) => true,                           // 展开事件
        onCollapse: (node: TreeNode) => true,                         // 关闭节点事件

        onCheckChange: (checkKeys: string[]) => true,                 // 选中节点变化事件
        onCheck: (node: TreeNode) => true,                            // 选中节点事件
        onUncheck: (node: TreeNode) => true,                          // 取消选中节点事件
    },
    setup({props, event}) {

        const {emit} = event
        const {refs} = useRefs({list: VirtualList, scroll: Scroll,})
        const {scopedSlots} = useScopedSlots({default: {node: Object as PropType<TreeNode>, index: Number},})
        const {state, methods, current, handler, utils} = useTree<TreeNode>({props, emit, keyManager: createKeyHandler('tree'),})

        /*tree node content公共的样式*/
        const contentStyles = useStyles(style => {style.height = `${props.nodeHeight}px`})
        /**
         * 拍-平的树形数据（不拍平无法实现虚拟滚动）
         * @author  韦胜健
         * @date    2020/12/2 12:16
         */
        const flatList = computed(() => {
            let result: (TreeNode)[] = []
            if (!state.root) {
                return []
            }
            utils.iterate({
                nodes: state.root.children,
                iterateChildren: (treeNode) => treeNode.expand,
                handler: (treeNode) => {
                    result.push(treeNode)
                    // console.log(treeNode.label, {'!treeNode.isLeaf': !treeNode.isLeaf, 'treeNode.loaded': treeNode.loaded, 'treeNode.isVisible': treeNode.isVisible, 'treeNode.expand': treeNode.expand, 'treeNode.children': treeNode.children,})
                    if (
                        !treeNode.isLeaf &&
                        treeNode.loaded &&
                        treeNode.isVisible &&
                        treeNode.expand &&
                        treeNode.children!.length === 0
                    ) {
                        result.push({
                            key: `@@empty_${treeNode.key}`,
                            parentRef: () => treeNode,
                            empty: true,
                            level: treeNode.level + 1,
                        } as TreeNode)
                    }
                },
            },)
            result = result.filter((treeNode) => treeNode.empty ? true : !!treeNode.isVisible)
            result.forEach((node, index) => node.index = index)
            return result
        })

        /*---------------------------------------draggier-------------------------------------------*/

        const draggier = useTreeDraggier<TreeNode>({
            rowClass: 'pl-tree-node',
            dragClass: 'pl-tree-node-draggier',
            intent: props.intent,
            flatList,
            allowDrag: props.allowDrag,
            allowDrop: props.allowDrop,
            expand: (node: TreeNode) => methods.expand(node),
            getScroll: () => props.virtual ? refs.list!.refs.scroll! : refs.scroll!,
            refreshCheckStatus: async () => {
                if (!props.showCheckbox) return
                if (props.checkStrictly) return;

                await nextTick()
                await delay(120)

                const next = (node: TreeNode) => {

                    if (!node.parentRef) {
                        return
                    }

                    let hasCheck = false
                    let hasUncheck = false

                    if (!!node.children) {
                        node.children.forEach(child => {
                            next(child)
                            if (child.check) {
                                hasCheck = true
                            } else {
                                hasUncheck = true
                            }
                        })
                    }
                    if (hasCheck && !hasUncheck) {
                        // 所有子节点选中
                        if (!node.check) {
                            node.check = true
                        }
                    } else if (hasUncheck) {
                        // 有子节点未选中
                        if (node.check) {
                            node.check = false
                        }
                    }
                }

                if (!!flatList.value) {
                    flatList.value.forEach(next)
                }
            },
        })

        const render = {
            node: (node: TreeNode, index: number) => {
                if (node.empty) {
                    return render.empty(node)
                }
                return (
                    <pl-item
                        key={node.key}
                        class={TreeUtils.getTreeNodeClasses(node, current.value)}
                        style={TreeUtils.getTreeNodeStyles(node.level, props.intent, props.nodeHeight)}
                        vid={index}>

                        <div class="pl-tree-node-operator">
                            {!!props.showCheckbox && <pl-checkbox
                                checkStatus={node.checkStatus}
                                disabled={!node.isCheckable}
                                onClick={(e: MouseEvent) => handler.onClickCheckbox(e, node)}
                            />}
                            <div class="pl-tree-node-expander">
                                {node.loading ?
                                    <pl-loading type="gamma"/> :
                                    <pl-icon icon={node.isLeaf ? props.leafIcon : node.expand ? props.folderExpandIcon : props.folderCollapseIcon}
                                             onClick={(e: MouseEvent) => handler.onClickExpandIcon(e, node)}/>
                                }
                            </div>
                            {!!props.draggable && <pl-icon icon="el-icon-list" class="pl-tree-node-draggier" onMousedown={draggier.handler.mousedown}/>}
                            {!!props.nodeIcon && <pl-icon icon={props.nodeIcon(node)}/>}
                        </div>
                        <div class="pl-tree-node-content"
                             style={contentStyles.value}
                             onClick={(e: MouseEvent) => handler.onClickCell(e, node)}>
                            {scopedSlots.default({node, index}, !!props.renderContent ? props.renderContent({node, index}) : node.label)}
                        </div>
                    </pl-item>
                )
            },
            empty: (emptyNode: TreeNode) => {
                const parent = emptyNode.parentRef()!
                return (
                    <pl-item
                        key={`${parent.key}_empty`}
                        class="pl-tree-node pl-tree-empty-node"
                        style={TreeUtils.getTreeNodeStyles(parent.level + 1, props.intent, props.nodeHeight)}>
                        <div class="pl-tree-node-operator">
                            <div class="pl-tree-node-expander">
                                <pl-icon icon="el-icon-close-bold"/>
                            </div>
                        </div>
                        <div class="pl-tree-node-content" style={contentStyles.value}>
                            <span>{props.emptyText}</span>
                        </div>
                    </pl-item>
                )
            },
        }

        return {
            refer: {
                ...methods,
            },
            render: () => {
                return (
                    <div class="pl-tree" style={{height: props.height}} v-loading={props.loading || (!!state.root && state.root.loading)}>
                        {flatList.value.length === 0 ? (
                            <div class="pl-tree-placeholder" key="placeholder">
                                <pl-icon icon="el-icon-folder-opened"/>
                                <span>{props.emptyText}</span>
                            </div>
                        ) : (
                            props.virtual ?
                                (<pl-virtual-list
                                    ref="list"
                                    data={flatList.value}
                                    size={props.nodeHeight}
                                    v-slots={{
                                        // default: ({item, index}: { item: TreeNode, index: number }) => render.node(item, index),
                                        content: ({data}: { data: { item: TreeNode, index: number }[] }) => (
                                            <pl-list direction="top" class="pl-tree-node-list">
                                                {data.map(({item, index}) => render.node(item, index))}
                                            </pl-list>
                                        )
                                    }}
                                />) : (
                                    <pl-scroll ref="scroll">
                                        <pl-list direction="top" className="pl-tree-node-list">
                                            {flatList.value.map((node, index) => render.node(node, index))}
                                        </pl-list>
                                    </pl-scroll>
                                )
                        )}
                    </div>
                )
            }
        }
    },
})