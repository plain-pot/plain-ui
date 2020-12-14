import {designComponent} from "../../use/designComponent";
import {useScopedSlots} from "../../use/useScopedSlots";
import {useModel} from "../../use/useModel";
import {computed, nextTick, PropType} from 'vue';
import './tree.scss'
import {useStyles} from "../../use/useStyles";
import {TreeProps} from "./core/props";
import {TreeUtils} from "./core/utils";
import {useTree} from "./core/node";
import {TreeNode} from "./core/type";
import VirtualList from '../virutal-list/virtual-list'
import {useRefs} from "../../use/useRefs";
import {useTreeDraggier} from './core/drag';
import Scroll from '../scroll/scroll'

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

        const {refs} = useRefs({
            list: VirtualList,
            scroll: Scroll,
        })

        const tree = useTree({
            props,
            event,
        })

        /*---------------------------------------state-------------------------------------------*/
        /*作用域插槽*/
        const {scopedSlots} = useScopedSlots({
            default: {node: Object as PropType<TreeNode>, index: Number},
        })
        /*当前高亮节点的key*/
        const current = useModel(() => props.currentKey, emit.onUpdateCurrent)

        /*---------------------------------------computer-------------------------------------------*/
        /*tree node content公共的样式*/
        const contentStyles = useStyles(style => {style.height = `${props.nodeHeight}px`})

        /*当前展开的keys数组*/
        const expandKeys = computed(() => tree.state.expand.getActiveKeys())
        /*当前选中的keys数组*/
        const checkKeys = computed(() => tree.state.check.getActiveKeys())

        /*---------------------------------------methods-------------------------------------------*/

        const methods = {
            /**
             * 选中某一个树节点
             * @author  韦胜健
             * @date    2020/3/31 9:26
             */
            setCurrent(keyOrNode: string | TreeNode) {
                const node = tree.methods.getNode(keyOrNode)
                if (!!node) {
                    current.value = node.key
                    emit.onCurrentChange(node)
                }
            },
            /**
             * 获取当前选中节点
             * @author  韦胜健
             * @date    2020/3/31 9:39
             */
            getCurrent(): TreeNode | null {
                if (!current.value) return null
                return tree.methods.getNode(current.value)
            },
        }

        const expandMethods = {
            expand: async (keyOrNode: string | TreeNode | (string | TreeNode)[]) => {
                await tree.utils.handleKeyOrNode(keyOrNode,
                    async (node) => {
                        const parent = node.parentRef()
                        if (!node.expand) {
                            if (
                                props.lazy &&                           // 懒加载模式
                                !node.loaded &&                       // 未曾加载过子节点数据
                                !node.isLeaf                            // 节点不是叶子节点
                            ) {
                                const children = await tree.utils.getChildrenAsync(node)
                                tree.methods.setChildrenData(node, children || [])
                                await nextTick()
                            }

                            if (props.according) {
                                // 手风琴模式，展开某一个节点的时候，关闭兄弟节点
                                if (!!parent && !!parent.children) {
                                    parent.children.forEach((child: TreeNode) => child.key !== node.key && expandMethods.collapse(child))
                                }
                            }
                            node.expand = true
                            await nextTick()

                            emit.onExpand(node)
                            emit.onExpandChange(expandKeys.value)
                        }
                        if (!!props.autoExpandParent && !!parent && parent.level !== 0) {
                            await expandMethods.expand(parent)
                        }
                    })
            },
            collapse: async (keyOrNode: string | TreeNode | (string | TreeNode)[]) => {
                await tree.utils.handleKeyOrNode(keyOrNode,
                    async (node) => {
                        await TreeUtils.iterateAll({
                            nodes: [node, ...(node.children || [])],
                            handler: (node) => {
                                if (node.expand) {
                                    node.expand = false
                                    emit.onCollapse(node)
                                }
                            }
                        })
                        await nextTick()
                        emit.onExpandChange(expandKeys.value)
                    })
            },
            toggleExpand: (keyOrNode: string | TreeNode) => tree.methods.getNode(keyOrNode).expand ? expandMethods.collapse(keyOrNode) : expandMethods.expand(keyOrNode),
            expandAll: () => TreeUtils.iterateAll({nodes: tree.state.root.children, handler: node => node.expand = true}),
            collapseAll: () => tree.state.expand.clear(),
        }

        const checkMethods = {
            check: async (keyOrNode: string | TreeNode | (string | TreeNode)[]) => {
                await tree.utils.handleKeyOrNode(keyOrNode, async (node) => {
                    if (node.check || !node.isCheckable) {
                        return
                    }
                    node.check = true
                    // 父子关联模式下，改变子节点以及父节点状态
                    if (!props.checkStrictly) {
                        // 选中所有子节点
                        TreeUtils.iterateAll({
                            nodes: node.children,
                            handler: (child) => child.check = true,
                        })
                        // 更新父节点状态，如果父节点所有的子节点都处于选中状态，则更新父节点为选中状态
                        let parent = node.parentRef()
                        while (!!parent && !!parent.key) {
                            if (!!parent.parentRef && parent.children!.every(child => tree.state.check.get(child))) {
                                parent.check = true
                                parent = !!parent.parentRef ? parent.parentRef() : null
                            } else {
                                break
                            }
                        }
                    }

                    await nextTick()
                    emit.onCheck(node)
                    emit.onCheckChange(checkKeys.value)
                })
            },
            uncheck: async (keyOrNode: string | TreeNode | (string | TreeNode)[]) => {
                await tree.utils.handleKeyOrNode(keyOrNode, async node => {
                    if (!node.check || !node.isCheckable) {
                        return
                    }
                    node.check = false

                    // 父子关联模式下，改变子节点以及父节点状态
                    if (!props.checkStrictly) {
                        // 取消选中所有子节点
                        TreeUtils.iterateAll({
                            nodes: node.children,
                            handler: (child) => child.check = false,
                        })
                        // 更新父节点状态，如果父节点所有的子节点都处于非选中状态，则更新父节点为非选中状态
                        let parent = node.parentRef()
                        while (!!parent && !!parent.key) {
                            if (parent.check) {
                                parent.check = false
                                parent = parent.parentRef()
                            } else {
                                break
                            }
                        }
                    }

                    await nextTick()
                    emit.onUncheck(node)
                    emit.onCheckChange(checkKeys.value)
                })
            },
            toggleCheck: (keyOrNode: string | TreeNode) => tree.methods.getNode(keyOrNode).check ? checkMethods.uncheck(keyOrNode) : checkMethods.check(keyOrNode),
            checkAll: () => TreeUtils.iterateAll({nodes: tree.state.root.children, handler: node => node.check = true}),
            uncheckAll: () => tree.state.check.clear(),
            getCheckedData: () => tree.state.check.getActiveKeys().map(tree.methods.getNode),
            refreshCheckStatus: async (keyOrNode: string | TreeNode) => {
                await tree.utils.handleKeyOrNode(keyOrNode, async node => {
                    /*刷新选中状态的前提是有子节点数据*/
                    if (props.checkStrictly || node.isLeaf || !node.children || node.children.length === 0) {
                        return
                    }
                    let hasCheck = false, hasUncheck = false;
                    node.children.forEach(chlid => chlid.check ? hasCheck = true : hasUncheck = true)
                    if (node.check && hasUncheck) {
                        // 自身选中而子节点有非选中,令所有父节点变成非选中状态
                        let parents = tree.utils.getParents(node);
                        [...parents, node].forEach(n => n.check = false)
                    }
                    if (!node.check && hasCheck && !hasUncheck) {
                        // 自身非选中而子节点全部选中，令所有父节点变成选中状态
                        let parents = tree.utils.getParents(node);
                        [...parents, node].forEach(n => n.check = true)
                    }
                })
            },
        }

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            /**
             * 点击展开图标
             * @author  韦胜健
             * @date    2020/11/28 15:54
             */
            onClickExpandIcon: async (e: MouseEvent, node: TreeNode) => {
                e.stopPropagation()
                await expandMethods.toggleExpand(node)
            },
            /**
             * 点击节点内容
             * @author  韦胜健
             * @date    2020/11/28 15:54
             */
            onClickTreeNodeContent: async (node: TreeNode) => {
                emit.onClickNode(node)
                methods.setCurrent(node)
                props.expandOnClickNode && (await expandMethods.toggleExpand(node));
                props.checkOnClickNode && (await checkMethods.toggleCheck(node));
            },
            /**
             * 处理点击复选框事件
             * @author  韦胜健
             * @date    2020/11/28 17:07
             */
            onClickCheckbox: async (e: MouseEvent, node: TreeNode) => {
                e.stopPropagation()
                await checkMethods.toggleCheck(node)
            }
        }

        /*---------------------------------------draggier-------------------------------------------*/

        /*const draggier = useListDraggierWithVirtual({
            rowClass: 'pl-tree-node',
            onChange: (start, end) => {
                console.log({start, end})
            },
            getScroll: () => refs.list!.refs.scroll!,
        })*/
        const draggier = useTreeDraggier<TreeNode>({
            rowClass: 'pl-tree-node',
            dragClass: 'pl-tree-node-draggier',
            intent: props.intent,
            flatList: tree.flatList,
            allowDrag: props.allowDrag,
            allowDrop: props.allowDrop,
            expand: (node: TreeNode) => expandMethods.expand(node),
            getScroll: () => props.virtual ? refs.list!.refs.scroll! : refs.scroll!,
            refreshCheckStatus: () => {
                if (!props.showCheckbox) return
                if (props.checkStrictly) return;

                const next = (node: TreeNode) => {
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

                if (!!tree.flatList.value) {
                    tree.flatList.value.forEach(next)
                }
            },
        })

        /*---------------------------------------init-------------------------------------------*/

        tree.utils.initialize()

        if (props.defaultExpandAll) nextTick().then(() => expandMethods.expandAll())

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
                             onClick={() => handler.onClickTreeNodeContent(node)}>
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
                methods: {
                    ...methods,
                    ...expandMethods,
                    ...checkMethods,
                },
            },
            render: () => {
                return (
                    <div class="pl-tree" style={{height: props.height}} v-loading={props.loading || tree.state.root.loading}>
                        {tree.flatList.value.length === 0 ? (
                            <div class="pl-tree-placeholder" key="placeholder">
                                <pl-icon icon="el-icon-folder-opened"/>
                                <span>{props.emptyText}</span>
                            </div>
                        ) : (
                            props.virtual ?
                                (<pl-virtual-list
                                    ref="list"
                                    data={tree.flatList.value}
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
                                            {tree.flatList.value.map((node, index) => render.node(node, index))}
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