import {SimpleObject} from "../../../shims";
import {TreeNodeCheckStatus} from "../../tree/utils/tree-constant";
import {FormValidate, FormValidateResult, FormValidateReturn} from "../../form/form.validate";
import {computed, ExtractPropTypes, onBeforeUnmount, reactive, ref, watchEffect} from 'vue';
import {TableProps} from "./table.utils";
import {useModel} from "../../../use/useModel";
import {createKeyHandler} from "../../../utils/createKeyHandler";
import {deepcopy} from "plain-utils/object/deepcopy";
import {throttle} from "plain-utils/utils/throttle";

export function useTableNode(
    {
        props,
        emit,
        getValidate,
    }: {
        props: ExtractPropTypes<typeof TableProps>,
        emit: { onUpdateData: (data?: SimpleObject[]) => void },
        getValidate: () => FormValidate,
    }
) {

    /*---------------------------------------state-------------------------------------------*/

    /*因为可能会发生拖拽节点，懒加载数据等操作，这里table内保存一份数据快照*/
    const dataModel = useModel(() => props.data, emit.onUpdateData)

    const utils = {
        getNodeByData: tableNodeGetter({props, getValidate})(),
        getNodeState: () => {
            const nodeMap = {} as Record<string, TableNode>;
            const iterator = ({data, level, parentRef, summary}: { data: SimpleObject, level: number, parentRef: () => TableNode, summary: boolean }): TableNode => {
                const node = utils.getNodeByData({data, level, parentRef, summary})
                nodeMap[node.key] = node
                const childrenData = !props.childrenField ? null : (data[props.childrenField!] as SimpleObject[])
                if (!!childrenData) {
                    node.children = childrenData.map(child => iterator({data: child, level: level + 1, parentRef: node.selfRef, summary}))
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
                summary: false,
            })
            return {
                nodeMap,
                root
            }
        },
    }

    const nodeState = utils.getNodeState()
    const root = ref(nodeState.root)
    const nodeMap = ref(nodeState.nodeMap)

    const state = reactive({
        /*虚拟根节点*/
        root,
        /*通过key找到node的映射*/
        nodeMap,
        /*拍平的数组*/
        flatNodes: computed(() => {
            let list: TableNode[] = []
            if (!state.root) {
                return []
            }
            iterateNodes({
                nodes: state.root.children,
                iterateChildren: (treeNode) => treeNode.expand,
                handler: (treeNode) => list.push(treeNode),
            },)
            list = list.filter((treeNode) => !!treeNode.isVisible)
            list.forEach((node, index) => node.index = index)
            return list
        }),
        summaryNodes: computed(() => !props.summaryData ? null : props.summaryData.map((data) => utils.getNodeByData({data, level: 1, parentRef: null as any, summary: true})))
    })

    const stopWatchEffect = watchEffect(
        () => iteratorTreeData({data: dataModel.value || [], childrenField: props.childrenField!}),
        {
            onTrigger: throttle(async () => {
                const {root, nodeMap} = utils.getNodeState()
                state.root = root
                state.nodeMap = nodeMap
            }, 100)
        }
    )
    onBeforeUnmount(stopWatchEffect)

    return {nodeState: state}
}

export type TableNode = {

    key: string,                                        // 节点唯一标识
    data: SimpleObject,                                 // 节点数据
    level: number,                                      // 节点层级
    parentRef: () => TableNode | null,                  // 父节点引用
    selfRef: () => TableNode,                           // 自身引用
    index: number,                                      // 节点索引
    children?: TableNode[],                             // 子节点数组

    expand: boolean,                                    // 节点是否已经展开
    check: boolean,                                     // 节点是够已经选中
    loading: boolean,                                   // 节点是否处于加载状态
    loaded: boolean,                                    // 节点是否已经加载完毕

    readonly childrenData?: SimpleObject[]              // 子节点数据数组
    readonly checkStatus: TreeNodeCheckStatus,          // 节点选中状态
    readonly isCheckable: boolean,                      // 节点是否可以选择
    readonly isLeaf: boolean,                           // 节点是否为叶子节点
    readonly isVisible: boolean,                        // 节点是否可见

    removeSelf: () => void,                             // 移除自身节点
    previousSibling: (node: TableNode) => void,         // 将目标节点插入为自身节点的兄节点
    nextSibling: (node: TableNode) => void,             // 将目标节点插入为自身节点的弟节点
    unshiftChild: (node: TableNode) => void,            // 将目标节点插入为当前节点的子节点
    getReactiveChildrenData: () => SimpleObject[],      // 获取响应式子节点数据数组

    /*---------------------------------------edit-------------------------------------------*/

    isSummary: boolean,                                 // 当前是否为合计行数据
    edit: boolean,                                      // 当前是否处于可编辑状态
    editRow: SimpleObject,                              // 编辑行对象
    validateResult: FormValidateResult | null,          // 当前行的校验结果

    openEdit: () => void,                               // 开启编辑状态（不做任何处理）
    closeEdit: () => void,                              // 关闭编辑状态（不做任何处理）
    enableEdit: () => void,                             // 开启编辑状态（先判断当前是否可编辑，深度赋值一份data赋值给editRow，并且立即执行校验）
    cancelEdit: () => void,                             // 取消编辑状态
    validate: () => Promise<FormValidateReturn | null>, // 校验数据
    saveEdit: (newRow: SimpleObject) => Promise<void>,  // 保存编辑，将editRow以及newRow（请求得到的新对象）覆盖data

}

/**
 * 产生一个用来获取TableNode的工具函数
 * @author  韦胜健
 * @date    2020/12/18 23:09
 */
function tableNodeGetter({props, getValidate}: { props: ExtractPropTypes<typeof TableProps>, getValidate: () => FormValidate }) {
    const keyManager = createKeyHandler('table')
    /*之所以要返回一个函数再执行一遍，是因为map要重新创建，以便不同的table使用不同的map做缓存*/
    return () => {
        const map = new WeakMap<object, TableNode>()
        const get = ({data, level, parentRef, summary}: { data: any, level: number, parentRef: () => TableNode, summary: boolean }) => {
            let node: (TableNode | undefined) = map.get(data)
            const key = keyManager(data, props.keyField)
            if (!!node) {
                node.key !== key && (node.key = key);
                node.data !== data && (node.data = data);
                node.level !== level && (node.level = level);
                node.parentRef !== parentRef && (node.parentRef = parentRef);
            } else {
                node = {
                    key, data, level, parentRef, index: 0,
                    selfRef() {return this},
                    // 这里先不计算，在resetData的时候才计算
                    children: [],

                    expand: false,
                    check: false,
                    loading: false,
                    loaded: true,

                    get childrenData() {return (!props.childrenField || !this.data) ? null : this.data[props.childrenField]},
                    /* todo 这里并不会立即执行，当渲染VNodeChild的时候这里才会执行，所以不存在checkStatus.value不存在的问题*/
                    // get checkStatus() {return checkStatus.value[this.key]},
                    get checkStatus() {return TreeNodeCheckStatus.uncheck},
                    get isCheckable() {return !props.isCheckable || props.isCheckable(this)},
                    get isLeaf() {return !!props.isLeaf ? props.isLeaf(this) : !this.childrenData},
                    get isVisible() {return !props.filterNodeMethod ? true : (props.filterNodeMethod(this) || (!!this.children && this.children.some(child => child.isVisible)))},

                    /*将自身节点移除*/
                    removeSelf() {
                        const parentChildrenData = this.parentRef()!.childrenData!
                        parentChildrenData.splice(parentChildrenData.indexOf(this.data), 1)
                    },
                    /*将目标节点插入当前节点前面*/
                    previousSibling(node: TableNode) {
                        let parentChildrenData = this.parentRef()!.getReactiveChildrenData()
                        node.parentRef = this.parentRef
                        node.level = this.level
                        parentChildrenData.splice(parentChildrenData.indexOf(this.data), 0, node.data)
                    },
                    /*将目标节点插入当前节点后面*/
                    nextSibling(node: TableNode) {
                        let parentChildrenData = this.parentRef()!.getReactiveChildrenData()
                        node.parentRef = this.parentRef
                        node.level = this.level
                        parentChildrenData.splice(parentChildrenData.indexOf(this.data) + 1, 0, node.data)
                    },
                    /*将目标节点插入当前节点子节点中*/
                    unshiftChild(node: TableNode) {
                        let childrenData = this.getReactiveChildrenData()
                        node.parentRef = () => this
                        node.level = this.level + 1
                        childrenData.unshift(node.data)
                    },
                    /*获取响应式的子节点数据*/
                    getReactiveChildrenData(): any[] {
                        let childrenData = this.childrenData
                        if (!childrenData) {
                            childrenData = []
                            this.data[props.childrenField!] = childrenData
                        }
                        return childrenData
                    },

                    /*当前是否为合计行*/
                    isSummary: summary,
                    /*当前是否开启编辑状态*/
                    edit: false,
                    /*当前编辑行数据*/
                    editRow: data,
                    /*校验结果信息*/
                    validateResult: null,

                    /*开启编辑状态（不做任何处理）*/
                    openEdit() {this.edit = true},
                    /*关闭编辑状态（不做任何处理）*/
                    closeEdit() {this.edit = false},
                    /*开启编辑状态（先判断当前是否可编辑，深度赋值一份data赋值给editRow，并且立即执行校验）*/
                    enableEdit() {
                        if (this.edit) return
                        this.editRow = deepcopy(this.data)
                        this.openEdit()
                        this.validate()
                    },
                    /*取消编辑状态*/
                    cancelEdit() {this.edit && this.closeEdit()},
                    /*校验数据*/
                    async validate() {
                        const {methods: {validate}} = getValidate()
                        const {validateMessage, validateResult, validateResultMap} = await validate(this.editRow)
                        this.validateResult = validateResult || null
                        return !validateMessage ? null : {
                            validateMessage,
                            validateResult,
                            validateResultMap
                        }
                    },
                    /*保存编辑，将editRow以及newRow（请求得到的新对象）覆盖data*/
                    async saveEdit(newRow) {
                        if (!this.edit) return
                        const {data, editRow} = this
                        Object.keys({...data, ...editRow, ...newRow}).forEach(k => this.data[k] = newRow[k])
                    },
                }
            }
            return node
        }
        return get
    }
}

/**
 * 遍历所有的treeNode
 * @author  韦胜健
 * @date    2020/3/30 19:30
 * @param   treeNodes               要遍历的数据
 * @param   handler                 处理函数
 * @param   iterateChildren         判断是否遍历其子节点数据
 * @param   iterateChildrenFirst    先遍历子节点
 */
function iterateNodes(
    {
        nodes,
        handler,
        iterateChildren,
        iterateChildrenFirst,
    }: {
        nodes?: TableNode[] | Readonly<TableNode[]> | null,
        handler: (node: TableNode) => void,
        iterateChildren?: (node: TableNode) => boolean,
        iterateChildrenFirst?: boolean,
    },
): void {
    if (!nodes) return
    nodes.forEach(treeNode => {
        !iterateChildrenFirst && handler(treeNode);
        if (!!treeNode.children && (!iterateChildren || iterateChildren(treeNode))) {
            iterateNodes({
                nodes: treeNode.children,
                handler,
                iterateChildren,
                iterateChildrenFirst,
            })
        }
        iterateChildrenFirst && handler(treeNode);
    })
}

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