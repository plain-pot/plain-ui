import {computed, reactive, ref} from 'vue';
import {useModel} from "../../../use/useModel";
import {createCounter} from "../../../utils/createCounter";
import {TreeNode, TreePropsType} from "./type";
import {TreeNodeCheckStatus} from "../utils/tree-constant";
import isCheckable = TreePropsType.isCheckable;
import isLeaf = TreePropsType.isLeaf;
import filterNodeMethod = TreePropsType.filterNodeMethod;
import getChildren = TreePropsType.getChildren;

const keyCounter = createCounter('tree')

function useFlagManager<Node extends { key: string }, Value>() {
    const state = reactive({
        map: {}
    }) as { map: Record<string, Value> }
    return {
        get: (keyOrNode: string | Node): Value => {
            return state.map[typeof keyOrNode === "string" ? keyOrNode : keyOrNode.key]
        },
        set: (keyOrNode: string | Node, value: Value) => {
            state.map[typeof keyOrNode === "string" ? keyOrNode : keyOrNode.key] = value
        },
        setAll: (value: Value) => {
            for (let key in state.map) {
                state.map[key] = value
            }
        },
        getActiveKeys: () => {
            let keys = [] as string[]
            for (let key in state.map) {
                if (!!state.map[key]) {
                    keys.push(key)
                }
            }
            return keys
        },
        clear: () => {
            state.map = {}
        }
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
            data?: any[],
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
            emit: { updateData: (data?: any[]) => void }
        },
    }) {

    const dataModel = useModel(() => props.data, event.emit.updateData)

    const expand = useFlagManager<TreeNode, boolean>()
    const check = useFlagManager<TreeNode, boolean>()
    const loading = useFlagManager<TreeNode, boolean>()
    const loaded = useFlagManager<TreeNode, boolean>()

    const rootLoading = ref(false)

    const transform = (() => {
        const keyMap = new WeakMap<any, string>()
        return (
            {
                data,
                level,
                parentRef,
                nodeMap,
            }: {
                data: any,
                level: number,
                parentRef: () => TreeNode,
                nodeMap: Record<string, TreeNode>
            }): TreeNode => {
            let key = !props.keyField ? keyMap.get(data) : data[props.keyField]
            if (!key) {
                key = keyCounter()
                keyMap.set(data, key)
            }

            const node: TreeNode = {
                key,
                data,
                level,
                parentRef,
                get label() {return !!props.labelField && !!data ? data[props.labelField] : null},
                get childrenData() {return data[props.childrenField!]},
                get children() {return !this.childrenData ? undefined : this.childrenData.map(d => transform({data: d, level: level + 1, parentRef: () => node, nodeMap}))},
                get checkStatus() {
                    if (!props.showCheckbox) {
                        return TreeNodeCheckStatus.uncheck
                    }
                    if (props.checkStrictly || node.isLeaf) {
                        return node.check ? TreeNodeCheckStatus.check : TreeNodeCheckStatus.uncheck
                    } else {
                        if (node.check) {
                            return TreeNodeCheckStatus.check
                        } else {
                            if (!!node.children && node.children.every(child => child.checkStatus === TreeNodeCheckStatus.uncheck)) {
                                return TreeNodeCheckStatus.uncheck
                            } else {
                                return TreeNodeCheckStatus.minus
                            }
                        }
                    }
                },

                get expand() {return expand.get(key)},
                set expand(val) {expand.set(key, val)},
                get check() {return check.get(key)},
                set check(val) {check.set(key, val)},
                get loading() {return loading.get(key)},
                set loading(val) {loading.set(key, val)},
                get loaded() {return !props.lazy || loaded.get(key) === true},
                set loaded(val) {loaded.set(key, val)},

                get isCheckable() {return !props.isCheckable || props.isCheckable(node)},
                get isLeaf() {return !!props.isLeaf ? props.isLeaf(node) : !this.childrenData},
                get isVisible() {return !props.filterNodeMethod ? true : props.filterNodeMethod(node)},
            }

            nodeMap[node.key] = node

            return node
        }
    })();

    const formatData = computed(() => {
        /*虚拟跟节点*/
        const rootNode = {key: '@@root', childrenData: dataModel.value || [], level: 0,} as TreeNode
        /*node对象映射，方便通过key查找node*/
        const nodeMap = {} as Record<string, TreeNode>
        /*格式化后的数据*/
        const nodeList = rootNode.childrenData!.map((data: any) => transform({data, level: 1, nodeMap, parentRef: () => rootNode}))
        return {
            rootNode,
            nodeMap,
            nodeList,
        }
    })

    const methods = {
        expand: expand.set,
        check: check.set,
        loading: loading.set,
        loaded: loaded.set,

        /*这里一直从 nodeMap 中获取最新的，因为keyOrNode如果是treeNode的话，可能只是一个快照*/
        getNode: (keyOrNode: string | TreeNode) => formatData.value.nodeMap[typeof keyOrNode === "string" ? keyOrNode : keyOrNode.key],

        setChildrenData: (node: TreeNode, data: any[]) => {if (!!props.childrenField) {node.data[props.childrenField] = data}}
    }

    const utils = {
        /**
         * 处理keyOrNode
         * @author  韦胜健
         * @date    2020/11/28 9:34
         */
        handleKeyOrNode: async (
            keyOrNode: string | TreeNode | (string | TreeNode)[],
            handler: (node: TreeNode) => void | Promise<void>,
        ): Promise<any> => {
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
                    rootLoading.value = true
                } else {
                    loading.set(treeNode, true)
                }
                props.getChildren(treeNode, (...results) => {
                    if (treeNode.level === 0) {
                        rootLoading.value = false
                    } else {
                        loading.set(treeNode, false)
                        loaded.set(treeNode, true)
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
            if (!props.lazy) {return}
            utils.getChildrenAsync(formatData.value.rootNode).then(val => dataModel.value = val)

        },
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
    }

    return {
        state: {
            rootLoading,
            expand,
            check,
            loading,
            loaded,
            dataModel,
        },
        utils,
        formatData,
        methods,
    }
}