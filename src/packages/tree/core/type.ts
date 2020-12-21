import {SimpleObject, VNodeChild} from "../../../shims";
import {TreeDropType, TreeNodeCheckStatus} from "../utils/tree-constant";

export type CreateNodeType<T, V = {}> = {
    key: string,
    data: SimpleObject,
    level: number,
    parentRef: () => CreateNodeType<T> | null,
    selfRef: () => CreateNodeType<T>,

    index: number,
    empty: boolean,

    readonly childrenData?: SimpleObject[]
    readonly label?: string,
    children?: CreateNodeType<T>[],
    readonly checkStatus: TreeNodeCheckStatus,

    expand: boolean,
    check: boolean,
    loading: boolean,
    loaded: boolean,

    readonly isCheckable: boolean,
    readonly isLeaf: boolean,
    readonly isVisible: boolean,

    removeSelf: () => void,
    previousSibling: (node: CreateNodeType<T>) => void,
    nextSibling: (node: CreateNodeType<T>) => void,
    unshiftChild: (node: CreateNodeType<T>) => void,
    getReactiveChildrenData: () => SimpleObject[],
} & V;

export type TreeNode = CreateNodeType<any>

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