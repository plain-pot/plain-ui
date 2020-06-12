import {TablePropsType} from "@/packages/table/table-utils";
import {TableMark, TableMarkAttr} from "@/packages/table/table/TableMark";

export class TableNode {

    constructor(
        public key: string,
        public data: object,
        public props: TablePropsType,
        public level,
        public parent: TableNode | null,
        public mark: TableMark,
    ) {}

    get childrenData() {return !!this.props.childrenField && !!this.data ? this.data[this.props.childrenField] : undefined}

    get children() {return !this.childrenData ? undefined : this.childrenData.map(child => this.mark.getNode(child, this.props, this.level + 1, this))}

    /*---------------------------------------mark attrs-------------------------------------------*/

    get isExpand(): boolean {return this.mark.getMark(this.key, TableMarkAttr.expand)}

    get isCheck(): boolean {return this.mark.getMark(this.key, TableMarkAttr.check)}

    get isLoading(): boolean {return this.mark.getMark(this.key, TableMarkAttr.loading)}

    get isLoaded(): boolean {return this.mark.getMark(this.key, TableMarkAttr.loaded)}

    /*---------------------------------------judge props-------------------------------------------*/

    get isCheckable(): boolean {return !this.props.isCheckable || this.props.isCheckable(this)}

    get isLeaf(): boolean {return !!this.props.isLeaf ? this.props.isLeaf(this) : (!!this.children && this.children.length > 0)}

    // get isVisible(): boolean {}

}