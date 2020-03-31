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
        const {keyField, labelField, childrenField} = context
        this.key = !!keyField ? data[keyField] : undefined
        this.label = !!labelField ? data[labelField] : undefined
        this.children = !!childrenField ? data[childrenField] : undefined
    }

    get isExpand(): boolean {
        return this.context.getMark(this.key, TreeMark.expanded) === true
    }

    get isCheck(): boolean {
        return this.context.getMark(this.key, TreeMark.checked) === true
    }

    get checkStatus(): CheckStatus {

        if (this.isLeaf) {
            return this.isCheck ? 'check' : 'uncheck'
        } else {
            if (this.isCheck) return 'check'

            if ((this.children || []).every(child => child.checkStatus === 'uncheck')) {
                return 'uncheck'
            } else {
                return 'minus'
            }
        }
    }

    get isLeaf(): boolean {
        const {lazy, isLeaf} = this.context
        if (!!lazy && !!isLeaf) {
            return isLeaf(this)
        } else {
            return !this.children || this.children.length === 0
        }
    }

    setChildren(children: TreeNode[]) {
        this.context.$set(this.data, this.context.childrenField, children)
    }
}

export class TreeMark {
    expanded: boolean = null                            // 当前是否已经展开
    checked: boolean = null                             // 当前是否已经选中
    loading: boolean = null                             // 当前是否处于加载状态
    treeNode: TreeNode = null                           // key对应的treeNode对象
    loaded: boolean = null                              // 当lazy模式下，当前节点是否已经加载过子节点

    static expanded = 'expanded'
    static checked = 'checked'
    static loading = 'loading'
    static treeNode = 'treeNode'
    static loaded = 'loaded'

    constructor(public key: string) {
    }
}