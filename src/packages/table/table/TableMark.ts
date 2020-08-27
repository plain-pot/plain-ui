import {TablePropsType} from "@/packages/table/table-utils";
import {TableNode} from "@/packages/table/table/TableNode";
import {set} from "@vue/composition-api";
import {getValidateConfigData, ValidateResultMap} from "@/packages/form/validate";

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
    edit = 'edit',
    validateResult = 'validateResult'
}

let count = 1;

export class TableMark {

    editMap: { [key: string]: boolean } = {}                        // 是否正在编辑
    expandMap: { [key: string]: boolean } = {}                      // 是否已经展开（针对于树形表格来说的，不适用于展开列）
    checkMap: { [key: string]: boolean } = {}                       // 是否已经选中（针对于树形表格来说的，不适用于多选列）
    loadingMap: { [key: string]: boolean } = {}                     // 是否处于加载状态（针对于树形表格来说的，标明行是否处于懒加载子节点数据的状态）
    loadedMap: { [key: string]: boolean } = {}                      // 是否已经加载完毕子节点数据（适用于树形表格）
    nodeMap: { [key: string]: TableNode } = {}                      // key映射TableNode
    editRowMap: { [key: string]: any } = {}                         // 编辑行对象信息
    validateResultMap: { [key: string]: ValidateResultMap } = {}    // 校验结果对象

    constructor(public props: TablePropsType, public getRules: () => ReturnType<typeof getValidateConfigData>) {}

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
        let map = this[attrName]
        if (map.hasOwnProperty(key)) {
            map[key] = value
        } else {
            set(this[attrName], key, value)
        }
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
                key = `p_${count++}`
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
        node.level = level
        return node
    }

    getEditRow(key: string) {return this.editRowMap[key]}

    setEditRow(key: string, editRow: any) {
        if (this.editRowMap.hasOwnProperty(key)) {
            this.editRowMap[key] = editRow
        } else {
            set(this.editRowMap, key, editRow)
        }
    }

    getValidateResult(key: string) {return this.validateResultMap[key]}

    setValidateResult(key: string, validateResult: ValidateResultMap) {
        if (this.validateResultMap.hasOwnProperty(key)) {
            this.validateResultMap[key] = validateResult
        } else {
            set(this.validateResultMap, key, validateResult)
        }
    }

    static expand = TableMarkAttr.expand
    static check = TableMarkAttr.check
    static loading = TableMarkAttr.loading
    static loaded = TableMarkAttr.loaded
    static node = TableMarkAttr.node
    static edit = TableMarkAttr.edit
    static validateResult = TableMarkAttr.validateResult
}