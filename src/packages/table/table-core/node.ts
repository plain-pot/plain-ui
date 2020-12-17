import {FormValidate, FormValidateResult, FormValidateReturn} from "../../form/form.validate";
import {SimpleObject} from "../../../shims";
import {TableFilterNodeMethod, TableGetChildrenFunction, TableIsCheckable, TableIsLeaf} from "../table.type";
import {useModel} from "../../../use/useModel";
import {TreeNodeCheckStatus} from "../../tree/utils/tree-constant";
import {computed, reactive} from 'vue';
import {createKeyHandler} from "../../../utils/createKeyHandler";
import {deepcopy} from "plain-utils/object/deepcopy";

/**
 * TableNode对象类型
 * @author  韦胜健
 * @date    2020/12/17 15:37
 */
export type TableNode = {
    key: string,                                        // 节点唯一标识
    data: SimpleObject,                                 // 节点数据
    level: number,                                      // 节点层级
    parentRef: () => TableNode | null,                  // 父节点引用
    selfRef: () => TableNode,                           // 自身引用

    index: number,                                      // 节点索引
    empty: boolean,                                     // 是否为空节点

    readonly childrenData?: SimpleObject[]              // 子节点数据数组
    readonly label?: string,                            // 节点显示文本
    children?: TableNode[],                             // 子节点数组
    readonly checkStatus: TreeNodeCheckStatus,          // 节点选中状态

    expand: boolean,                                    // 节点是否已经展开
    check: boolean,                                     // 节点是够已经选中
    loading: boolean,                                   // 节点是否处于加载状态
    loaded: boolean,                                    // 节点是否已经加载完毕

    readonly isCheckable: boolean,                      // 节点是否可以选择
    readonly isLeaf: boolean,                           // 节点是否为叶子节点
    readonly isVisible: boolean,                        // 节点是否可见

    removeSelf: () => void,                             // 移除自身节点
    previousSibling: (node: TableNode) => void,         // 将目标节点插入为自身节点的兄节点
    nextSibling: (node: TableNode) => void,             // 将目标节点插入为自身节点的弟节点
    unshiftChild: (node: TableNode) => void,            // 将目标节点插入为当前节点的子节点
    getReactiveChildrenData: () => SimpleObject[],      // 获取响应式子节点数据数组

    isSummaryData: boolean,                             // 当前是否为合计行数据
    edit: boolean,                                      // 当前是否处于可编辑状态
    editRow: SimpleObject,                              // 编辑行对象
    validateResult: FormValidateResult | null,          // 当前行的校验结果
    // getRules: () => FormValidate,                       // 获取校验规则

    openEdit: () => void,                               // 开启编辑状态（不做任何处理）
    closeEdit: () => void,                              // 关闭编辑状态（不做任何处理）
    enableEdit: () => void,                             // 开启编辑状态（先判断当前是否可编辑，深度赋值一份data赋值给editRow，并且立即执行校验）
    cancelEdit: () => void,                             // 取消编辑状态
    validate: () => Promise<FormValidateReturn | null>, // 校验数据
    saveEdit: (newRow: SimpleObject) => Promise<void>,  // 保存编辑，将editRow以及newRow（请求得到的新对象）覆盖data
}

const keyManager = createKeyHandler('table')

/**
 * 遍历所有的treeNode
 * @author  韦胜健
 * @date    2020/3/30 19:30
 * @param   treeNodes               要遍历的数据
 * @param   handler                 处理函数
 * @param   iterateChildren         判断是否遍历其子节点数据
 * @param   iterateChildrenFirst    先遍历子节点
 */
function iterateAll(
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
            iterateAll({
                nodes: treeNode.children,
                handler,
                iterateChildren,
                iterateChildrenFirst,
            })
        }
        iterateChildrenFirst && handler(treeNode);
    })
}

export function useTableNode(
    {
        props,
        event,
        getValidate,
    }: {
        props: {
            data?: SimpleObject[],
            labelField?: string,
            keyField?: string,
            childrenField?: string,
            filterNodeMethod?: TableFilterNodeMethod,
            isLeaf?: TableIsLeaf,
            isCheckable?: TableIsCheckable,
            getChildren?: TableGetChildrenFunction,
            lazy?: boolean,
            showCheckbox?: boolean,
            checkStrictly?: boolean,
        },
        event: {
            emit: { onUpdateData: (data?: SimpleObject[]) => void }
        },
        getValidate: () => FormValidate,
    }
) {

    /*内部data变量*/
    const dataModel = useModel(() => props.data, event.emit.onUpdateData)

    /*---------------------------------------computed-------------------------------------------*/

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
        iterateAll({
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

    /*---------------------------------------utils-------------------------------------------*/

    const utils = {
        /**
         * 获取Node
         * @author  韦胜健
         * @date    2020/12/15 13:33
         */
        getTreeNodeByData: (() => {
            const map = new WeakMap<object, TableNode>()
            const get = ({data, level, parentRef}: { data: any, level: number, parentRef: () => TableNode }): TableNode => {
                let node: (TableNode | undefined) = map.get(data)
                if (!node) {
                    node = {
                        key: keyManager(data, props.keyField),
                        data,
                        level,
                        parentRef,
                        selfRef: () => node!,

                        index: 0,
                        empty: false,

                        get childrenData() {return data[props.childrenField!]},
                        children: [],
                        get label() {return !!props.labelField && !!data ? data[props.labelField] : null},
                        /* todo 这里并不会立即执行，当渲染VNodeChild的时候这里才会执行，所以不存在checkStatus.value不存在的问题*/
                        get checkStatus() {return checkStatus.value[this.key]},
                        // get checkStatus() {return TreeNodeCheckStatus.uncheck},

                        expand: false,
                        check: false,
                        loading: false,
                        loaded: !props.lazy,

                        get isCheckable() {return !props.isCheckable || props.isCheckable(this)},
                        get isLeaf() {return !!props.isLeaf ? props.isLeaf(this) : !this.childrenData},
                        get isVisible() {return !props.filterNodeMethod ? true : (props.filterNodeMethod(this) || (!!this.children && this.children.some(child => child.isVisible)))},

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
                        previousSibling(node: TableNode) {
                            let parentChildrenData = this.parentRef()!.getReactiveChildrenData()
                            node.parentRef = this.parentRef
                            node.level = this.level
                            parentChildrenData.splice(parentChildrenData.indexOf(this.data), 0, node.data)
                        },
                        nextSibling(node: TableNode) {
                            let parentChildrenData = this.parentRef()!.getReactiveChildrenData()
                            node.parentRef = this.parentRef
                            node.level = this.level
                            parentChildrenData.splice(parentChildrenData.indexOf(this.data) + 1, 0, node.data)
                        },
                        unshiftChild(node: TableNode) {
                            let childrenData = this.getReactiveChildrenData()
                            node.parentRef = () => this
                            node.level = this.level + 1
                            childrenData.unshift(node.data)
                        },

                        isSummaryData: false,
                        edit: false,
                        editRow: {} as any,
                        validateResult: null,
                        openEdit() {this.edit = true},
                        closeEdit() {this.edit = false},
                        enableEdit() {
                            if (this.edit) return
                            this.editRow = deepcopy(this.data)
                            this.openEdit()
                            this.validate()
                        },
                        cancelEdit() {
                            if (!this.edit) return
                            this.closeEdit()
                        },
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
                        async saveEdit(newRow) {
                            if (!this.edit) return
                            const {data, editRow} = this
                            Object.keys({...data, ...editRow, ...newRow}).forEach(k => this.data[k] = newRow[k])
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
        resetData: () => {
            const nodeMap = {} as Record<string, TableNode>;
            const iterator = ({data, level, parentRef}: { data: SimpleObject, level: number, parentRef: () => TableNode }): TableNode => {
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

    /*---------------------------------------end-------------------------------------------*/

    const state = reactive((() => {
        const {root, nodeMap} = utils.resetData()
        return {
            /*虚拟跟节点*/
            root,
            /*节点映射node*/
            nodeMap
        }
    })())

    return {
        state,
    }

}