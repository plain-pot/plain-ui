import {VNodeChild} from "../../../shims";
import {TreeNodeCheckStatus} from "../utils/tree-constant";

export interface TreeNode {
    data: any,
    childrenData?: any[]

    level: number,
    key: string,
    label?: string,
    children?: TreeNode[],
    parentRef: () => TreeNode | null,
    checkStatus: TreeNodeCheckStatus,

    isExpand: boolean,
    isCheck: boolean,
    isLoading: boolean,
    isLoaded: boolean,

    isCheckable: boolean,
    isLeaf: boolean,
    isVisible: boolean,
}

export interface TreeEmptyNode {
    (): TreeNode
}

export namespace TreePropsType {

    export interface renderContent {(data: { node: TreeNode, index: number }): VNodeChild}

    export interface nodeIcon {(node: TreeNode): string}

    export interface filterNodeMethod {(node: TreeNode): boolean}

    export interface isLeaf {(node: TreeNode): boolean}

    export interface isCheckable {(node: TreeNode): boolean}

    export interface getChildren {(node: TreeNode, cb: (...args: any[]) => void): void}

    export interface allDrag {(node: TreeNode): boolean}

    export interface allDrop {(node: TreeNode): boolean}

}