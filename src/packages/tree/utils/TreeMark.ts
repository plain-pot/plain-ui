import {TreeNode} from "./TreeNode";
import {reactive} from "vue";
import {createKeyHandler} from "../../../utils/createKeyHandler";
import {createFlagManager} from "../../../utils/createFlagManager";

const generator = createKeyHandler('tree_node')

export interface TreeConfig {
    keyField?: string,
    labelField?: string,
    childrenField: string,
    isCheckable?: (node: TreeNode) => boolean,
    isLeaf?: (node: TreeNode) => boolean,
    checkStrictly: boolean,
    filterNodeMethod?: (node: TreeNode) => boolean,
    intent: number,
}

export class TreeMark {

    constructor(
        public config: () => TreeConfig,
    ) {}

    selfGetter = () => this;

    node = {
        state: reactive({
            map: {} as { [k: string]: TreeNode }
        }),
        get: (
            data: any,
            level: number,
            parentRef: () => (TreeNode),
        ): TreeNode => {
            const key = generator(data, this.config().keyField)
            let node: TreeNode = this.node.state.map[key]
            if (!!node) {
                node.data = data
                node.level = level
                node.parentRef = parentRef
            } else {
                node = new TreeNode(
                    key,
                    data,
                    level,
                    this.config,
                    parentRef,
                    this.selfGetter,
                )
                this.node.state.map[key] = node
            }
            return node
        },
        getList: (list: any[] | undefined, level: number, parentRef: () => (TreeNode)): TreeNode[] => {
            if (!list) return []
            return list.map(item => this.node.get(item, level, parentRef))
        },
        getByKey(key: string) {
            return this.state.map[key]
        },
    }

    expand = createFlagManager()
    check = createFlagManager()
    loading = createFlagManager()
    loaded = createFlagManager()
}