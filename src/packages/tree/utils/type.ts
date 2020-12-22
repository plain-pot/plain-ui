import {SimpleObject, VNodeChild} from "../../../shims";
import {TreeDropType, TreeNodeCheckStatus} from "./tree-constant";

export type TreeNode = {
    key: string,
    data: SimpleObject,
    level: number,
    parentRef: () => TreeNode | null,
    selfRef: () => TreeNode,

    index: number,
    empty: boolean,

    readonly childrenData?: SimpleObject[]
    readonly label?: string,
    children?: TreeNode[],
    readonly checkStatus: TreeNodeCheckStatus,

    expand: boolean,
    check: boolean,
    loading: boolean,
    loaded: boolean,

    readonly isCheckable: boolean,
    readonly isLeaf: boolean,
    readonly isVisible: boolean,
}

export namespace TreePropsType {
    export interface renderContent {(data: { node: TreeNode, index: number }): VNodeChild}

    export interface nodeIcon {(node: TreeNode): string}

    export interface allowDrag {(node: TreeNode): boolean}

    export interface allowDrop {(startNode: TreeNode, moveNode: TreeNode, dropType: TreeDropType): boolean}
}