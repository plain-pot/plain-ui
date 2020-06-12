import {TablePropsType} from "@/packages/table/table-utils";
import {TableNode} from "@/packages/table/table/TableNode";
import {TreeMarkAttr} from "@/packages/tree/utils/tree-constant";
import {set} from "@vue/composition-api";

const enum TableMarkAttr {
    expand = 'expand',
    check = 'check',
    loading = 'loading',
    loaded = 'loaded',
    node = 'node',
}

export class TableMark {

    expandMap: { [key: string]: boolean } = {}
    checkMap: { [key: string]: boolean } = {}
    loadingMap: { [key: string]: boolean } = {}
    loadedMap: { [key: string]: boolean } = {}
    nodeMap: { [key: string]: TableNode } = {}

    constructor(public props: TablePropsType) {}

    getMark<T = string>(key: string, attr: TableMarkAttr): T {
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

    getNode(data: object, props: TablePropsType, level: number, parent: TableNode) {
        const key = data[props.keyField!]
        let node = this.nodeMap[key]
        if (!node) {
            node = new TableNode(data, props, level, parent, this)
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