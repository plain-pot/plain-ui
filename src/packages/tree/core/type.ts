import {VNodeChild} from "../../../shims";

export interface TreeNode {
    data: any,
    childrenData?: any[]

    level: number,
    key: string,
    label?: string,
    children?: TreeNode[],
    parentRef : () => TreeNode,

    isExpand: boolean,
    isCheck: boolean,
    isLoading: boolean,
    isLoaded: boolean,

    isCheckable: boolean,
    isLeaf: boolean,
    isVisible: boolean,
}


export interface TreePropsType {
    renderContent?: (data: { node: TreeNode, index: number }) => VNodeChild,
    nodeIcon?: (node: TreeNode) => string,
    filterNodeMethod?: (node: TreeNode) => boolean,
    isLeaf?: (node: TreeNode) => boolean,
    isCheckable?: (node: TreeNode) => boolean,
    getChildren?: (node: TreeNode, cb: (...args: any[]) => void) => void,
    allDrag?: (node: TreeNode) => boolean,
    allDrop?: (node: TreeNode) => boolean,
}