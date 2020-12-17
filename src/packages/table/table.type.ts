import {TableNode} from "./table-core/node";
import {StyleProperties} from "../../shims";
import {PlcType, TablePlc} from "./plc-core/plc.type";

type Classes = { [k: string]: boolean } | string | Classes[] | null | undefined

export type TableSpanMethod = (data: { tableNode: TableNode, plc: PlcType }) => { rowspan: number, colspan: number }

export type TableRowClassFunc = (tableNode: TableNode) => Classes

export type TableCellClassFunc = (tableNode: TableNode, plc: PlcType) => Classes

export type TableCellStyleFunc = (tableNode: TableNode, plc: PlcType) => StyleProperties

export type TableHeadCellClassFunc = (plc: PlcType) => Classes

export type TableHeadCellStyleFunc = (plc: PlcType) => StyleProperties

// todo

export type TableConfigFunc = (plcList: TablePlc[]) => { [k: string]: any }

export type TableGetChildrenFunction = (node: TableNode, cb: (...args: any[]) => void) => void

export type TableIsCheckable = (node: TableNode) => boolean

export type TableIsLeaf = (node: TableNode) => boolean

export type TableFilterNodeMethod = (node: TableNode) => boolean