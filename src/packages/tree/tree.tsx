import {designComponent} from "../../use/designComponent";
import {TreeEmptyNode, TreeNode} from "./utils/TreeNode";
import {VNodeChild} from "../../shims";
import {useScopedSlots} from "../../use/useScopedSlots";
import {useModel} from "../../use/useModel";
import {TreeMark} from "./utils/TreeMark";
import {computed, nextTick, reactive, watch} from 'vue';
import './tree.scss'
import {useStyles} from "../../use/useStyles";

export default designComponent({
    name: 'pl-tree',
    props: {
        data: {type: Array},                                        // 树形结构数据
        loading: {type: Boolean},                                   // 当前是否处于loading状态
        nodeIcon: {type: Function as any as new() => ((node: TreeNode) => string)},// 节点图标
        nodeHeight: {type: Number, default: 40},                      // 节点高度
        height: {type: String, default: '100%'},                    // 容器高度

        // 部分key
        keyField: {type: String},                                   // 每一个树节点用来标识的唯一树形
        labelField: {type: String},                                 // 树节点展示文本对应字段
        childrenField: {type: String, required: true},              // 树节点对应子节点数据对应字段

        // 普通属性
        renderContent: {type: Function as any as new() => ((data: { node: TreeNode, index: number }) => VNodeChild)},// 树节点内容渲染函数
        filterNodeMethod: {type: Function as any as new() => ((node: TreeNode) => boolean)},// 对树节点进行筛选的方法，返回true表示可以显示，返回false表示隐藏
        highlightCurrent: {type: Boolean, default: true},           // 是否高亮当前选中节点
        currentKey: {type: String},                                 // 当前选中节点的key

        // 展开相关属性
        emptyText: {type: String, default: '暂无数据'},              // 没有子节点的时候展示的文本
        defaultExpandAll: {type: Boolean},                          // 是否默认展开所有节点
        according: {type: Boolean},                                 // 是否每次只展开一个同级的树节点
        expandIcon: {type: String},                                 // 树展开图标
        intent: {type: Number, default: 20},                        // 相邻级节点水平缩进距离，默认16，单位px
        lazy: {type: Boolean},                                      // 是否懒加载子节点数据
        isLeaf: {type: Function as any as new() => ((node: TreeNode) => boolean)},// 判断树节点是否为叶子节点的函数，仅在lazy模式有效
        getChildren: {type: Function as any as new() => ((node: TreeNode, cb: (...args: any[]) => void) => void)},// 加载子节点数据的函数，仅当 lazy 为true时有效

        renderAfterExpand: {type: Boolean, default: true},          // 是否在第一次展开节点之后才渲染内容
        expandOnClickNode: {type: Boolean, default: null},          // 是否点击树节点的时候展开子节点
        autoExpandParent: {type: Boolean, default: true},           // 是否展开节点的时候，自动展开父节点

        // 勾选相关属性
        showCheckbox: {type: Boolean},                              // 是否展示勾选框
        checkOnClickNode: {type: Boolean},                          // 是否点击树节点的时候选中节点
        checkStrictly: {type: Boolean},                             // 在显示复选框的情况下，是否严格遵循父子互不关联的做法，默认为false
        isCheckable: {type: Function as any as new() => ((node: TreeNode) => boolean)},// 当即将选中树节点时，判断是否可以选中该树节点

        // 拖拽属性
        draggable: {type: Boolean},                                 // 是否可拖拽
        allowDrag: {type: Function as any as new() => ((node: TreeNode) => boolean)},// 判断节点是否可以拖拽
        allowDrop: {type: Function as any as new() => ((node: TreeNode) => boolean)},// 判断目标节点能够被放置

        folderCollapseIcon: {type: String, default: 'el-icon-folder-s'},
        folderExpandIcon: {type: String, default: 'el-icon-folder-opened'},
        leafIcon: {type: String, default: 'el-icon-document'},
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
            childrenField: props.childrenField,
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

        /*---------------------------------------utils-------------------------------------------*/

        const utils = {
            /**
             * 遍历所有的treeNode
             * @author  韦胜健
             * @date    2020/3/30 19:30
             * @param   treeNodes               要遍历的数据
             * @param   fn                      处理函数
             * @param   iterateChildren         判断是否遍历其子节点数据
             */
            iterateAll: (
                treeNodes: TreeNode[] | Readonly<TreeNode[]> | null,
                fn: (node: TreeNode) => void,
                iterateChildren?: (node: TreeNode) => boolean
            ): void => {
                if (!treeNodes) return
                treeNodes.forEach(treeNode => {
                    fn(treeNode)
                    if (!!treeNode.children && (!iterateChildren || iterateChildren(treeNode))) {
                        utils.iterateAll(treeNode.children, fn, iterateChildren)
                    }
                })
            },
            /**
             * 计算treeNode的样式
             * @author  韦胜健
             * @date    2020/11/28 9:25
             */
            getTreeNodeStyles: (level: number) => {
                const basePadding = 8
                return {
                    paddingLeft: `${basePadding + (level - 1) * props.intent}px`,
                    paddingRight: `${basePadding}px`,
                }
            },
            /**
             * 计算tree node的class
             * @author  韦胜健
             * @date    2020/11/28 10:35
             */
            getTreeNodeClasses: (node: TreeNode) => {
                return [
                    'pl-tree-node',
                    {
                        'pl-tree-node-current': node.key === current.value,
                    }
                ]
            },
            /**
             * 通过 key 寻找treeNode
             * @author  韦胜健
             * @date    2020/3/30 20:52
             */
            findTreeNodeByKey: (key: string): TreeNode | null => {
                const treeNode = state.treeMark.node.getByKey(key)
                if (!treeNode) {
                    console.warn(`无法找到treeNode：${key}`, state.treeMark.node.state.map)
                    return null
                }
                return treeNode
            },
            /**
             * 处理keyOrNode
             * @author  韦胜健
             * @date    2020/11/28 9:34
             */
            handleKeyOrNode: async (keyOrNode: string | TreeNode | (string | TreeNode)[], handler: (node: TreeNode) => void | Promise<void>): Promise<any> => {
                if (!keyOrNode) {
                    return
                }
                if (typeof keyOrNode === "string") {
                    const node = utils.findTreeNodeByKey(keyOrNode)
                    if (!!node) {
                        await handler(node)
                    }
                } else if (!Array.isArray(keyOrNode)) {
                    await handler(keyOrNode)
                } else {
                    await Promise.all(keyOrNode.map(i => utils.handleKeyOrNode(i, handler)))
                }
            },
            /**
             * 获取子节点数据异步方法
             * @author  韦胜健
             * @date    2020/3/31 15:21
             */
            getChildrenAsync: (treeNode: TreeNode): Promise<TreeNode[]> => {
                return new Promise((resolve) => {
                    if (treeNode.level === 0) {
                        state.loading = true
                    } else {
                        treeNode.loading(true)
                    }
                    props.getChildren!(treeNode, (...results) => {
                        if (!treeNode.key) {
                            state.loading = false
                        } else {
                            treeNode.loading(false)
                            treeNode.loaded(true)
                        }
                        resolve(...results)
                    })
                })
            },
            /**
             * 懒加载初始化逻辑
             * @author  韦胜健
             * @date    2020/11/28 10:45
             */
            async initLazy() {
                if (!props.lazy) {return}
                data.value = await this.getChildrenAsync(state.rootTreeNode)
            },
        }

        /*---------------------------------------computer-------------------------------------------*/
        /*格式化得到的TableNode树形数据*/
        const formatData = computed(() => {
            const ret = state.treeMark.node.getList(data.value, 1, () => state.rootTreeNode)
            /*这里需要遍历所有的节点，不然 treeMark.node.state 中没有记录节点的key，导致在findNodeByKey的时候找不到*/
            utils.iterateAll(ret, node => node)
            return ret
        })
        /*拍平的树形数据（不拍平无法实现虚拟滚动）*/
        const formatDataFlat = computed(() => {
            const format = formatData.value
            const formatDataFlat: (TreeNode | TreeEmptyNode)[] = []
            utils.iterateAll(format,
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

        const expandKeys = computed(() => state.treeMark.expand.getActiveKeys())
        const checkKeys = computed(() => state.treeMark.check.getActiveKeys())

        const contentStyles = useStyles(style => {style.height = `${props.nodeHeight}px`})

        /*---------------------------------------methods-------------------------------------------*/

        const methods = {
            /**
             * 选中某一个树节点
             * @author  韦胜健
             * @date    2020/3/31 9:26
             */
            setCurrent(keyOrNode: string | TreeNode) {
                const node = typeof keyOrNode === "string" ? utils.findTreeNodeByKey(keyOrNode) : keyOrNode
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
                return utils.findTreeNodeByKey(current.value)
            },
        }

        const expandMethods = {
            expand: async (keyOrNode: string | TreeNode | (string | TreeNode)[]) => {
                await utils.handleKeyOrNode(keyOrNode, async (node) => {
                    const parent = node.parentRef()
                    if (!node.isExpand) {

                        if (
                            props.lazy &&                           // 懒加载模式
                            !node.isLoaded &&                       // 未曾加载过子节点数据
                            !node.isLeaf                            // 节点不是叶子节点
                        ) {
                            const children = await utils.getChildrenAsync(node)
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
                await utils.handleKeyOrNode(keyOrNode, async (node) => {
                    await utils.iterateAll([
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
            async toggleExpand(keyOrNode: string | TreeNode) {
                const treeNode = typeof keyOrNode === "string" ? utils.findTreeNodeByKey(keyOrNode) : keyOrNode
                if (!treeNode) return
                if (treeNode.isExpand) {
                    await this.collapse(treeNode)
                } else {
                    await this.expand(treeNode)
                }
            },
            expandAll() {
                if (!!formatData.value) {
                    utils.iterateAll(formatData.value, treeNode => this.expand(treeNode.key))
                }
            },
            collapseAll() {
                state.treeMark.expand.state.map = reactive({})
            },
        }

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            onClickExpandIcon: async (e: MouseEvent, node: TreeNode) => {
                e.stopPropagation()
                await expandMethods.toggleExpand(node)
            },
            onClickTreeNodeContent: async (node: TreeNode) => {
                emit.clickNode(node)
                methods.setCurrent(node)
                if (props.expandOnClickNode !== false) {
                    await expandMethods.toggleExpand(node)
                }
            }
        }

        utils.initLazy()
        if (props.defaultExpandAll) {
            nextTick().then(() => expandMethods.expandAll())
        }

        watch(() => data.value, val => rootTreeNode.setChildren(val as any || []))

        const render = {
            node: (node: TreeNode | TreeEmptyNode, index: number) => {
                if (typeof node === "function") {
                    return render.empty(node)
                }
                return (
                    <pl-item
                        key={node.key}
                        class={utils.getTreeNodeClasses(node)}
                        style={utils.getTreeNodeStyles(node.level)}>

                        <div class="pl-tree-node-operator">
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
                            <span>{scopedSlots.default({node, index}, node.label)}</span>
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
                        style={utils.getTreeNodeStyles(parent.level + 1)}>
                        <div class="pl-tree-node-operator">
                            <div class="pl-tree-node-expander">
                                <pl-icon icon="el-icon-close-bold"/>
                            </div>
                        </div>
                        <div class="pl-tree-node-content" style={contentStyles.value}>
                            <span>暂无数据</span>
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
                },
            },
            render: () => {
                return (
                    <div class="pl-tree" style={{height: props.height}} v-loading={props.loading || state.loading}>
                        {formatDataFlat.value.length === 0 ? (
                            <div class="pl-tree-placeholder" key="placeholder">
                                <pl-icon icon="el-icon-folder-opened"/>
                                <span>暂无数据</span>
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