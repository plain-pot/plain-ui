import {CascadeNode} from "./CascadeNode";
import {reactive} from "vue";
import {createKeyHandler} from "../../../utils/createKeyHandler";
import {createFlagManager} from "../../../utils/createFlagManager";

const generator = createKeyHandler('cascade_node')

export interface CascadeConfig {
    nodeDisabled?: (node: CascadeNode) => boolean,
    isLeaf?: (node: CascadeNode) => boolean,
    lazy?: boolean,
    getChildren?: (node: CascadeNode, cb: (...args: any[]) => void) => void,
    filterMethod?: (filterData: CascadeNode[], filterText: string) => boolean

    labelField: string,
    keyField: string,
    childrenField: string,
}

export class CascadeMark {

    constructor(public config: () => CascadeConfig, public ctxState: () => {
        expandKeys: string[],
        filterText: string | undefined,
    }) {}

    selfGetter = () => this;

    node = {
        state: reactive({
            map: {} as { [k: string]: CascadeNode }
        }),
        get: (
            data: any,
            level: number,
            parentRef: () => (CascadeNode | null),
        ): CascadeNode => {
            const key = generator(data, this.config().keyField)
            let node: CascadeNode = this.node.state.map[key]
            if (!!node) {
                if (node.data != data) {
                    node.data = data
                }
                node.level = level
                node.parentRef = parentRef
            } else {
                node = new CascadeNode(
                    key,
                    data,
                    level,
                    this.config,
                    parentRef,
                    this.selfGetter,
                    this.ctxState,
                )
                this.node.state.map[key] = node
            }
            return node
        },
        getList: (list: any[] | undefined, level: number, parentRef: () => (CascadeNode | null)): CascadeNode[] => {
            if (!list) return []
            return list.map(item => this.node.get(item, level, parentRef))
        }
    }

    loading = createFlagManager()
    loaded = createFlagManager()

}