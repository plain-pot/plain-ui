import {CascadeNode} from "@/packages/cascade/CascadeNode";
import {reactive, set} from "@vue/composition-api";
import {KeyGenerator} from "../../../src-doc/page/normal/test-table/KeyGenerator";
import {createFlagManager} from "@/util/NodeWrapper";

const generator = new KeyGenerator('cascade_node')

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

    constructor(public config: CascadeConfig, public ctxState: () => {
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
            const key = generator.get(data, this.config.keyField)
            let node: CascadeNode = this.node.state.map[key]
            if (!!node) {
                node.data = data
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
        getList: (list: any[] | undefined, level, parentRef: () => (CascadeNode | null)): CascadeNode[] => {
            if (!list) return []
            return list.map(item => this.node.get(item, level, parentRef))
        }
    }

    loading = createFlagManager()
    loaded = createFlagManager()

}