import {nextTick, computed, ref} from 'vue';
import {SimpleObject} from "../../../shims";
import {TableNode} from "../../table/core/useTableNode";
import {TreeUtils} from "./utils";
import {TreeNode} from "./type";
import {useTreeNode} from "./useTreeNode";
import {TreeNodeCheckStatus} from "../utils/tree-constant";
import {useModel} from "../../../use/useModel";

export function useTree<Node extends {
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
    }: {
        props: {
            lazy?: boolean,
            getChildren?: (node: Node, cb: (...args: any[]) => void) => void,
            childrenField?: string,
            according?: boolean,
            autoExpandParent?: boolean,
            checkStrictly?: boolean,
            expandOnClickNode?: boolean,
            checkOnClickNode?: boolean,
            defaultExpandAll?: boolean,
            currentKey?: string,
            showCheckbox?: boolean,
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
            onUpdateCurrent: (key?: string) => void,
        },
        keyManager: (obj: any, keyField: string | undefined | null) => string,
    }
) {

    const {dataModel, state, utils: treeNodeUtils, methods: treeNodeMethods} = useTreeNode<Node>({props, event: {emit}, keyManager})
    const current = useModel(() => props.currentKey, emit.onUpdateCurrent)

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
        getChildrenAsync: (node: Node): Promise<Node[]> => {
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
                props.getChildren(node, (...results) => {
                    if (node.level === 0) {
                        !!state.root && (state.root.loading = false)
                    } else {
                        node.loading = false
                        node.loaded = true
                    }
                    resolve(...results)
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
            props.lazy && utils.getChildrenAsync(state.root!).then(val => dataModel.value = val);
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
                            !node.loaded &&                       // 未曾加载过子节点数据
                            !node.isLeaf                            // 节点不是叶子节点
                        ) {
                            const children = await utils.getChildrenAsync(node)
                            baseMethods.setChildrenData(node, children || [])
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
            const node = baseMethods.getNode(keyOrNode)
            if (!node) {return }
            const parents = utils.getParents(node)
            utils.iterate({
                nodes: [node, ...parents],
                handler: node => {
                    /*刷新选中状态的前提是有子节点数据*/
                    if (node.isLeaf || !node.children || node.children.length === 0) return
                    let hasCheck = false, hasUncheck = false;
                    node.children.forEach(chlid => chlid.check ? hasCheck = true : hasUncheck = true)
                    if (node.check && hasUncheck) {
                        // 自身选中而子节点有非选中,取消当前节点的选中状态
                        node.check = false
                    }
                    if (!node.check && hasCheck && !hasUncheck) {
                        // 自身非选中而子节点全部选中，选中当前节点
                        node.check = true
                    }
                },
                iterateChildrenFirst: true,
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
        state,
        current,
        utils,
        handler,
        methods: {
            ...baseMethods,
            ...expandMethods,
            ...checkMethods,
            ...treeNodeMethods,
        },
    }
}

