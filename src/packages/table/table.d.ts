import {TableNode} from "@/packages/table/table/TableNode";
import {PlcType} from "@/packages/table/plc/plc";
import {StyleType} from "@/types/utils";

export namespace Table {

    type Classes = { [k: string]: boolean } | string | Classes[] | null | undefined

    interface SpanMethod {
        new(): ((data: { tableNode: TableNode, plc: PlcType }) => { rowspan: number, colspan: number })
    }

    interface RowClassFunc {
        new(): ((tableNode: TableNode) => Classes)
    }

    /*interface HeadRowClassFunc {
        new(): ((tableNode: TableNode) => Classes)
    }*/

    interface CellClassFunc {
        new(): ((tableNode: TableNode, plc: PlcType) => Classes)
    }

    interface CellStyleFunc {
        new(): ((tableNode: TableNode, plc: PlcType) => StyleType)
    }

    interface HeadCellClassFunc {
        new(): ((tableNode: TableNode) => Classes)
    }

    interface HeadCellStyleFunc {
        new(): ((tableNode: TableNode) => Classes)
    }
}