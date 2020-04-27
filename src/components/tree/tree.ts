export const enum TreeMarkAttr {
    expand = 'expand',
    check = 'check',
    loading = 'loading',
    loaded = 'loaded',
}

export const enum TreeNodeCheckStatus {
    check = 'check',
    uncheck = 'uncheck',
    minus = 'minus',
}

export class TreeMark {
    expandMap: { [key: string]: boolean } = {}
    checkMap: { [key: string]: boolean } = {}
    loadingMap: { [key: string]: boolean } = {}
    loadedMap: { [key: string]: boolean } = {}

    keyField: string
    $set: Function

    constructor(public context: any) {
        this.keyField = context.keyField
        this.$set = context.$set
    }

    getMark(key: string, attr: TreeMarkAttr): boolean {
        const attrName = `${attr}Map`
        if (!attrName) {
            console.error(`pl-tree: no attr:${attr}`)
            return
        }
        return this[attrName][key]
    }

    setMark(key: string, attr: TreeMarkAttr, value: boolean) {
        const attrName = `${attr}Map`
        if (!attrName) {
            console.error(`pl-tree: no attr:${attr}`)
            return
        }
        this.$set(this[attrName], key, value)
    }

    getActiveKeys(attr: TreeMarkAttr): string[] {
        const attrName = `${attr}Map`
        if (!attrName) {
            console.error(`pl-tree: no attr:${attr}`)
            return
        }
        const keys = []
        for (let key in this[attrName]) {
            if (this[attrName].hasOwnProperty(key) && !!this[attrName][key]) {
                keys.push(key)
            }
        }
        return keys
    }

    static expand = TreeMarkAttr.expand
    static check = TreeMarkAttr.check
    static loading = TreeMarkAttr.loading
    static loaded = TreeMarkAttr.loaded
}

export class TreeNode {

    constructor(
        public row: object,
        public context: {
            keyField: string,
            labelField: string,
            childrenField: string,
            allowCheck: Function,
            isLeaf: Function,
            checkStrictly: boolean
            filterNodeMethod: Function,
            intent: number,
            $set: (obj: object, key: string, value: any) => void
        },
        public level: number,
        public parent: TreeNode,
        public treeMark: TreeMark,
    ) {
    }

    /*---------------------------------------mark props-------------------------------------------*/

    get isExpand(): boolean {return this.treeMark.getMark(this.key, TreeMarkAttr.expand)}

    get isCheck(): boolean {return this.treeMark.getMark(this.key, TreeMarkAttr.check)}

    get isLoading(): boolean {return this.treeMark.getMark(this.key, TreeMarkAttr.loading)}

    get isLoaded(): boolean {return this.treeMark.getMark(this.key, TreeMarkAttr.loaded)}

    /*---------------------------------------format prop-------------------------------------------*/

    get key(): string {return !!this.context.keyField ? this.row[this.context.keyField] : undefined}

    get label(): string {return !!this.context.labelField ? this.row[this.context.labelField] : undefined}

    get childrenData(): object[] {return !this.context.childrenField ? null : this.row[this.context.childrenField]}

    get children(): TreeNode[] {
        if (!this.childrenData) {return null}
        return this.childrenData.map(child => new TreeNode(
            child,
            this.context,
            this.level + 1,
            this,
            this.treeMark,
        ))
    }

    /*---------------------------------------judge props-------------------------------------------*/

    get isCheckable(): boolean {return !this.context.allowCheck || this.context.allowCheck(this.row)}

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
     * 设置子节点数据
     * @author  韦胜健
     * @date    2020/4/3 0:09
     */
    setChildren(children: object[]) {
        this.context.$set(this.row, this.context.childrenField, children)
    }

    /*将当前节点从当前节点的父节点移除*/
    removeSelf() {
        const parentChildrenData = this.parent.childrenData
        parentChildrenData.splice(parentChildrenData.indexOf(this.row), 1)
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