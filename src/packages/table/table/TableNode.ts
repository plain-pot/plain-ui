import {TablePropsType} from "@/packages/table/table-utils";
import {TableMark} from "@/packages/table/table/TableMark";

export class TableNode {

    constructor(
        public data: object,
        public props: TablePropsType,
        public level,
        public parent: TableNode | null,
        public mark: TableMark,
    ) {}

    get key(): string {
        return '1'
    }
}