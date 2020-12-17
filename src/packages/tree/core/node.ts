import {computed, onBeforeUnmount, reactive, watchEffect} from 'vue';
import {useModel} from "../../../use/useModel";
import {TreeNode, TreePropsType} from "./type";
import {TreeNodeCheckStatus} from "../utils/tree-constant";
import {TreeUtils} from "./utils";
import {createKeyHandler} from "../../../utils/createKeyHandler";
import tree from "../tree";
import {throttle} from "plain-utils/utils/throttle";
import {SimpleObject} from "../../../shims";
import isCheckable = TreePropsType.isCheckable;
import isLeaf = TreePropsType.isLeaf;
import filterNodeMethod = TreePropsType.filterNodeMethod;
import getChildren = TreePropsType.getChildren;

const keyManager = createKeyHandler('tree')


/**
 * 根据childrenField遍历data树形数据
 * @author  韦胜健
 * @date    2020/12/2 12:22
 */
function iteratorTreeData({data, childrenField}: { data?: SimpleObject[], childrenField: string }) {
    if (!!data) {
        data.forEach(item => {
            if (!!item[childrenField]) {
                iteratorTreeData({data: item[childrenField], childrenField})
            }
        })
    }
}

/**
 * 专门处理格式化数据以及操作数据的逻辑
 * @author  韦胜健
 * @date    2020/11/30 9:55
 */
export function useTree(
    {
        props,
        event,
    }: {
        props: {
            data?: SimpleObject[],
            labelField?: string,
            keyField?: string,
            childrenField?: string,
            filterNodeMethod?: filterNodeMethod,
            isLeaf?: isLeaf,
            isCheckable?: isCheckable,
            getChildren?: getChildren,
            lazy?: boolean,
            showCheckbox?: boolean,
            checkStrictly?: boolean,
        },
        event: {
            emit: { onUpdateData: (data?: SimpleObject[]) => void }
        },
    }) {

    /*内部data变量*/
    const dataModel = useModel(() => props.data, event.emit.onUpdateData)

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
        TreeUtils.iterateAll({
            nodes: state.root.children,
            iterateChildren: (treeNode: TreeNode) => treeNode.expand,
            handler: (treeNode: TreeNode) => {
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

    /*展开的节点*/
    const expandNodes = computed(() => {
        if (!state.root) {
            return []
        }
        let nodes: TreeNode[] = []
        TreeUtils.iterateAll({
            nodes: state.root.children,
            handler: (node) => node.expand && nodes.push(node),
        })
        return nodes
    })

    /*选中的节点*/
    const checkNodes = computed(() => {
        if (!state.root) {
            return []
        }
        let nodes: TreeNode[] = []
        TreeUtils.iterateAll({
            nodes: state.root.children,
            handler: (node) => node.check && nodes.push(node),
        })
        return nodes
    })

    /**
     * 因为滚动的时候会频繁获取checkStatus，而这个属性又是计算量比较大的属性，这里作为计算属性统一计算
     * @author  韦胜健
     * @date    2020/12/2 14:07
     */
    const checkStatus = computed(() => {
        const map = {} as Record<string, TreeNodeCheckStatus>
        if (!props.showCheckbox || !state.root) {
            return map
        }
        TreeUtils.iterateAll({
            nodes: state.root.children,
            iterateChildrenFirst: true,
            handler: node => {
                if (props.checkStrictly || node.isLeaf) {
                    map[node.key] = node.check ? TreeNodeCheckStatus.check : TreeNodeCheckStatus.uncheck
                } else {
                    if (node.check) {
                        map[node.key] = TreeNodeCheckStatus.check
                    } else {
                        if (!!node.children && node.children.every(child => map[child.key] === TreeNodeCheckStatus.uncheck)) {
                            map[node.key] = TreeNodeCheckStatus.uncheck
                        } else {
                            map[node.key] = TreeNodeCheckStatus.minus
                        }
                    }
                }
            }
        })
        return map
    })

    const utils = {
        /**
         * 获取Node
         * @author  韦胜健
         * @date    2020/12/15 13:33
         */
        getTreeNodeByData: (() => {
            const map = new WeakMap<object, TreeNode>()
            const get = ({data, level, parentRef}: { data: any, level: number, parentRef: () => TreeNode }): TreeNode => {
                let node: TreeNode | undefined = map.get(data)
                if (!node) {
                    node = {

                        index: 0,

                        key: keyManager(data, props.keyField),
                        data,
                        level,
                        parentRef,
                        selfRef: () => node!,
                        empty: false,
                        children: [],

                        get label() {return !!props.labelField && !!data ? data[props.labelField] : null},
                        get childrenData() {return data[props.childrenField!]},

                        expand: false,
                        check: false,
                        loading: false,
                        loaded: !props.lazy,
                        /* todo 这里并不会立即执行，当渲染VNodeChild的时候这里才会执行，所以不存在checkStatus.value不存在的问题*/
                        get checkStatus() {return checkStatus.value[this.key]},
                        // get checkStatus() {return TreeNodeCheckStatus.uncheck},

                        get isCheckable() {return !props.isCheckable || props.isCheckable(this)},
                        get isLeaf() {return !!props.isLeaf ? props.isLeaf(this) : !this.childrenData},
                        get isVisible() {
                            return !props.filterNodeMethod ? true : (props.filterNodeMethod(this) || (!!this.children && this.children.some(child => child.isVisible)))
                        },
                        getReactiveChildrenData(): any[] {
                            let childrenData = this.childrenData
                            if (!childrenData) {
                                childrenData = []
                                this.data[props.childrenField!] = childrenData
                            }
                            return childrenData
                        },
                        removeSelf() {
                            const parentChildrenData = this.parentRef()!.childrenData!
                            parentChildrenData.splice(parentChildrenData.indexOf(this.data), 1)
                        },
                        previousSibling(node: TreeNode) {
                            let parentChildrenData = this.parentRef()!.getReactiveChildrenData()
                            node.parentRef = this.parentRef
                            node.level = this.level
                            parentChildrenData.splice(parentChildrenData.indexOf(this.data), 0, node.data)
                        },
                        nextSibling(node: TreeNode) {
                            let parentChildrenData = this.parentRef()!.getReactiveChildrenData()
                            node.parentRef = this.parentRef
                            node.level = this.level
                            parentChildrenData.splice(parentChildrenData.indexOf(this.data) + 1, 0, node.data)
                        },
                        unshiftChild(node: TreeNode) {
                            let childrenData = this.getReactiveChildrenData()
                            node.parentRef = () => this
                            node.level = this.level + 1
                            childrenData.unshift(node.data)
                        },
                    }
                    map.set(data, node!)
                } else {
                    Object.assign(node, {
                        key: keyManager(data, props.keyField),
                        data,
                        level,
                        parentRef,
                    })
                }
                return node!
            }
            return get
        })(),
        /**
         * 处理keyOrNode
         * @author  韦胜健
         * @date    2020/11/28 9:34
         */
        handleKeyOrNode: async (keyOrNode: string | TreeNode | (string | TreeNode)[], handler: (node: TreeNode) => void | Promise<void>,): Promise<any> => {
            if (!keyOrNode) {
                return
            }
            if (!Array.isArray(keyOrNode)) {
                const node = methods.getNode(keyOrNode)
                if (!!node) {
                    await handler(node)
                }
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
                if (!props.getChildren) {
                    console.error('getChildren is required when using lazy mode!')
                    return
                }
                if (treeNode.level === 0) {
                    !!state.root && (state.root.loading = true);
                } else {
                    treeNode.loading = true
                }
                props.getChildren(treeNode, (...results) => {
                    if (treeNode.level === 0) {
                        !!state.root && (state.root.loading = false)
                    } else {
                        treeNode.loading = false
                        treeNode.loaded = true
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
        initialize() {
            if (props.lazy) {
                utils.getChildrenAsync(state.root!).then(val => {
                    dataModel.value = val
                })
            }
        },
        /**
         * 获取treeNode所有的父节点
         * @author  韦胜健
         * @date    2020/12/2 12:19
         */
        getParents: (keyOrNode: TreeNode | string) => {
            let node = typeof keyOrNode === "string" ? methods.getNode(keyOrNode) : keyOrNode
            let parents = [] as TreeNode[]

            let parent = node.parentRef()
            /*root 是没有 parentRef的*/
            while (!!parent && !!parent.parentRef) {
                parents.push(parent)
                parent = parent.parentRef()
            }
            return parents
        },
        /*重置state中的data数据*/
        resetData: () => {
            const nodeMap = {} as Record<string, TreeNode>;
            const iterator = ({data, level, parentRef}: { data: any, level: number, parentRef: () => TreeNode }): TreeNode => {
                const node = utils.getTreeNodeByData({data, level, parentRef})
                nodeMap[node.key] = node
                const childrenData = !props.childrenField ? null : (data[props.childrenField!] as SimpleObject[])
                if (!!childrenData) {
                    node.children = childrenData.map(child => iterator({data: child, level: level + 1, parentRef: node.selfRef}))
                }
                return node
            }
            const root = iterator({
                data: {
                    [props.keyField || 'id']: '@@$$root',
                    [props.childrenField || 'children']: dataModel.value
                },
                level: 0,
                parentRef: null as any,
            })

            return {
                nodeMap,
                root
            }
        },
    }

    const state = reactive((() => {
        const {root, nodeMap} = utils.resetData()
        return {
            /*虚拟跟节点*/
            root,
            /*节点映射node*/
            nodeMap
        }
    })())

    const handler = {
        /**
         * 当节点数据变化之后，刷新state中的root以及nodeMap
         * @author  韦胜健
         * @date    2020/12/15 12:03
         */
        onDataChange: throttle(async () => {
            const {root, nodeMap} = utils.resetData()
            state.root = root
            state.nodeMap = nodeMap
        }, 100),
    }

    const methods = {
        /*这里一直从 nodeMap 中获取最新的，因为keyOrNode如果是treeNode的话，可能只是一个快照*/
        getNode: (keyOrNode: string | TreeNode) => state.nodeMap[typeof keyOrNode === "string" ? keyOrNode : keyOrNode.key],
        /*设置子节点数据*/
        setChildrenData: (node: TreeNode, data: any[]) => {if (!!props.childrenField) {node.data[props.childrenField] = data}},
    }

    const stopWatchEffect = watchEffect(
        () => iteratorTreeData({data: dataModel.value || [], childrenField: props.childrenField!}),
        {onTrigger: handler.onDataChange}
    )
    onBeforeUnmount(stopWatchEffect)

    return {
        state,
        utils,
        flatList,
        methods,
        checkNodes,
        expandNodes,
    }
}