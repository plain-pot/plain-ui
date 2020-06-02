import {TreeNode} from "@/packages/tree/utils/TreeNode";
import {TreeContextType, TreeMarkAttr} from "@/packages/tree/utils/tree-constant";
import {set} from "@vue/composition-api";

export class TreeMark {

    expandMap: { [key: string]: boolean } = {}
    checkMap: { [key: string]: boolean } = {}
    loadingMap: { [key: string]: boolean } = {}
    loadedMap: { [key: string]: boolean } = {}
    nodeMap: { [key: string]: TreeNode } = {}

    constructor(public ctx: TreeContextType) {}

    getMark(key: string, attr: TreeMarkAttr): boolean {
        const attrName = `${attr}Map`
        if (!attrName) {
            console.error(`pl-tree: no attr:${attr}`)
            return false
        }
        return this[attrName][key]
    }

    setMark(key: string, attr: TreeMarkAttr, value: boolean) {
        const attrName = `${attr}Map`
        if (!attrName) {
            console.error(`pl-tree: no attr:${attr}`)
            return
        }
        set(this[attrName], key, value)
    }

    getActiveKeys(attr: TreeMarkAttr): string[] {
        const attrName = `${attr}Map`
        if (!attrName) {
            console.error(`pl-tree: no attr:${attr}`)
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

    getTreeNode(data, context, level, parent) {
        const key = data[this.ctx.keyField]
        let node = this.nodeMap[key]
        if (!node) {
            node = new TreeNode(data, context, level, parent, this)
            // @ts-ignore
            this.setMark(key, TreeMarkAttr.node, node)
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