import {TreeContextType, TreeMarkAttr, TreeNodeCheckStatus} from "@/packages/tree/utils/tree-constant";
import {TreeMark} from "@/packages/tree/utils/TreeMark";

export class TreeNode {

    constructor(
        public data: object,
        public context: TreeContextType,
        public level: number,
        public parent: TreeNode,
        public treeMark: TreeMark,
    ) {}

    /*---------------------------------------format prop-------------------------------------------*/

    get key(): string {return (!!this.context.keyField && !!this.data) ? this.data[this.context.keyField] : undefined}

    get label(): string {return (!!this.context.labelField && !!this.data) ? this.data[this.context.labelField] : undefined}

    get childrenData(): object[] {return (!!this.context.childrenField && !!this.data) ? this.data[this.context.childrenField] : undefined}

    get children(): TreeNode[] | null {
        if (!this.childrenData) {return null}
        return this.childrenData.map(child => this.treeMark.getTreeNode(child, this.context, this.level + 1, this))
    }

    /*---------------------------------------mark props-------------------------------------------*/

    get isExpand(): boolean {return this.treeMark.getMark(this.key, TreeMarkAttr.expand)}

    get isCheck(): boolean {return this.treeMark.getMark(this.key, TreeMarkAttr.check)}

    get isLoading(): boolean {return this.treeMark.getMark(this.key, TreeMarkAttr.loading)}

    get isLoaded(): boolean {return this.treeMark.getMark(this.key, TreeMarkAttr.loaded)}

    /*---------------------------------------judge props-------------------------------------------*/

    get isCheckable(): boolean {return !this.context.isCheckable || this.context.isCheckable(this)}

    get isLeaf(): boolean {
        const {isLeaf} = this.context
        if (!!isLeaf) {
            return isLeaf(this)
        } else {
            return !this.childrenData || this.childrenData.length === 0
        }
    }

    get isVisible(): boolean {
        const {filterNodeMethod} = this.context
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

    /*---------------------------------------other-------------------------------------------*/

    /*当前选中状态：选中、未选中、半选中*/
    get checkStatus(): TreeNodeCheckStatus {

        if (this.isLeaf || this.context.checkStrictly) {
            // 叶子节点或者父子互不关联情况下，节点只有选中以及非选中的状态，不会处于半选中状态
            return this.isCheck ? TreeNodeCheckStatus.check : TreeNodeCheckStatus.uncheck
        } else {
            // 当前已经选中，则处于选中状态
            if (this.isCheck) return TreeNodeCheckStatus.check

            // 当前未选中，判断子节点是否全部都是未选中状态，是则自身为未选中状态，否则为半选中状态
            if ((this.children || []).every(child => child.checkStatus === 'uncheck')) {
                return TreeNodeCheckStatus.uncheck
            } else {
                return TreeNodeCheckStatus.minus
            }
        }
    }

    /**
     * 拖拽指示器的左偏移距离
     * @author  韦胜健
     * @date    2020/4/3 0:09
     */
    get indicatorLeft() {
        let left = this.context.intent * (this.level - 1)
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
        this.treeMark.setMark(this.key, TreeMarkAttr.check, val)
    }

    /**
     * 展开/收起当前节点
     * @author  韦胜健
     * @date    2020/5/12 9:47
     */
    expand(val: boolean) {
        if (this.isLeaf) return
        this.treeMark.setMark(this.key, TreeMarkAttr.expand, val)
    }

    /**
     * 设置子节点数据
     * @author  韦胜健
     * @date    2020/4/3 0:09
     */
    setChildren(children: object[]) {
        this.context.$set(this.data, this.context.childrenField, children)
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
        const parentChildrenData = this.parent.childrenData
        parentChildrenData.splice(parentChildrenData.indexOf(this.data), 1)
    }

    previousSibling(treeNode: TreeNode) {
        let parentChildrenData = this.parent.getReactiveChildrenData()
        treeNode.parent = this.parent
        treeNode.level = this.level
        parentChildrenData.splice(parentChildrenData.indexOf(this.data), 0, treeNode.data)
    }

    nextSibling(treeNode: TreeNode) {
        let parentChildrenData = this.parent.getReactiveChildrenData()
        treeNode.parent = this.parent
        treeNode.level = this.level
        parentChildrenData.splice(parentChildrenData.indexOf(this.data) + 1, 0, treeNode.data)
    }

    unshiftChild(treeNode: TreeNode) {
        let childrenData = this.getReactiveChildrenData()
        treeNode.parent = this
        treeNode.level = this.level + 1
        childrenData.unshift(treeNode.data)
    }
}