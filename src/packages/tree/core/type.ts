import {VNodeChild} from "../../../shims";
import {TreeDropType, TreeNodeCheckStatus} from "../utils/tree-constant";

export interface TreeNode {
    data: any,
    level: number,
    key: string,
    parentRef: () => TreeNode | null,
    selfRef: () => TreeNode,

    readonly childrenData?: any[]
    readonly label?: string,
    readonly children?: TreeNode[],
    readonly checkStatus: TreeNodeCheckStatus,

    expand: boolean,
    check: boolean,
    loading: boolean,
    loaded: boolean,

    readonly isCheckable: boolean,
    readonly isLeaf: boolean,
    readonly isVisible: boolean,
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

    export interface allowDrag {(node: TreeNode): boolean}

    export interface allowDrop {(startNode: TreeNode, moveNode: TreeNode, dropType: TreeDropType): boolean}

}