import {CascadeContextType, CascadeMarkAttr} from "@/packages/cascade/cascade-constant";
import {CascadeMark} from "@/packages/cascade/CascadeMark";
import {set} from "@vue/composition-api";

export class CascadeNode {

    constructor(
        public data: object,
        public ctx: CascadeContextType,
        public level: number,
        public parent: CascadeNode | null,
        public mark: CascadeMark,
    ) {}

    get key(): string {return this.data[this.ctx.keyField!]}

    get label(): string {return this.data[this.ctx.labelField!]}

    get childrenData(): object[] | undefined {
        const data = this.data[this.ctx.childrenField!]
        return typeof data === "function" ? data() : data
    }

    get children(): CascadeNode[] | undefined {
        if (!this.childrenData) return undefined
        return this.childrenData.map(child => this.mark.getNode(child, this.ctx, this.level + 1, this))
    }

    /*是否为叶子节点*/
    get isLeaf(): boolean {
        const {isLeaf} = this.ctx
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
        let expandKeys = this.ctx.expandKeys
        let selfExpandKeys = this.expandKeys
        return expandKeys.toString() === selfExpandKeys.toString()
    }

    get isLoading(): boolean {
        return this.mark.getMark(this.key, CascadeMarkAttr.loading) as boolean
    }

    get nodeDisabled(): boolean {
        return !!this.ctx.nodeDisabled && this.ctx.nodeDisabled(this)
    }

    get filterData(): CascadeNode[] {
        let filterData: CascadeNode[] = [this]
        let parent = this.parent
        while (!!parent && !!parent.key) {
            filterData.unshift(parent)
            parent = parent.parent
        }
        return filterData
    }

    /**
     * 是否被筛选
     * @author  韦胜健
     * @date    2020/4/8 9:29
     */
    get isPassFilter(): boolean {
        if (!this.ctx.filterText) return false
        let filterData = this.filterData
        if (!!this.ctx.filterMethod) {
            return this.ctx.filterMethod(filterData, this.ctx.filterText)
        }
        return filterData.some(item => item.label.indexOf(this.ctx.filterText!) > -1)
    }

    setChildren(children: object[]) {
        set(this.data, this.ctx.childrenField, children)
    }
}