type CheckStatus = 'check' | 'uncheck' | 'minus'

export class TreeNode {
    key: string;
    label: string;
    children: TreeNode[];

    /*expanded: boolean;              // 是否已经展开
    checked: boolean;               // 是否已经勾选
    checkable: boolean;             // 是否可勾选
    left: boolean;                  // 是否为叶子节点
    draggable: boolean;             // 是否可拖拽
    droppable: boolean;             // 是否可放置*/

    constructor(public data: object, public context: any, public level: number, public parent?: TreeNode | null) {
        const {keyField, labelField} = context
        this.key = !!keyField ? data[keyField] : undefined
        this.label = !!labelField ? data[labelField] : undefined
    }

    /*当前是否展开*/
    get isExpand(): boolean {
        return this.context.getMark(this.key, TreeMark.expanded) === true
    }

    /*当前是否已经选中*/
    get isCheck(): boolean {
        return this.context.getMark(this.key, TreeMark.checked) === true
    }

    /*当前是否可以被选中*/
    get isCheckable(): boolean {
        const {isCheckable} = this.context
        return !isCheckable || (isCheckable(this))
    }

    /*当前选中状态：选中、未选中、半选中*/
    get checkStatus(): CheckStatus {

        if (this.isLeaf || this.context.checkStrictly) {
            // 叶子节点或者父子互不关联情况下，节点只有选中以及非选中的状态，不会处于半选中状态
            return this.isCheck ? 'check' : 'uncheck'
        } else {
            // 当前已经选中，则处于选中状态
            if (this.isCheck) return 'check'

            // 当前未选中，判断子节点是否全部都是未选中状态，是则自身为未选中状态，否则为半选中状态
            if ((this.children || []).every(child => child.checkStatus === 'uncheck')) {
                return 'uncheck'
            } else {
                return 'minus'
            }
        }
    }

    /*是否为叶子节点*/
    get isLeaf(): boolean {
        const {isLeaf} = this.context
        if (!!isLeaf) {
            return isLeaf(this)
        } else {
            return !this.children || this.children.length === 0
        }
    }

    /*节点是否可见*/
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

    /*当前是否处于加载状态*/
    get isLoading(): boolean {
        return this.context.getMark(this.key, TreeMark.loading)
    }

    /*当前节点的子节点的数据*/
    get childrenData() {
        return this.data[this.context.childrenField]
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
        this.context.setMark(this.key, TreeMark.checked, val)
    }

    /**
     * 设置子节点数据
     * @author  韦胜健
     * @date    2020/4/3 0:09
     */
    setChildren(children: TreeNode[]) {
        this.context.$set(this.data, this.context.childrenField, children)
    }

    /*将当前节点从当前节点的父节点移除*/
    removeSelf() {
        const parentChildrenData = this.parent.childrenData
        parentChildrenData.splice(parentChildrenData.indexOf(this.data), 1)
    }

    /*在当前节点所有的数组中插入一个节点*/
    splice(index, count, replace) {
        let parentChildrenData = this.parent.childrenData

        if (!parentChildrenData) {
            parentChildrenData = []
            this.parent.setChildren(parentChildrenData)
        }
        return parentChildrenData.splice(index, count, replace)
    }

    /*在当前节点所在的数组中添加一个节点*/
    push(data) {
        let childrenData = this.childrenData
        if (!childrenData) {
            childrenData = []
            this.setChildren(childrenData)
        }
        childrenData.push(data)
    }
}

export class TreeMark {
    expanded: boolean = null                            // 当前是否已经展开
    checked: boolean = null                             // 当前是否已经选中
    loading: boolean = null                             // 当前是否处于加载状态
    treeNode: TreeNode = null                           // key对应的treeNode对象
    loaded: boolean = null                              // 当lazy模式下，当前节点是否已经加载过子节点

    formatCount = null                                  // 数据格式化的次数

    static expanded = 'expanded'
    static checked = 'checked'
    static loading = 'loading'
    static treeNode = 'treeNode'
    static loaded = 'loaded'
    static formatCount = 'formatCount'

    constructor(public key: string) {
    }
}

export class TreeProp {
    [key: string]: boolean
}

export const enum TreeAttr {
    expand = 'expand',
    check = 'check',
    loading = 'loading',
    loaded = 'loaded',
}

export class TreeValue {
    expandMap: TreeProp = {}
    checkMap: TreeProp = {}
    loadingMap: TreeProp = {}
    loadedMap: TreeProp = {}

    keyField: string
    $set: Function

    constructor(public context: any) {
        this.keyField = context.keyField
        this.$set = context.$set
    }

    getMark(row: object, attr: TreeAttr): boolean {
        const attrName = `${attr}Map`
        if (!attrName) {
            console.error(`pl-tree: no attr:${attr}`)
            return
        }
        return this[attrName][this.getKey(row)]
    }

    setMark(row: object, attr: TreeAttr, value: boolean) {
        const attrName = `${attr}Map`
        if (!attrName) {
            console.error(`pl-tree: no attr:${attr}`)
            return
        }
        this.$set(this[attrName], this.getKey(row), value)
    }

    getKey(row) {
        return row[this.keyField]
    }

    static expand = TreeAttr.expand
    static check = TreeAttr.check
    static loading = TreeAttr.loading
    static loaded = TreeAttr.loaded
}