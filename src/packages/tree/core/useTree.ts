import {computed, nextTick, PropType} from 'vue';
import {SimpleObject} from "../../../shims";
import {useTreeNode} from "./useTreeNode";
import {TreeNodeCheckStatus} from "../utils/tree-constant";
import {useModel} from "../../../use/useModel";
import {delay} from "plain-utils/utils/delay";

function use<Node extends {
    key: string,
    data: SimpleObject,
    level: number,
    parentRef: () => Node | null,
    selfRef: () => Node,

    index: number,

    readonly childrenData?: SimpleObject[]
    readonly label?: string,
    children?: Node[],
    readonly checkStatus: TreeNodeCheckStatus,

    expand: boolean,
    check: boolean,
    loading: boolean,
    loaded: boolean,

    readonly isCheckable: boolean,
    readonly isLeaf: boolean,
    readonly isVisible: boolean,
}>(
    {
        props,
        emit,
        keyManager,
        getTreeNodeByDataAdjust,
    }: {
        props: {
            /*useTreeNode*/
            data?: SimpleObject[],
            labelField?: string,
            keyField?: string,
            childrenField?: string,
            filterNodeMethod?: (node: Node) => boolean,
            isLeaf?: (node: Node) => boolean,
            isCheckable?: (node: Node) => boolean,
            getChildren?: (node: Node, cb: (data: SimpleObject[]) => void) => void,
            lazy?: boolean,
            showCheckbox?: boolean,
            checkStrictly?: boolean,

            /*useTree*/
            according?: boolean,
            autoExpandParent?: boolean,
            expandOnClickNode?: boolean,
            checkOnClickNode?: boolean,
            defaultExpandAll?: boolean,
            currentKey?: string,
        },
        emit: {
            onExpand: (node: Node) => void,
            onExpandChange: (keys: string[]) => void,
            onCollapse: (node: Node) => void,
            onCheck: (node: Node) => void,
            onUncheck: (node: Node) => void,
            onCheckChange: (keys: string[]) => void,
            onClickNode: (node: Node) => void,
            onUpdateData: (data?: SimpleObject[]) => void,
            onUpdateCurrentKey: (key?: string) => void,
        },
        keyManager: (obj: any, keyField: string | undefined | null) => string,
        getTreeNodeByDataAdjust?: (node: Node) => void,
    }
) {

    const {dataModel, state, utils: treeNodeUtils, methods: treeNodeMethods} = useTreeNode<Node>({props, event: {emit}, keyManager, getTreeNodeByDataAdjust})
    const current = useModel(() => props.currentKey, emit.onUpdateCurrentKey)

    const utils = {
        ...treeNodeUtils,
        /*遍历key或者node*/
        handleKeyOrNode: async (keyOrNode: string | Node | (string | Node)[], handler: (node: Node) => void | Promise<void>): Promise<void> => {
            if (!keyOrNode) {
                return
            }
            if (!Array.isArray(keyOrNode)) {
                const node = baseMethods.getNode(keyOrNode)
                if (!!node) {await handler(node)}
            } else {
                await Promise.all(keyOrNode.map(k => utils.handleKeyOrNode(k, handler)))
            }
        },
        /*获取子节点数据异步方法*/
        getChildrenAsync: (node: Node): Promise<SimpleObject[]> => {
            return new Promise((resolve) => {
                if (!props.getChildren) {
                    console.error('getChildren is required when using lazy mode!')
                    return
                }
                if (node.level === 0) {
                    !!state.root && (state.root.loading = true);
                } else {
                    node.loading = true
                }
                props.getChildren(node, (results) => {
                    if (node.level === 0) {
                        !!state.root && (state.root.loading = false)
                    } else {
                        node.loading = false
                        node.loaded = true
                    }
                    resolve(results)
                })
            })
        },
        /*获取Node所有的父节点*/
        getParents: (keyOrNode: Node | string): Node[] => {
            let node = baseMethods.getNode(keyOrNode)
            if (!node) {return []}
            let parents = [] as Node[]
            let parent = node.parentRef()
            /*root 是没有 parentRef的*/
            while (!!parent && !!parent.parentRef) {
                parents.push(parent)
                parent = parent.parentRef()
            }
            return parents
        },
        /*初始化逻辑*/
        init: () => {
            props.lazy && utils.getChildrenAsync(state.root!).then(val => {dataModel.value = val});
            props.defaultExpandAll && nextTick().then(() => expandMethods.expandAll());
        },
    }

    /*展开的节点*/
    const expandNodes = computed(() => {
        if (!state.root) {return []}
        let nodes: Node[] = []
        utils.iterate({nodes: state.root.children, handler: (node) => node.expand && nodes.push(node),})
        return nodes
    })
    /*选中的节点*/
    const checkNodes = computed(() => {
        if (!state.root) {return []}
        let nodes: Node[] = []
        utils.iterate({nodes: state.root.children, handler: (node) => node.check && nodes.push(node)})
        return nodes
    })
    /*展开的keys*/
    const expandKeys = computed(() => expandNodes.value.map(i => i.key))
    /*选中的keys*/
    const checkKeys = computed(() => checkNodes.value.map(i => i.key))

    const baseMethods = {
        /*设置子节点数据*/
        setChildrenData: (node: Node, children: any[]) => !!props.childrenField && (node.data[props.childrenField] = children),
        /*通过keyOrNode获取node*/
        getNode: (keyOrNode: string | Node): Node | undefined => typeof keyOrNode === "string" ? state.nodeMap[keyOrNode] : keyOrNode,
        /*设置当前选中行*/
        setCurrent: (keyOrNode: string | Node) => current.value = typeof keyOrNode === "string" ? keyOrNode : keyOrNode.key,
        /*获取当前选中行*/
        getCurrent: (): Node | undefined => !current.value ? undefined : baseMethods.getNode(current.value),
    }
    const expandMethods = {
        /*展开节点*/
        expand: async (keyOrNode: string | Node | (string | Node)[]) => {
            await utils.handleKeyOrNode(keyOrNode,
                async (node) => {
                    const parent = node.parentRef()
                    if (!node.expand) {
                        if (
                            props.lazy &&                           // 懒加载模式
                            !node.loaded &&                         // 未曾加载过子节点数据
                            !node.isLeaf                            // 节点不是叶子节点
                        ) {
                            const childrenData = await utils.getChildrenAsync(node)
                            baseMethods.setChildrenData(node, childrenData || [])
                            await nextTick()
                        }

                        if (props.according) {
                            // 手风琴模式，展开某一个节点的时候，关闭兄弟节点
                            if (!!parent && !!parent.children) {
                                parent.children.forEach((child) => child.key !== node.key && expandMethods.collapse(child))
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
        /*收起节点*/
        collapse: async (keyOrNode: string | Node | (string | Node)[]) => {
            await utils.handleKeyOrNode(keyOrNode,
                async (node) => {
                    await utils.iterate({
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
        /*展开或者收起节点*/
        toggleExpand: (keyOrNode: string | Node) => {
            const node = baseMethods.getNode(keyOrNode)
            if (!node) {return}
            node.expand ? expandMethods.collapse(keyOrNode) : expandMethods.expand(keyOrNode)
        },
        /*展开所有节点*/
        expandAll: () => utils.iterate({nodes: state.root!.children, handler: node => node.expand = true}),
        /*收起所有节点*/
        collapseAll: () => expandNodes.value.forEach(node => node.expand = false),
    }

    const checkMethods = {
        /*选中节点*/
        check: async (keyOrNode: string | Node | (string | Node)[]) => {
            await utils.handleKeyOrNode(keyOrNode, async (node) => {
                if (node.check || !node.isCheckable) {return}
                node.check = true
                // 父子关联模式下，改变子节点以及父节点状态
                if (!props.checkStrictly) {
                    // 选中所有子节点
                    utils.iterate({nodes: node.children, handler: (child) => child.check = true,})
                    // 更新父节点状态，如果父节点所有的子节点都处于选中状态，则更新父节点为选中状态
                    let parent = node.parentRef()
                    while (!!parent && !!parent.key) {
                        if (!!parent.parentRef && parent.children!.every(child => child.check)) {
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
        /*取消选中节点*/
        uncheck: async (keyOrNode: string | Node | (string | Node)[]) => {
            await utils.handleKeyOrNode(keyOrNode, async node => {
                if (!node.check || !node.isCheckable) {return}
                node.check = false
                // 父子关联模式下，改变子节点以及父节点状态
                if (!props.checkStrictly) {
                    // 取消选中所有子节点
                    utils.iterate({nodes: node.children, handler: (child) => child.check = false,})
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
        /*选中或者取消选中节点*/
        toggleCheck: (keyOrNode: string | Node) => {
            const node = baseMethods.getNode(keyOrNode)
            if (!node) return
            node.check ? checkMethods.uncheck(keyOrNode) : checkMethods.check(keyOrNode)
        },
        /*选中所有节点*/
        checkAll: () => utils.iterate({nodes: state.root!.children, handler: node => node.check = true}),
        /*取消选中所有节点*/
        uncheckAll: () => checkNodes.value.forEach(node => node.check = false),
        /*获取所有选中的节点*/
        getCheckedData: () => checkNodes.value,
        /*刷新所有节点的选中状态*/
        refreshCheckStatus: async (keyOrNode: string | Node) => {
            if (!props.showCheckbox) return
            if (props.checkStrictly) return;
            await delay(0)
            const node = baseMethods.getNode(keyOrNode)
            if (!node) {return }
            const nodes = [] as Node[]
            utils.iterate({
                nodes: node.children,
                handler: node => {nodes.unshift(node)},
                iterateChildrenFirst: true,
            })
            nodes.unshift(node)
            nodes.unshift(...utils.getParents(node).reverse())
            nodes.reverse().forEach(node => {
                /*刷新选中状态的前提是有子节点数据*/
                if (node.isLeaf || !node.children || node.children.length === 0) return
                let hasCheck = false, hasUncheck = false;
                /*console.log({
                    node: node.label,
                    children: node.children.map(child => child.label)
                })*/
                node.children.forEach(child => child.check ? hasCheck = true : hasUncheck = true)
                if (node.check && hasUncheck) {
                    // 自身选中而子节点有非选中,取消当前节点的选中状态
                    node.check = false
                }
                if (!node.check && hasCheck && !hasUncheck) {
                    // 自身非选中而子节点全部选中，选中当前节点
                    node.check = true
                }
            })
        },
    }

    const handler = {
        /*点击展开图标*/
        onClickExpandIcon: async (e: MouseEvent, node: Node) => {
            e.stopPropagation()
            await expandMethods.toggleExpand(node)
        },
        /*点击复选框*/
        onClickCheckbox: async (e: MouseEvent, node: Node) => {
            e.stopPropagation()
            await checkMethods.toggleCheck(node)
        },
        /*点击行*/
        onClickCell: async (e: MouseEvent, node: Node) => {
            emit.onClickNode(node)
            baseMethods.setCurrent(node)
            props.expandOnClickNode && (await expandMethods.toggleExpand(node));
            props.checkOnClickNode && (await checkMethods.toggleCheck(node));
        },
    }

    utils.init()

    return {
        dataModel,
        state,
        current,
        utils,
        handler,
        methods: {
            ...baseMethods,
            expandMethods,
            checkMethods,
            treeNodeMethods,
        },
    }
}

export const useTree = Object.assign(use, {
    createProps: <Node>() => {
        return {
            /*useTreeNode*/
            data: {type: Array as PropType<SimpleObject[]>},            // 树形结构数据
            keyField: {type: String},                                   // 每一个树节点用来标识的唯一树形
            labelField: {type: String},                                 // 树节点展示文本对应字段
            childrenField: {type: String},                              // 树节点对应子节点数据对应字段

            filterNodeMethod: {type: Function as PropType<(node: Node) => boolean>},// 对树节点进行筛选的方法，返回true表示可以显示，返回false表示隐藏
            isLeaf: {type: Function as PropType<(node: Node) => boolean>},// 判断树节点是否为叶子节点的函数，仅在lazy模式有效
            isCheckable: {type: Function as PropType<(node: Node) => boolean>},     // 当即将选中树节点时，判断是否可以选中该树节点
            getChildren: {type: Function as PropType<(node: Node, cb: (data: SimpleObject[]) => void) => void>},// 加载子节点数据的函数，仅当 lazy 为true时有效
            lazy: {type: Boolean},                                      // 是否懒加载子节点数据
            showCheckbox: {type: Boolean},                              // 是否展示勾选框
            checkStrictly: {type: Boolean},                             // 在显示复选框的情况下，是否严格遵循父子互不关联的做法，默认为false

            /*useTree*/
            according: {type: Boolean},                                 // 是否每次只展开一个同级的树节点
            autoExpandParent: {type: Boolean, default: true},           // 是否展开节点的时候，自动展开父节点
            expandOnClickNode: {type: Boolean, default: true},          // 是否点击树节点的时候展开子节点
            checkOnClickNode: {type: Boolean},                          // 是否点击树节点的时候选中节点
            defaultExpandAll: {type: Boolean},                          // 是否默认展开所有节点
            currentKey: {type: String},                                 // 当前选中节点的key
        }
    },
    createEvent: <Node>() => {
        return {
            onClickNode: (node: Node) => true,                          // 点击节点事件
            onUpdateCurrentKey: (current?: string) => true,                // 当前高亮节点key变化绑定事件
            onUpdateData: (data?: SimpleObject[]) => true,              // 数据变化事件（拖拽排序、数据懒加载）

            onExpandChange: (expandKeys: string[]) => true,             // 展开节点变化事件
            onExpand: (node: Node) => true,                             // 展开事件
            onCollapse: (node: Node) => true,                           // 关闭节点事件

            onCheckChange: (checkKeys: string[]) => true,               // 选中节点变化事件
            onCheck: (node: Node) => true,                              // 选中节点事件
            onUncheck: (node: Node) => true,                            // 取消选中节点事件
        }
    }
})

