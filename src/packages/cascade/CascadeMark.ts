import {CascadeNode} from "@/packages/cascade/CascadeNode";
import {CascadeContextType, CascadeMarkAttr} from "@/packages/cascade/cascade-constant";
import {set} from "@vue/composition-api";

export class CascadeMark {

    loadingMap: { [key: string]: boolean } = {}
    loadedMap: { [key: string]: boolean } = {}
    nodeMap: { [key: string]: CascadeNode } = {}

    constructor(public ctx: CascadeContextType) {}

    getMark(key: string, attr: CascadeMarkAttr): boolean | CascadeNode {
        const attrName = `${attr}Map`
        if (!attrName) {
            console.error(`pl-cascade: no attr:${attr}`)
            return false
        }
        return this[attrName][key]
    }

    setMark(key: string, attr: CascadeMarkAttr, value: boolean | CascadeNode): void {
        const attrName = `${attr}Map`
        if (!attrName) {
            console.error(`pl-tree: no attr:${attr}`)
            return
        }
        set(this[attrName], key, value)
    }

    getNode(data: object, ctx: CascadeContextType, level: number, parent: CascadeNode) {
        const key = data[ctx.keyField!]
        let node = this.nodeMap[key]
        if (!node) {
            node = new CascadeNode(data, ctx, level, parent, this)
            this.setMark(key, CascadeMarkAttr.node, node)
        } else {
            node.data = data
        }
        return node
    }

    static loading = CascadeMarkAttr.loading
    static loaded = CascadeMarkAttr.loaded
    static node = CascadeMarkAttr.node

}