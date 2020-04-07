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
}

export class CascadeMark {
    node: CascadeData
    formatCount: number

    constructor(public key: string) {
    }

    static node = 'node'
    static formatCount = 'formatCount'
}