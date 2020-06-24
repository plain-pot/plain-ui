import {TablePropsType} from "@/packages/table/table-utils";
import {TableNode} from "@/packages/table/table/TableNode";
import {TreeMarkAttr} from "@/packages/tree/utils/tree-constant";
import {set} from "@vue/composition-api";
import {$plain} from "@/packages/base";

const data2Key = new WeakMap()

export const enum TableNodeEditStatus {
    normal = 'normal',
    create = 'create',
    update = 'update',
}

export const enum TableMarkAttr {
    expand = 'expand',
    check = 'check',
    loading = 'loading',
    loaded = 'loaded',
    node = 'node',
}

export class TableMark {

    expandMap: { [key: string]: boolean } = {}              // 是否已经展开（针对于树形表格来说的，不适用于展开列）
    checkMap: { [key: string]: boolean } = {}               // 是否已经选中（针对于树形表格来说的，不适用于多选列）
    loadingMap: { [key: string]: boolean } = {}             // 是否处于加载状态（针对于树形表格来说的，标明行是否处于懒加载子节点数据的状态）
    loadedMap: { [key: string]: boolean } = {}              // 是否已经加载完毕子节点数据（适用于树形表格）
    nodeMap: { [key: string]: TableNode } = {}              // key映射TableNode

    constructor(public props: TablePropsType) {}

    getMark<T = boolean>(key: string, attr: TableMarkAttr): T {
        const attrName = `${attr}Map`
        if (!attrName) {
            console.error(`pl-table: no attr:${attr}`)
            return false as any
        }
        return this[attrName][key]
    }

    setMark(key: string, attr: TableMarkAttr, value: boolean | TableNode) {
        const attrName = `${attr}Map`
        if (!attrName) {
            console.error(`pl-table: no attr:${attr}`)
            return
        }
        set(this[attrName], key, value)
    }

    getActiveKeys(attr: TableMarkAttr): string[] {
        const attrName = `${attr}Map`
        if (!attrName) {
            console.error(`pl-table: no attr:${attr}`)
            return []
        }
        const keys: string[] = []
        for (let key in this[attrName]) {
            if (this[attrName].hasOwnProperty(key) && !!this[attrName][key]) {
                keys.push(key)
            }
        }
        return keys
    }

    getNode(data: object, props: TablePropsType, level: number, parent: TableNode, isSummaryData: boolean) {
        let key: string | undefined = !!props.keyField ? data[props.keyField] : undefined
        if (!key) {
            key = data2Key.get(data)
            if (!key) {
                key = `p_${$plain.utils.uuid()}`
                data2Key.set(data, key)
            }
        }
        let node = this.nodeMap[key]
        if (!node) {
            node = new TableNode(key, data, props, level, parent, this, isSummaryData)
            this.setMark(key, TableMarkAttr.node, node)
        } else {
            node.data = data
        }
        return node
    }

    static expand = TreeMarkAttr.expand
    static check = TreeMarkAttr.check
    static loading = TreeMarkAttr.loading
    static loaded = TreeMarkAttr.loaded
    static node = TreeMarkAttr.node
}