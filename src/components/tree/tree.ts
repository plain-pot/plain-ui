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
        return this.context.expandMap[this.key] === true
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
        this.context.$set(this, 'children', children)
    }
}