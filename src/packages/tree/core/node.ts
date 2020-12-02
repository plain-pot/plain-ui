import {computed, ref, watchEffect} from 'vue';
import {useModel} from "../../../use/useModel";
import {createCounter} from "../../../utils/createCounter";
import {TreeEmptyNode, TreeNode, TreePropsType} from "./type";
import {TreeNodeCheckStatus} from "../utils/tree-constant";
import {TreeUtils} from "./utils";
import {useFlagManager} from "../../../utils/useFlagManager";
import isCheckable = TreePropsType.isCheckable;
import isLeaf = TreePropsType.isLeaf;
import filterNodeMethod = TreePropsType.filterNodeMethod;
import getChildren = TreePropsType.getChildren;

const keyCounter = createCounter('tree')

function iterateData({data, childrenField}: { data?: any[], childrenField: string }) {
    if (!!data) {
        data.forEach(item => {
            if (!!item[childrenField]) {
                iterateData({data: item[childrenField], childrenField})
            }
        })
    }
}

function useFormatData(
    {
        dataModel,
        childrenField,
    }: {
        dataModel: { value: any[] | undefined },
        childrenField: string
    }) {

    watchEffect(() => {
        iterateData({data: dataModel.value, childrenField})
    }, {
        onTrigger: (e) => {
            if (Array.isArray(e.target)) {
                if (e.type === 'add' || e.type === 'delete') {
                    console.log('refresh')
                }
            }
        }
    })
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

    /*根节点是否loading*/
    const rootLoading = ref(false)
    /*data双向绑定值*/
    const dataModel = useModel(() => props.data, event.emit.updateData)

    const expand = useFlagManager<TreeNode, boolean>()          // 是否展开
    const check = useFlagManager<TreeNode, boolean>()           // 是否选中
    const loading = useFlagManager<TreeNode, boolean>()         // 是否正在加载中
    const loaded = useFlagManager<TreeNode, boolean>()          // 是否已经加载完毕


    const getKey = (() => {
        const map = new WeakMap<object, string>()
        return (data: any): string => {
            let key = map.get(data)
            if (!key) {
                if (!!props.keyField) {
                    key = data[props.keyField]
                }
                if (!key) {
                    key = keyCounter()
                }
                map.set(data, key)
            }
            return key
        }
    })();

    const getNode = (() => {

        const map = new WeakMap<object, TreeNode>()

        const getter = ({data, level, parentRef}: { data: any, level: number, parentRef: () => TreeNode }): TreeNode => {
            let node: TreeNode | undefined = map.get(data)
            if (!node) {
                node = {
                    key: getKey(data),
                    data,
                    level,
                    parentRef,
                    selfRef: () => node!,

                    get label() {return !!props.labelField && !!data ? data[props.labelField] : null},
                    get childrenData() {return data[props.childrenField!]},
                    get children() {return !this.childrenData ? undefined : this.childrenData.map(d => getter({data: d, level: level + 1, parentRef: this.selfRef}))},
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
                    key: getKey(data),
                    data,
                    level,
                    parentRef,
                })
            }
            return node!
        }

        return {
            map,
            getter,
        }

    })();

    const formatData = computed(() => {
        // console.log('formatData')
        /*虚拟跟节点*/
        const rootNode = getNode.getter({
            data: {
                [props.keyField!]: '@@root',
                [props.childrenField!]: dataModel.value
            },
            level: 0,
            parentRef: null as any,
        })
        /*拍平的树形数据（不拍平无法实现虚拟滚动）*/
        let flatList: (TreeNode | TreeEmptyNode)[] = []
        TreeUtils.iterateAll({
            nodes: rootNode.children,
            iterateChildren: (treeNode: TreeNode) => treeNode.expand,
            handler: (treeNode: TreeNode) => {
                flatList.push(treeNode)
                // console.log(treeNode.label, {'!treeNode.isLeaf': !treeNode.isLeaf, 'treeNode.loaded': treeNode.loaded, 'treeNode.isVisible': treeNode.isVisible, 'treeNode.expand': treeNode.expand, 'treeNode.children': treeNode.children,})
                if (
                    !treeNode.isLeaf &&
                    treeNode.loaded &&
                    treeNode.isVisible &&
                    treeNode.expand &&
                    treeNode.children!.length === 0
                ) {
                    flatList.push(() => treeNode)
                }
            },
        },)
        flatList = flatList.filter((treeNode) => typeof treeNode === "function" ? true : !!treeNode.isVisible)

        /*node对象映射，方便通过key查找node*/
        const nodeMap = {} as Record<string, TreeNode>
        TreeUtils.iterateAll({
            nodes: rootNode.children,
            handler: (node) => nodeMap[node.key] = node
        })

        return {
            rootNode,
            nodeMap,
            nodeList: rootNode.children,
            flatList,
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