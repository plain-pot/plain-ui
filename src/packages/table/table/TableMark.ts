import {TableNode} from "@/packages/table/table/TableNode";
import {reactive} from "@vue/composition-api";
import {getValidateConfigData, ValidateResultMap} from "@/packages/form/validate";
import {KeyGenerator} from "../../../../src-doc/page/normal/test-table/KeyGenerator";
import {createFlagManager} from "@/util/NodeWrapper";

const generator = new KeyGenerator('table_node')

export interface TableConfig {
    lazy?: boolean,
    according?: boolean,
    keyField?: string,
    childrenField?: string,
    getChildren?: (node: TableNode, cb: (...args: any[]) => void) => void,
    isCheckable?: (node: TableNode) => boolean,
    isLeaf?: (node: TableNode) => boolean,
    filterNodeMethod?: (node: TableNode) => boolean,
    checkStrictly?: boolean,
    autoExpandParent?: boolean,
}

export class TableMark {

    constructor(
        public config: () => TableConfig,
        public getRules: () => ReturnType<typeof getValidateConfigData>,
    ) {}

    selfGetter = () => this;

    node = {
        state: reactive({
            map: {} as { [k: string]: TableNode }
        }),
        get: (
            data: any,
            level: number,
            parentRef: () => (TableNode),
            isSummaryData: boolean,
        ): TableNode => {
            const key = generator.get(data, this.config().keyField)
            let node: TableNode = this.node.state.map[key] as TableNode
            if (!!node) {
                node.data = data
                node.level = level
                node.parentRef = parentRef
            } else {
                node = new TableNode(
                    key,
                    data,
                    level,
                    isSummaryData,
                    this.config,
                    parentRef,
                    this.selfGetter,
                    this.getRules,
                )
                this.node.state.map[key] = node
            }
            return node
        },
        getList: (
            list: any[] | undefined,
            level,
            parentRef: () => (TableNode),
            isSummaryData: boolean,
        ): TableNode[] => {
            if (!list) return []
            return list.map(item => this.node.get(
                item,
                level,
                parentRef,
                isSummaryData,
            ))
        },
        getByKey(key: string) {
            return this.state.map[key]
        },
    }

    editRow = createFlagManager<any>()
    validateResult = createFlagManager<ValidateResultMap>()
    edit = createFlagManager()
    expand = createFlagManager()
    check = createFlagManager()
    loading = createFlagManager()
    loaded = createFlagManager()

}