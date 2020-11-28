import {designComponent} from "../../use/designComponent";
import {TreeEmptyNode, TreeNode} from "./utils/TreeNode";
import {useScopedSlots} from "../../use/useScopedSlots";
import {useModel} from "../../use/useModel";
import {TreeMark} from "./utils/TreeMark";
import {computed, nextTick, reactive, watch} from 'vue';
import './tree.scss'
import {useStyles} from "../../use/useStyles";
import {TreeProps} from "./core/props";
import {TreeUtils} from "./core/utils";

export default designComponent({
    name: 'pl-tree',
    props: {
        ...TreeProps,
    },
    emits: {
        clickNode: (node: TreeNode) => true,                        // 点击节点事件
        updateCurrent: (current?: string) => true,                   // 当前高亮节点key变化绑定事件
        currentChange: (node: TreeNode | null) => true,             // 当前高亮节点变化事件
        updateData: (data?: any[]) => true,              // 数据变化事件（拖拽排序、数据懒加载）

        expandChange: (expandKeys: string[]) => true,               // 展开节点变化事件
        expand: (node: TreeNode) => true,                           // 展开事件
        collapse: (node: TreeNode) => true,                         // 关闭节点事件

        checkChange: (checkKeys: string[]) => true,                 // 选中节点变化事件
        check: (node: TreeNode) => true,                            // 选中节点事件
        uncheck: (node: TreeNode) => true,                          // 取消选中节点事件
    },
    setup({props, event: {emit}}) {

        /*---------------------------------------state-------------------------------------------*/
        /*作用域插槽*/
        const {scopedSlots} = useScopedSlots({
            default: {node: TreeNode, index: Number},
        })
        /*树形数据*/
        const data = useModel(() => props.data, emit.updateData)
        /*当前高亮节点的key*/
        const current = useModel(() => props.currentKey, emit.updateCurrent)
        /*tree mark*/
        const treeMark = new TreeMark(() => ({
            keyField: props.keyField,
            labelField: props.labelField,
            childrenField: props.childrenField!,
            isCheckable: props.isCheckable,
            isLeaf: props.isLeaf,
            checkStrictly: props.checkStrictly,
            filterNodeMethod: props.filterNodeMethod,
            intent: props.intent,
            lazy: props.lazy,
        }))
        /*伪造的跟节点的key*/
        const rootTreeNode = treeMark.node.get({[props.childrenField!]: data.value}, 0, () => ({}) as any)

        const state = reactive({
            treeMark,
            rootTreeNode,
            loading: false,
        })

        /*---------------------------------------computer-------------------------------------------*/
        /*tree node content公共的样式*/
        const contentStyles = useStyles(style => {style.height = `${props.nodeHeight}px`})
        /*格式化得到的TableNode树形数据*/
        const formatData = computed(() => {
            const ret = state.treeMark.node.getList(data.value, 1, () => state.rootTreeNode)
            /*这里需要遍历所有的节点，不然 treeMark.node.state.map 中没有记录节点的key，导致在findNodeByKey的时候找不到*/
            TreeUtils.iterateAll(ret, node => node)
            return ret
        })
        /*拍平的树形数据（不拍平无法实现虚拟滚动）*/
        const formatDataFlat = computed(() => {
            const format = formatData.value
            const formatDataFlat: (TreeNode | TreeEmptyNode)[] = []
            TreeUtils.iterateAll(format,
                (treeNode: TreeNode) => {
                    formatDataFlat.push(treeNode)
                    if (
                        !treeNode.isLeaf &&
                        treeNode.isLoaded &&
                        treeNode.isExpand &&
                        treeNode.children!.length === 0
                    ) {
                        formatDataFlat.push(() => treeNode)
                    }
                },
                (treeNode: TreeNode) => treeNode.isExpand
            )
            return formatDataFlat.filter((treeNode) => typeof treeNode === "function" ? true : !!treeNode.isVisible)
        })

        /*当前展开的keys数组*/
        const expandKeys = computed(() => state.treeMark.expand.getActiveKeys())
        /*当前选中的keys数组*/
        const checkKeys = computed(() => state.treeMark.check.getActiveKeys())

        /*---------------------------------------methods-------------------------------------------*/

        const methods = {
            /**
             * 选中某一个树节点
             * @author  韦胜健
             * @date    2020/3/31 9:26
             */
            setCurrent(keyOrNode: string | TreeNode) {
                const node = typeof keyOrNode === "string" ? TreeUtils.findTreeNodeByKey(keyOrNode, state.treeMark) : keyOrNode
                if (!!node) {
                    current.value = node.key
                    emit.currentChange(node)
                }
            },
            /**
             * 获取当前选中节点
             * @author  韦胜健
             * @date    2020/3/31 9:39
             */
            getCurrent(): TreeNode | null {
                if (!current.value) return null
                return TreeUtils.findTreeNodeByKey(current.value, state.treeMark)
            },
        }

        const expandMethods = {
            expand: async (keyOrNode: string | TreeNode | (string | TreeNode)[]) => {
                await TreeUtils.handleKeyOrNode(
                    state.treeMark,
                    keyOrNode,
                    async (node) => {
                        const parent = node.parentRef()
                        if (!node.isExpand) {

                            if (
                                props.lazy &&                           // 懒加载模式
                                !node.isLoaded &&                       // 未曾加载过子节点数据
                                !node.isLeaf                            // 节点不是叶子节点
                            ) {
                                const children = await TreeUtils.getChildrenAsync(node, state, props.getChildren)
                                node.setChildren(children || [])
                                await nextTick()
                            }

                            if (props.according) {
                                // 手风琴模式，展开某一个节点的时候，关闭兄弟节点
                                if (!!parent && !!parent.children) {
                                    parent.children.forEach((child: TreeNode) => child.key !== node.key && expandMethods.collapse(child))
                                }
                            }

                            node.expand(true)
                            await nextTick()

                            emit.expand(node)
                            emit.expandChange(expandKeys.value)
                        }
                        if (!!props.autoExpandParent && !!parent && parent.level !== 0) {
                            await expandMethods.expand(parent)
                        }
                    })
            },
            collapse: async (keyOrNode: string | TreeNode | (string | TreeNode)[]) => {
                await TreeUtils.handleKeyOrNode(
                    state.treeMark,
                    keyOrNode,
                    async (node) => {
                        await TreeUtils.iterateAll([
                            node, ...(node.children || [])
                        ], (node) => {
                            if (node.isExpand) {
                                node.expand(false)
                                emit.collapse(node)
                            }
                        })
                        await nextTick()
                        emit.expandChange(expandKeys.value)
                    })
            },
            toggleExpand: async (keyOrNode: string | TreeNode) => {
                const treeNode = typeof keyOrNode === "string" ? TreeUtils.findTreeNodeByKey(keyOrNode, state.treeMark) : keyOrNode
                if (!treeNode) return
                treeNode.isExpand ? await expandMethods.collapse(treeNode) : await expandMethods.expand(treeNode)
            },
            expandAll() {
                if (!!formatData.value) {
                    TreeUtils.iterateAll(formatData.value, treeNode => this.expand(treeNode.key))
                }
            },
            collapseAll() {
                state.treeMark.expand.state.map = reactive({})
            },
        }

        const checkMethods = {
            check: async (keyOrNode: string | TreeNode | (string | TreeNode)[]) => {
                await TreeUtils.handleKeyOrNode(state.treeMark, keyOrNode, async (node) => {
                    if (!node.isCheck) {
                        node.check(true)

                        // 父子关联模式下，改变子节点以及父节点状态
                        if (!props.checkStrictly) {
                            // 选中所有子节点
                            TreeUtils.iterateAll(node.children || [], (child) => child.check(true))
                            // 更新父节点状态，如果父节点所有的子节点都处于选中状态，则更新父节点为选中状态
                            let parent = node.parentRef()
                            while (!!parent && !!parent.key) {
                                if ((parent.children || []).every(child => child.isCheck)) {
                                    parent.check(true)
                                    parent = parent.parentRef()
                                } else {
                                    break
                                }
                            }
                        }

                        await nextTick()
                        emit.check(node)
                        emit.checkChange(checkKeys.value)
                    }
                })
            },
            uncheck: async (keyOrNode: string | TreeNode | (string | TreeNode)[]) => {
                await TreeUtils.handleKeyOrNode(state.treeMark, keyOrNode, async node => {
                    if (node.isCheck) {
                        node.check(false)

                        // 父子关联模式下，改变子节点以及父节点状态
                        if (!props.checkStrictly) {
                            // 取消选中所有子节点
                            TreeUtils.iterateAll(node.children || [], (child) => child.check(false))
                            // 更新父节点状态，如果父节点所有的子节点都处于非选中状态，则更新父节点为非选中状态
                            let parent = node.parentRef()
                            while (!!parent && !!parent.key) {
                                if (parent.isCheck) {
                                    parent.check(false)
                                    parent = parent.parentRef()
                                } else {
                                    break
                                }
                            }
                        }

                        await nextTick()
                        emit.uncheck(node)
                        emit.checkChange(checkKeys.value)
                    }
                })
            },
            toggleCheck: async (keyOrNode: string | TreeNode) => {
                const treeNode = typeof keyOrNode === "string" ? TreeUtils.findTreeNodeByKey(keyOrNode, state.treeMark) : keyOrNode
                if (!treeNode) return
                treeNode.isCheck ? await checkMethods.uncheck(treeNode) : await checkMethods.check(treeNode)
            },
            checkAll: () => {
                if (!!formatData.value) {
                    TreeUtils.iterateAll(formatData.value, treeNode => checkMethods.check(treeNode.key))
                }
            },
            uncheckAll: () => {
                state.treeMark.check.state.map = reactive({})
            },
            getCheckedData() {
                let ret: object[] = []
                TreeUtils.iterateAll(formatData.value, (treeNode: TreeNode) => {
                    if (treeNode.isCheck) {
                        ret.push(treeNode.data)
                    }
                })
                return ret
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
                emit.clickNode(node)
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

        TreeUtils.initialize({rootTreeNode: rootTreeNode, lazy: props.lazy, data, state, getChildren: props.getChildren,})

        if (props.defaultExpandAll) nextTick().then(() => expandMethods.expandAll())

        watch(() => data.value, val => rootTreeNode.setChildren(val as any || []))

        const render = {
            node: (node: TreeNode | TreeEmptyNode, index: number) => {
                if (typeof node === "function") {
                    return render.empty(node)
                }
                return (
                    <pl-item
                        key={node.key}
                        class={TreeUtils.getTreeNodeClasses(node, current.value)}
                        style={TreeUtils.getTreeNodeStyles(node.level, props.intent)}>

                        <div class="pl-tree-node-operator">
                            {!!props.showCheckbox && <pl-checkbox
                                checkStatus={node.checkStatus}
                                disabled={!node.isCheckable}
                                onClick={(e: MouseEvent) => handler.onClickCheckbox(e, node)}
                            />}
                            <div class="pl-tree-node-expander">
                                {node.isLoading ?
                                    <pl-loading type="gamma"/> :
                                    <pl-icon icon={node.isLeaf ? props.leafIcon : node.isExpand ? props.folderExpandIcon : props.folderCollapseIcon}
                                             onClick={(e: MouseEvent) => handler.onClickExpandIcon(e, node)}/>
                                }
                            </div>
                        </div>
                        <div class="pl-tree-node-content"
                             style={contentStyles.value}
                             onClick={() => handler.onClickTreeNodeContent(node)}>
                            {scopedSlots.default({node, index}, !props.renderContent ? node.label : props.renderContent({node, index}))}
                        </div>
                    </pl-item>
                )
            },
            empty: (emptyNode: TreeEmptyNode) => {
                const parent = emptyNode()
                return (
                    <pl-item
                        key={`${parent.key}_empty`}
                        class="pl-tree-node pl-tree-empty-node"
                        style={TreeUtils.getTreeNodeStyles(parent.level + 1, props.intent)}>
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
                state,
                methods: {
                    ...methods,
                    ...expandMethods,
                    ...checkMethods,
                },
            },
            render: () => {
                return (
                    <div class="pl-tree" style={{height: props.height}} v-loading={props.loading || state.loading}>
                        {formatDataFlat.value.length === 0 ? (
                            <div class="pl-tree-placeholder" key="placeholder">
                                <pl-icon icon="el-icon-folder-opened"/>
                                <span>{props.emptyText}</span>
                            </div>
                        ) : (
                            <pl-scroll>
                                <pl-list direction="top" class="pl-tree-node-list">
                                    {formatDataFlat.value.map((node, index) => render.node(node, index))}
                                </pl-list>
                            </pl-scroll>
                        )}
                    </div>
                )
            }
        }
    },
})