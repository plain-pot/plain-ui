import {TableNode} from "@/packages/table/table/TableNode";
import {PlcType} from "@/packages/table/plc/plc";

export namespace Table {

    type Classes = { [k: string]: boolean } | string | Classes[] | null | undefined

    interface SpanMethod {
        new(): ((data: { tableNode: TableNode, plc: PlcType }) => { rowspan: number, colspan: number })
    }

    interface RowClassFunc {
        new(): ((tableNode: TableNode) => Classes)
    }

    interface HeadRowClassFunc {
        new(): ((tableNode: TableNode) => Classes)
    }

    interface CellClassFunc {
        new(): ((tableNode: TableNode) => Classes)
    }

    interface CellStyleFunc {
        new(): ((tableNode: TableNode) => Classes)
    }

    interface HeadCellClassFunc {
        new(): ((tableNode: TableNode) => Classes)
    }

    interface HeadCellStyleFunc {
        new(): ((tableNode: TableNode) => Classes)
    }
}