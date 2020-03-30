export class TreeNode {
    key: string;
    label: string;
    children: TreeNode[];
    data: object

    /*expanded: boolean;              // 是否已经展开
    checked: boolean;               // 是否已经勾选
    checkable: boolean;             // 是否可勾选
    left: boolean;                  // 是否为叶子节点
    draggable: boolean;             // 是否可拖拽
    droppable: boolean;             // 是否可放置*/

    constructor(data: object, {keyField, labelField, childrenField}) {
        this.key = !!keyField ? data[keyField] : undefined
        this.label = !!labelField ? data[labelField] : undefined
        this.children = !!childrenField ? data[childrenField] : undefined
        this.data = data
    }
}