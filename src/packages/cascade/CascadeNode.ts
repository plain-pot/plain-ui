import {CascadeConfig, CascadeMark} from "@/packages/cascade/CascadeMark";
import {set} from "@vue/composition-api";

export class CascadeNode {

    constructor(
        public key: string,
        public data: object,
        public level: number,
        public config: () => CascadeConfig,
        public parentRef: () => (CascadeNode | null),
        public markRef: () => CascadeMark,
        public ctxState: () => {
            expandKeys: string[],
            filterText: string | undefined,
        }
    ) {}

    selfGetter = () => this;

    /*---------------------------------------prop-------------------------------------------*/

    /*节点显示文本*/
    get label(): string {return this.data[this.config().labelField]}

    /*节点子数据*/
    get childrenData(): object[] | undefined {
        const data = this.data[this.config().childrenField]
        return typeof data === "function" ? data() : data
    }

    /*子节点*/
    get children(): CascadeNode[] | undefined {
        if (!this.childrenData) return undefined
        return this.childrenData.map(child => this.markRef().node.get(
            child,
            this.level + 1,
            this.selfGetter,
        ))
    }

    /*是否为叶子节点（无子节点）*/
    get isLeaf(): boolean {
        const {isLeaf} = this.config()
        if (!!isLeaf) {
            return isLeaf(this)
        } else {
            return !this.children || this.children.length === 0
        }
    }

    /*当前节点展开时包含的keys*/
    get expandKeys(): string[] {
        let expandKeys = [this.key]
        let parent = this.parentRef()
        while (!!parent && !!parent.key) {
            expandKeys.unshift(parent.key)
            parent = parent.parentRef()
        }
        return expandKeys
    }

    /*当前节点是否已经展开*/
    get isExpand() {
        let expandKeys = this.ctxState().expandKeys
        let selfExpandKeys = this.expandKeys
        return expandKeys.toString() === selfExpandKeys.toString()
    }

    /*当前是否处于加载状态*/
    get isLoading(): boolean {
        return this.markRef().loading.get(this.key)
    }

    get isLoaded(): boolean {
        return this.markRef().loaded.get(this.key)
    }

    /*当前节点是否禁用*/
    get nodeDisabled(): boolean {
        const nodeDisabled = this.config().nodeDisabled
        return !!nodeDisabled && nodeDisabled(this)
    }

    /*当有过滤文本时，显示的文本*/
    get filterData(): CascadeNode[] {
        let filterData: CascadeNode[] = [this]
        let parent = this.parentRef()
        while (!!parent && !!parent.key) {
            filterData.unshift(parent)
            parent = parent.parentRef()
        }
        return filterData
    }

    /*是否通过筛选，当子节点通过筛选时，当前节点也算通过筛选*/
    get isPassFilter(): boolean {
        const {filterText} = this.ctxState()
        if (!filterText) return false

        const {filterMethod} = this.config()
        let filterData = this.filterData
        if (!!filterMethod) {
            return filterMethod(filterData, filterText)
        }
        return filterData.some(item => item.label.indexOf(filterText!) > -1)
    }

    /*---------------------------------------action-------------------------------------------*/

    /*设置子节点数据*/
    setChildren(children: object[]) {
        set(this.data, this.config().childrenField, children)
    }

    loading(val: boolean) {
        this.markRef().loading.set(this.key, val)
    }

    loaded(val: boolean) {
        this.markRef().loaded.set(this.key, val)
    }
}