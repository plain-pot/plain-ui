import {TreeNodeCheckStatus} from "../utils/tree-constant";
import {computed, onBeforeUnmount, reactive, useModel, watchEffect} from "plain-design-composition";
import {PlainObject} from "plain-utils/utils/event";

/**
 * 根据childrenField遍历data树形数据
 * @author  韦胜健
 * @date    2020/12/2 12:22
 */
function iteratorTreeData({data, childrenField}: { data?: PlainObject[], childrenField: string }) {
    if (!!data) {
        data.forEach(item => {
            if (!!item[childrenField]) {
                iteratorTreeData({data: item[childrenField], childrenField})
            }
        })
    }
}

export function useTreeNode<Node extends {
    key: string,
    data: PlainObject,
    level: number,
    parentRef: () => Node | null,
    selfRef: () => Node,

    index: number,

    readonly childrenData?: PlainObject[]
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
        event,
        keyManager,
        getTreeNodeByDataAdjust,
    }: {
        props: {
            data?: PlainObject[],
            labelField?: string,
            keyField?: string,
            childrenField?: string,
            filterNodeMethod?: (node: Node) => boolean,
            isLeaf?: (node: Node) => boolean,
            isCheckable?: (node: Node) => boolean,
            getChildren?: (node: Node, cb: (data: PlainObject[]) => void) => void,
            lazy?: boolean,
            showCheckbox?: boolean,
            checkStrictly?: boolean,
        },
        event: {
            emit: { onUpdateData: (data?: PlainObject[]) => void }
        },
        keyManager: (obj: any, keyField: string | undefined | null) => string,
        getTreeNodeByDataAdjust?: (node: Node) => void,
    }
) {

    /*内部data变量*/
    const dataModel = useModel(() => props.data, event.emit.onUpdateData)

    const field = reactive({
        key: computed(() => props.keyField || 'id'),
        children: computed(() => props.childrenField || 'children')
    })

    const rootData = {[field.key]: '@@$$root', [field.children]: dataModel.value}

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
        utils.iterate({
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
        /*根据data获取Node*/
        getTreeNodeByData: (() => {
            const map = new WeakMap<Record<string, any>, Node>()
            const get = ({data, level, parentRef, adjust}: { data: any, level: number, parentRef: () => Node, adjust?: (node: Node) => void }): Node => {
                let node: Node | undefined = map.get(data)
                if (!node) {
                    node = {
                        index: 0,
                        key: keyManager(data, props.keyField),
                        data,
                        level,
                        parentRef,
                        selfRef() {return this},
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

                        get isCheckable() {return !props.isCheckable || props.isCheckable(this as any)},
                        get isLeaf() {return !!props.isLeaf ? props.isLeaf(this as any) : !this.childrenData},
                        get isVisible() {
                            return !props.filterNodeMethod ? true : (props.filterNodeMethod(this as any) || (!!this.children && this.children.some((child: Node) => child.isVisible)))
                        },
                    } as any
                    if (!!adjust) adjust(node!)
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
         * 重置state中的data数据
         * 为什么不直接把root以及nodeMap做成计算属性。
         * 因为在计算root以及nodeMap的时候，会获取 label，key以及children，如果这些字段被修改了，可能会导致
         * 这个计算属性频繁执行。这里只检查子节点数据，当子节点数据变化的时候才重新执行root以及nodeMap
         * @author  韦胜健
         * @date    2020/12/17 16:17
         */
        resetData: () => {
            const nodeMap = {} as Record<string, Node>;
            const iterator = ({data, level, parentRef}: { data: any, level: number, parentRef: () => Node }): Node => {
                const node = utils.getTreeNodeByData({data, level, parentRef, adjust: getTreeNodeByDataAdjust})
                nodeMap[node.key] = node
                const childrenData = !props.childrenField ? null : (data[props.childrenField!] as PlainObject[])
                if (!!childrenData) {
                    node.children = childrenData.map(child => iterator({data: child, level: level + 1, parentRef: () => state.nodeMap[node.key]}))
                }
                return node
            }

            rootData[props.childrenField || 'children'] = dataModel.value
            const root = iterator({
                data: rootData,
                level: 0,
                parentRef: null as any,
            })

            return {
                nodeMap,
                root
            }
        },
        /*遍历所有节点数据*/
        iterate: ({nodes, handler, iterateChildren, iterateChildrenFirst,}: { nodes: Node[] | undefined, handler: (node: Node) => void, iterateChildren?: (node: Node) => boolean, iterateChildrenFirst?: boolean, }) => {
            if (!nodes) return
            nodes.forEach(Node => {
                !iterateChildrenFirst && handler(Node);
                if (!!Node.children && (!iterateChildren || iterateChildren(Node))) {
                    utils.iterate({nodes: Node.children, handler, iterateChildren, iterateChildrenFirst,})
                }
                iterateChildrenFirst && handler(Node);
            })
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
    })()) as { root: Node, nodeMap: Record<string, Node> };

    const dataEffectTrigger = () => {
        const {root, nodeMap} = utils.resetData()
        state.root = reactive({...root}) as any
        state.nodeMap = nodeMap
    }

    const stopWatchEffect = watchEffect(() => {
        state.root.data[field.children] = dataModel.value
        iteratorTreeData({data: dataModel.value || [], childrenField: props.childrenField!})
        dataEffectTrigger()
    })
    onBeforeUnmount(stopWatchEffect)

    const methods = {
        getReactiveChildrenData(node: Node) {
            let childrenData = node.childrenData
            if (!childrenData) {
                childrenData = []
                node.data[props.childrenField!] = childrenData
            }
            return childrenData
        },
        removeSelf: (node: Node) => {
            const parentChildrenData = node.parentRef()!.childrenData!
            parentChildrenData.splice(parentChildrenData.indexOf(node.data), 1)
        },
        previousSibling: (self: Node, target: Node) => {
            let parentChildrenData = methods.getReactiveChildrenData(self.parentRef()!)
            target.parentRef = self.parentRef
            target.level = self.level
            parentChildrenData.splice(parentChildrenData.indexOf(self.data), 0, target.data)
        },
        nextSibling: (self: Node, target: Node) => {
            let parentChildrenData = methods.getReactiveChildrenData(self.parentRef()!)
            target.parentRef = self.parentRef
            target.level = self.level
            parentChildrenData.splice(parentChildrenData.indexOf(self.data) + 1, 0, target.data)
        },
        unshiftChild: (self: Node, target: Node) => {
            let childrenData = methods.getReactiveChildrenData(self)
            target.parentRef = () => self
            target.level = self.level + 1
            childrenData.unshift(target.data)
        },
    }

    return {
        dataModel,
        state,
        utils,
        methods,
    }
}
