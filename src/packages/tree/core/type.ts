import {VNodeChild} from "../../../shims";
import {TreeNodeCheckStatus} from "../utils/tree-constant";

export interface TreeNode {
    readonly data: any,
    readonly childrenData?: any[]

    readonly level: number,
    readonly key: string,
    readonly label?: string,
    readonly children?: TreeNode[],
    readonly parentRef: () => TreeNode | null,
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

    export interface allDrag {(node: TreeNode): boolean}

    export interface allDrop {(node: TreeNode): boolean}

}