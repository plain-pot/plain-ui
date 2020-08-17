import {TableCheckStatus, TablePropsType} from "@/packages/table/table-utils";
import {TableMark, TableMarkAttr} from "@/packages/table/table-bak/TableMark";
import {set} from "@vue/composition-api";
import {$plain} from "@/packages/base";
import {validateAsync, ValidateResultMap} from "@/packages/form/validate";

export class TableNode {

    /**
     * 构造函数中标记的成员变量都是初始化之后就不可变的，而 TableMark中标记的变量是动态可变的
     * @author  韦胜健
     * @date    2020/6/16 16:07
     */
    constructor(
        public key: string,
        public data: object,
        public props: TablePropsType,
        public level,
        public parent: TableNode | null,
        public mark: TableMark,
        public isSummaryData: boolean,
    ) {
        // 触发 this.mark.getNode 获取子节点，使得所有的node都记录在mark中；
        this.children;
    }

    index!: number

    // 树形表格：子节点数据
    get childrenData() {return !!this.props.childrenField && !!this.data ? this.data[this.props.childrenField] : undefined}

    // 树形表格：子节点对象
    get children() {return !this.childrenData ? undefined : this.childrenData.map(child => this.mark.getNode(child, this.props, this.level + 1, this, this.isSummaryData))}

    /*---------------------------------------mark attrs-------------------------------------------*/
    /*@formatter:off*/
    // 树形表格：当前是否已经展开
    get isExpand(): boolean {return this.mark.getMark(this.key, TableMarkAttr.expand)}
    // 树形表格：当前是否选中
    get isCheck(): boolean {return this.mark.getMark(this.key, TableMarkAttr.check)}
    // 树形表格：当前是否正在加载子节点数据
    get isLoading(): boolean {return this.mark.getMark(this.key, TableMarkAttr.loading)}
    // 树形表格：当前子节点数据是否已经加载完毕
    get isLoaded(): boolean {return this.mark.getMark(this.key, TableMarkAttr.loaded)}
    // 树形表格：当前行是否可选中
    get isCheckable(): boolean {return !this.props.isCheckable || this.props.isCheckable(this)}
    // 树形表格：当前行是否为叶子节点
    get isLeaf(): boolean {return !!this.props.isLeaf ? this.props.isLeaf(this) : (!this.children || this.children.length === 0)}
    // 树形表格：当前行是否可见
    get isVisible(): boolean {
        const {filterNodeMethod} = this.props
        if (!filterNodeMethod) {
            return true
        }
        let visible = filterNodeMethod(this)
        if (visible) {
            return true
        } else {
            return (this.children || []).some(child => child.isVisible)
        }
    }
    // 树形表格：当前选中状态：选中、未选中、半选中
    get checkStatus(): TableCheckStatus {

        if (this.isLeaf || this.props.checkStrictly) {
            // 叶子节点或者父子互不关联情况下，节点只有选中以及非选中的状态，不会处于半选中状态
            return this.isCheck ? TableCheckStatus.check : TableCheckStatus.uncheck
        } else {
            // 当前已经选中，则处于选中状态
            if (this.isCheck) return TableCheckStatus.check

            // 当前未选中，判断子节点是否全部都是未选中状态，是则自身为未选中状态，否则为半选中状态
            if ((this.children || []).every(child => child.checkStatus === 'uncheck')) {
                return TableCheckStatus.uncheck
            } else {
                return TableCheckStatus.minus
            }
        }
    }
    // 树形表格：拖拽指示器的左偏移距离
    get indicatorLeft() {
        let left = 60 * (this.level - 1)
        if (this.isLeaf && !this.isLoading) {
            left += 18
        }
        return left
    }

    // 当前是否处于行编辑状态
    get isEdit(): boolean {return this.mark.getMark(this.key, TableMarkAttr.edit)}
    // 当前行编辑数据对象
    get editRow(): object {return this.mark.getEditRow(this.key)}
    set editRow(val: object) {this.mark.setEditRow(this.key, val)}
    // 当前行的校验结果
    get validateResult() {return this.mark.getValidateResult(this.key)}
    set validateResult(val: ValidateResultMap) {this.mark.setValidateResult(this.key, val)}
    /*@formatter:on*/

    /*---------------------------------------methods-------------------------------------------*/

    /**
     * 选中/取消选中 当前节点
     * @author  韦胜健
     * @date    2020/4/1 22:37
     */
    check(val: boolean) {
        if (!this.isCheckable) return
        this.mark.setMark(this.key, TableMarkAttr.check, val)
    }

    /**
     * 展开/收起当前节点
     * @author  韦胜健
     * @date    2020/5/12 9:47
     */
    expand(val: boolean) {
        if (this.isLeaf) return
        this.mark.setMark(this.key, TableMarkAttr.expand, val)
    }

    /**
     * 设置子节点数据
     * @author  韦胜健
     * @date    2020/4/3 0:09
     */
    setChildren(children: object[]) {
        set(this.data, this.props.childrenField, children)
    }

    /**
     * 获取子节点数据
     * @author  韦胜健
     * @date    2020/8/6 20:54
     */
    getReactiveChildrenData(): object[] {
        let childrenData = this.childrenData
        if (!childrenData) {
            childrenData = []
            this.setChildren(childrenData)
        }
        return childrenData
    }

    /**
     * 在当前节点的父节点子数据中，移除当前节点数据
     * @author  韦胜健
     * @date    2020/8/6 20:55
     */
    removeSelf() {
        const parentChildrenData = this.parent!.childrenData
        parentChildrenData.splice(parentChildrenData.indexOf(this.data), 1)
    }

    /**
     * 将节点移动至当前节点的前置节点
     * @author  韦胜健
     * @date    2020/8/6 20:55
     */
    previousSibling(treeNode: TableNode) {
        let parentChildrenData = this.parent!.getReactiveChildrenData()
        treeNode.parent = this.parent
        treeNode.level = this.level
        parentChildrenData.splice(parentChildrenData.indexOf(this.data), 0, treeNode.data)
    }

    /**
     * 移动节点至当前节点的后置节点
     * @author  韦胜健
     * @date    2020/8/6 20:56
     */
    nextSibling(treeNode: TableNode) {
        let parentChildrenData = this.parent!.getReactiveChildrenData()
        treeNode.parent = this.parent
        treeNode.level = this.level
        parentChildrenData.splice(parentChildrenData.indexOf(this.data) + 1, 0, treeNode.data)
    }

    /**
     * 添加节点为当前节点的子节点中
     * @author  韦胜健
     * @date    2020/8/6 20:56
     */
    unshiftChild(treeNode: TableNode) {
        let childrenData = this.getReactiveChildrenData()
        treeNode.parent = this
        treeNode.level = this.level + 1
        childrenData.unshift(treeNode.data)
    }

    /*---------------------------------------table edit-------------------------------------------*/

    /**
     * 开启编辑状态
     * @author  韦胜健
     * @date    2020/8/6 20:56
     */
    openEdit() {this.mark.setMark(this.key, TableMarkAttr.edit, true)}

    /**
     * 关闭编辑状态
     * @author  韦胜健
     * @date    2020/8/6 20:56
     */
    closeEdit() {this.mark.setMark(this.key, TableMarkAttr.edit, false)}

    /**
     * 开启编辑，当前行的editRow对象将被重置为行数据的一份拷贝
     * 并且重新校验
     * @author  韦胜健
     * @date    2020/8/6 20:57
     */
    enableEdit() {
        if (this.isEdit) {return}
        this.editRow = $plain.utils.deepcopy(this.data)
        this.openEdit()
        this.validate()
    }

    /**
     * 取消编辑
     * @author  韦胜健
     * @date    2020/8/6 20:57
     */
    cancelEdit() {
        if (!this.isEdit) {
            return
        }
        // this.editRow = $plain.utils.deepcopy(this.data)
        this.closeEdit()
    }

    /**
     * 校验当前编辑行数据
     * @author  韦胜健
     * @date    2020/8/7 22:05
     */
    async validate() {
        if (!this.validateResult) {
            this.validateResult = {}
        }
        let {editRow, validateResult, mark: {getRules}} = this
        const {allRules} = getRules()
        const validate = await validateAsync({
            validateResult,
            rules: allRules,
            formData: editRow,
        })
        return !!validate ? {
            ...validate,
            rowData: this
        } : null
    }

    /**
     * 保存编辑，当前行的row数据对象将被重置为editRow的一份拷贝
     * @author  韦胜健
     * @date    2020/8/6 20:58
     */
    async saveEdit() {
        if (!this.isEdit) {
            return
        }
        const {data, editRow} = this
        Object.keys({...data, ...editRow}).forEach(key => set(this.data, key, editRow[key] || null))
    }
}