import {computed, onBeforeUnmount, reactive, watchEffect} from 'vue';
import {useModel} from "../../../use/useModel";
import {TreeEmptyNode, TreeNode, TreePropsType} from "./type";
import {TreeNodeCheckStatus} from "../utils/tree-constant";
import {TreeUtils} from "./utils";
import {useFlagManager} from "../../../utils/useFlagManager";
import {createKeyHandler} from "../../../utils/createKeyHandler";
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
function iterateData({data, childrenField}: { data?: any[], childrenField: string }) {
    if (!!data) {
        data.forEach(item => {
            if (!!item[childrenField]) {
                iterateData({data: item[childrenField], childrenField})
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

    /*data双向绑定值*/
    const dataModel = useModel(() => props.data, event.emit.updateData)

    const expand = useFlagManager<TreeNode, boolean>()          // 是否展开
    const check = useFlagManager<TreeNode, boolean>()           // 是否选中
    const loading = useFlagManager<TreeNode, boolean>()         // 是否正在加载中
    const loaded = useFlagManager<TreeNode, boolean>()          // 是否已经加载完毕

    /**
     * 根据 data，level，parentRef获取 treeNode对象
     * @author  韦胜健
     * @date    2020/12/2 12:12
     */
    const getNode = (() => {
        const map = new WeakMap<object, TreeNode>()
        const get = ({data, level, parentRef}: { data: any, level: number, parentRef: () => TreeNode }): TreeNode => {
            let node: TreeNode | undefined = map.get(data)
            if (!node) {
                node = {
                    key: keyManager(data, props.keyField),
                    data,
                    level,
                    parentRef,
                    selfRef: () => node!,

                    get label() {return !!props.labelField && !!data ? data[props.labelField] : null},
                    get childrenData() {return data[props.childrenField!]},
                    get children() {return !this.childrenData ? undefined : this.childrenData.map(d => get({data: d, level: level + 1, parentRef: this.selfRef}))},
                    get checkStatus() {
                        if (!props.showCheckbox) {
                            return TreeNodeCheckStatus.uncheck
                        }
                        if (props.checkStrictly || this.isLeaf) {
                            return this.check ? TreeNodeCheckStatus.check : TreeNodeCheckStatus.uncheck
                        } else {
                            if (this.check) {
                                return TreeNodeCheckStatus.check
                            } else {
                                if (!!this.children && this.children.every(child => child.checkStatus === TreeNodeCheckStatus.uncheck)) {
                                    return TreeNodeCheckStatus.uncheck
                                } else {
                                    return TreeNodeCheckStatus.minus
                                }
                            }
                        }
                    },

                    get expand() {return expand.get(this.key)},
                    set expand(val) {expand.set(this.key, val)},
                    get check() {return check.get(this.key)},
                    set check(val) {check.set(this.key, val)},
                    get loading() {return loading.get(this.key)},
                    set loading(val) {loading.set(this.key, val)},
                    get loaded() {return !props.lazy || loaded.get(this.key) === true},
                    set loaded(val) {loaded.set(this.key, val)},

                    get isCheckable() {return !props.isCheckable || props.isCheckable(this)},
                    get isLeaf() {return !!props.isLeaf ? props.isLeaf(this) : !this.childrenData},
                    get isVisible() {
                        return !props.filterNodeMethod ? true : (props.filterNodeMethod(this) || (!!this.children && this.children.some(child => child.isVisible)))
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
    })();

    const state = reactive({
        /*虚拟跟节点, 根节点treeNode对象*/
        root: getNode({
            data: {
                [props.keyField!]: '@@root',
                [props.childrenField!]: dataModel.value
            },
            level: 0,
            parentRef: null as any,
        }),
        /*key与treeNode的关系映射对象*/
        nodeMap: {} as Record<string, TreeNode>,

        expand,
        check,
        loading,
        loaded,
        dataModel,
    })

    /**
     * 拍平的树形数据（不拍平无法实现虚拟滚动）
     * @author  韦胜健
     * @date    2020/12/2 12:16
     */
    const flatList = computed(() => {
        let result: (TreeNode | TreeEmptyNode)[] = []
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
                    result.push(() => treeNode)
                }
            },
        },)
        result = result.filter((treeNode) => typeof treeNode === "function" ? true : !!treeNode.isVisible)
        return result
    })

    const methods = {
        /*这里一直从 nodeMap 中获取最新的，因为keyOrNode如果是treeNode的话，可能只是一个快照*/
        getNode: (keyOrNode: string | TreeNode) => state.nodeMap[typeof keyOrNode === "string" ? keyOrNode : keyOrNode.key],
        /*设置子节点数据*/
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
                    state.root.loading = true
                } else {
                    loading.set(treeNode, true)
                }
                props.getChildren(treeNode, (...results) => {
                    if (treeNode.level === 0) {
                        state.root.loading = false
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
            utils.getChildrenAsync(state.root).then(val => dataModel.value = val)
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
    }

    /**
     * 刷新 state.nodeMap 以及 flagManager中的keys
     * @author  韦胜健
     * @date    2020/12/2 12:17
     */
    const refreshNodeMap = () => {
        const map = {} as Record<string, TreeNode>
        TreeUtils.iterateAll({
            nodes: state.root.children,
            handler: node => map[node.key] = node
        })

        const deleteKeys = (() => {
            const keys = [] as string[]
            Object.keys(state.nodeMap).forEach(key => !(key in map) && keys.push(key))
            return keys
        })();

        expand.removeKeys(deleteKeys)
        check.removeKeys(deleteKeys)
        loading.removeKeys(deleteKeys)
        loaded.removeKeys(deleteKeys)

        state.nodeMap = map
    }

    const stopWatchEffect = watchEffect(
        () => iterateData({data: dataModel.value, childrenField: props.childrenField!}),
        {
            onTrigger: (e) => {
                if (!Array.isArray(e.target)) {
                    return
                }
                if (!(e.type === 'add' || e.type === 'delete')) {
                    return;
                }
                refreshNodeMap()
            }
        })
    refreshNodeMap()
    onBeforeUnmount(stopWatchEffect)

    return {
        state,
        utils,
        flatList,
        methods,
    }
}