import {TreeConfig, TreeMark} from "./TreeMark";
import {TreeNodeCheckStatus} from "./tree-constant";

export class TreeNode {

    constructor(
        public key: string,
        public data: Record<string, any>,
        public level: number,
        public config: () => TreeConfig,
        public parentRef: () => (TreeNode),
        public markRef: () => TreeMark,
    ) {}

    selfGetter = () => this;

    /*---------------------------------------format prop-------------------------------------------*/

    get label(): string {return (!!this.config().labelField && !!this.data) ? this.data[this.config().labelField!] : undefined}

    get childrenData(): object[] {return (!!this.config().childrenField && !!this.data) ? this.data[this.config().childrenField] : undefined}

    get children(): TreeNode[] | null {
        if (this.isLeaf) {
            return null
        }
        if (!this.childrenData) {return []}
        return this.childrenData.map(child => this.markRef().node.get(child, this.level + 1, this.selfGetter))
    }

    /*---------------------------------------mark props-------------------------------------------*/

    get isExpand(): boolean {return this.markRef().expand.get(this.key)}

    get isCheck(): boolean {return this.markRef().check.get(this.key)}

    get isLoading(): boolean {return this.markRef().loading.get(this.key)}

    get isLoaded(): boolean {return this.markRef().loaded.get(this.key)}

    /*---------------------------------------judge props-------------------------------------------*/

    get isCheckable(): boolean {return !this.config().isCheckable || this.config().isCheckable!(this)}

    get isLeaf(): boolean {
        const {isLeaf} = this.config()
        if (!!isLeaf) {
            return isLeaf(this)
        } else {
            /*只有有子节点数据对象就判定为不是叶子节点，即使子节点数组为空数组*/
            return !this.childrenData
        }
    }

    get isVisible(): boolean {
        const {filterNodeMethod} = this.config()
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

        if (this.isLeaf || this.config().checkStrictly) {
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
        let left = this.config().intent * (this.level - 1)
        if (this.isLeaf && !this.isLoading) {
            left += 18
        }
        return left
    }

    /*---------------------------------------methods-------------------------------------------*/

    loading(val: boolean) {
        this.markRef().loading.set(this.key, val)
    }

    loaded(val: boolean) {
        this.markRef().loaded.set(this.key, val)
    }

    /**
     * 选中/取消选中 当前节点
     * @author  韦胜健
     * @date    2020/4/1 22:37
     */
    check(val: boolean) {
        if (!this.isCheckable) return
        this.markRef().check.set(this.key, val)
    }

    /**
     * 展开/收起当前节点
     * @author  韦胜健
     * @date    2020/5/12 9:47
     */
    expand(val: boolean) {
        if (this.isLeaf) return
        this.markRef().expand.set(this.key, val)
    }

    /**
     * 设置子节点数据
     * @author  韦胜健
     * @date    2020/4/3 0:09
     */
    setChildren(children: object[]) {
        // set(this.data, this.config().childrenField, children)
        this.data[this.config().childrenField] = children
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
        const parentChildrenData = this.parentRef().childrenData
        parentChildrenData.splice(parentChildrenData.indexOf(this.data), 1)
    }

    previousSibling(treeNode: TreeNode) {
        let parentChildrenData = this.parentRef().getReactiveChildrenData()
        treeNode.parentRef = this.parentRef
        treeNode.level = this.level
        parentChildrenData.splice(parentChildrenData.indexOf(this.data), 0, treeNode.data)
    }

    nextSibling(treeNode: TreeNode) {
        let parentChildrenData = this.parentRef().getReactiveChildrenData()
        treeNode.parentRef = this.parentRef
        treeNode.level = this.level
        parentChildrenData.splice(parentChildrenData.indexOf(this.data) + 1, 0, treeNode.data)
    }

    unshiftChild(treeNode: TreeNode) {
        let childrenData = this.getReactiveChildrenData()
        treeNode.parentRef = () => this
        treeNode.level = this.level + 1
        childrenData.unshift(treeNode.data)
    }
}