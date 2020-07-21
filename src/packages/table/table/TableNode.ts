import {TableCheckStatus, TablePropsType} from "@/packages/table/table-utils";
import {TableMark, TableMarkAttr} from "@/packages/table/table/TableMark";
import {set} from "@vue/composition-api";
import {$plain} from "@/packages/base";
import {ValidateResultMap} from "@/packages/form/validate";

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
    ) {}

    index!: number

    get childrenData() {return !!this.props.childrenField && !!this.data ? this.data[this.props.childrenField] : undefined}

    get children() {return !this.childrenData ? undefined : this.childrenData.map(child => this.mark.getNode(child, this.props, this.level + 1, this, this.isSummaryData))}

    /*---------------------------------------mark attrs-------------------------------------------*/

    get isExpand(): boolean {return this.mark.getMark(this.key, TableMarkAttr.expand)}

    get isCheck(): boolean {return this.mark.getMark(this.key, TableMarkAttr.check)}

    get isLoading(): boolean {return this.mark.getMark(this.key, TableMarkAttr.loading)}

    get isLoaded(): boolean {return this.mark.getMark(this.key, TableMarkAttr.loaded)}

    get isEdit(): boolean {return this.mark.getMark(this.key, TableMarkAttr.edit)}

    get editRow(): object {return this.mark.getEditRow(this.key)}

    set editRow(val: object) {this.mark.setEditRow(this.key, val)}

    get validateResult() {return this.mark.getValidateResult(this.key)}

    set validateResult(val: ValidateResultMap) {this.mark.setValidateResult(this.key, val)}

    /*---------------------------------------judge props-------------------------------------------*/

    get isCheckable(): boolean {return !this.props.isCheckable || this.props.isCheckable(this)}

    get isLeaf(): boolean {return !!this.props.isLeaf ? this.props.isLeaf(this) : (!!this.children && this.children.length > 0)}

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

    /*当前选中状态：选中、未选中、半选中*/
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

    /**
     * 拖拽指示器的左偏移距离
     * @author  韦胜健
     * @date    2020/4/3 0:09
     */
    get indicatorLeft() {
        let left = this.props.intent * (this.level - 1)
        if (this.isLeaf && !this.isLoading) {
            left += 18
        }
        return left
    }

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

    getReactiveChildrenData(): object[] {
        let childrenData = this.childrenData
        if (!childrenData) {
            childrenData = []
            this.setChildren(childrenData)
        }
        return childrenData
    }

    removeSelf() {
        const parentChildrenData = this.parent!.childrenData
        parentChildrenData.splice(parentChildrenData.indexOf(this.data), 1)
    }

    previousSibling(treeNode: TableNode) {
        let parentChildrenData = this.parent!.getReactiveChildrenData()
        treeNode.parent = this.parent
        treeNode.level = this.level
        parentChildrenData.splice(parentChildrenData.indexOf(this.data), 0, treeNode.data)
    }

    nextSibling(treeNode: TableNode) {
        let parentChildrenData = this.parent!.getReactiveChildrenData()
        treeNode.parent = this.parent
        treeNode.level = this.level
        parentChildrenData.splice(parentChildrenData.indexOf(this.data) + 1, 0, treeNode.data)
    }

    unshiftChild(treeNode: TableNode) {
        let childrenData = this.getReactiveChildrenData()
        treeNode.parent = this
        treeNode.level = this.level + 1
        childrenData.unshift(treeNode.data)
    }

    /*---------------------------------------table edit-------------------------------------------*/
    openEdit() {this.mark.setMark(this.key, TableMarkAttr.edit, true)}

    closeEdit() {this.mark.setMark(this.key, TableMarkAttr.edit, false)}

    enableEdit() {
        if (this.isEdit) {return}
        this.editRow = $plain.utils.deepcopy(this.data)
        this.openEdit()
    }

    cancelEdit() {
        if (!this.isEdit) {
            return
        }
        // this.editRow = $plain.utils.deepcopy(this.data)
        this.closeEdit()
    }

    saveEdit() {
        if (!this.isEdit) {
            return
        }
        const {data, editRow} = this
        Object.keys({...data, ...editRow}).forEach(key => set(this.data, key, editRow[key] || null))
    }
}