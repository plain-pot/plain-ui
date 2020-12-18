import {SimpleObject} from "../../../shims";
import {TreeNodeCheckStatus} from "../../tree/utils/tree-constant";
import {FormValidateResult, FormValidateReturn} from "../../form/form.validate";

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
    readonly label?: string,                            // 节点显示文本
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