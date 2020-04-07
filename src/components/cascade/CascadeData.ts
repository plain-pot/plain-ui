import {TreeMark} from "../tree/tree";

export class CascadeData {

    key: string
    label: string
    children: CascadeData[]

    constructor(public data: any, public context: any, public level: number, public parent?: CascadeData | null) {
        const {keyField, labelField} = context
        this.key = !!keyField ? data[keyField] : undefined
        this.label = !!labelField ? data[labelField] : undefined
    }

    /*当前节点的子节点的数据*/
    get childrenData() {
        return this.data[this.context.childrenField]
    }

    /*是否为叶子节点*/
    get isLeaf(): boolean {
        const {isLeaf} = this.context
        if (!!isLeaf) {
            return isLeaf(this)
        } else {
            return !this.children || this.children.length === 0
        }
    }

    get expandKeys(): string[] {
        let expandKeys = [this.key]
        let parent = this.parent
        while (!!parent && !!parent.key) {
            expandKeys.unshift(parent.key)
            parent = parent.parent
        }
        return expandKeys
    }

    get isExpand() {
        let expandKeys = this.context.expandKeys
        let selfExpandKeys = this.expandKeys
        return expandKeys.toString() === selfExpandKeys.toString()
    }

    get isLoading(): boolean {
        return this.context.getMark(this.key, TreeMark.loading)
    }

    get isDisabled(): boolean {
        return !!this.context.isDisabled && this.context.isDisabled(this)
    }

    setChildren(children: CascadeData[]) {
        this.context.$set(this.data, this.context.childrenField, children)
    }
}

export class CascadeMark {
    node: CascadeData
    formatCount: number
    loading: boolean
    loaded: boolean

    constructor(public key: string) {
    }

    static node = 'node'
    static formatCount = 'formatCount'
    static loading = 'loading'
    static loaded = 'loaded'
}