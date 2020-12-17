import {SimpleObject, VNodeChild} from "../../../shims";
import {PlcComponentPublicData, PlcGroupProps, PlcProps} from "./plc.utils";
import {ComponentPublicInstance, ExtractPropTypes} from 'vue';
import {TableNode} from "../table-core/node";

/*---------------------------------------plc props function type-------------------------------------------*/

export type PlcRenderFunction = (scope: { node: TableNode, row: SimpleObject, plc: PlcType }) => VNodeChild

export type PlcHeadFunction = (scope: { plc: PlcType }) => VNodeChild

export type PlcDefaultFunction = PlcRenderFunction

export type PlcEditFunction = PlcRenderFunction

export type PlcSummaryFunction = PlcRenderFunction

export type PlcRenderAfterRowFunction = (option: { plc: PlcType, node: TableNode }) => VNodeChild

export type PlcEditableFunc = boolean | ((node: TableNode) => boolean)

/*---------------------------------------main-------------------------------------------*/

type PlcTypeProps = Omit<ExtractPropTypes<typeof PlcProps>, 'width' | 'fit' | 'order'> & { width: number, fit: number, order: number | undefined }
type PlcTypeState = { [k in keyof PlcTypeProps]: PlcTypeProps[k] | null }

type PlcGroupTypeProps = Omit<ExtractPropTypes<typeof PlcGroupProps>, 'order'> & { order: number | undefined }
type PlcGroupTypeState = { [k in keyof PlcGroupTypeProps]: PlcTypeProps[k] | null }

export type PlcGroup = typeof PlcComponentPublicData & {
    group: true,
    scopedSlots: {
        head: (scope: { plc: TablePlc }, vnode?: VNodeChild) => VNodeChild,
    },
    props: PlcGroupTypeProps,
    state: PlcGroupTypeState,
    children: (TablePlc)[]
    setDurWidth: (width: number) => void,
    self: () => PlcGroup,
}

export type PlcType = typeof PlcComponentPublicData & {
    group: false,
    ctx: ComponentPublicInstance,
    props: PlcTypeProps,
    state: PlcTypeState,
    setDurWidth: (width: number) => void,
    scopedSlots: {
        head: ((scope: { plc: TablePlc }, vnode?: VNodeChild) => VNodeChild) & { isExist: () => boolean },
        default: ((scope: { node: TableNode, plc: PlcType }, vnode?: VNodeChild) => VNodeChild) & { isExist: () => boolean },
        edit: ((scope: { node: TableNode, plc: PlcType }, vnode?: VNodeChild) => VNodeChild) & { isExist: () => boolean },
        summary: ((scope: { node: TableNode, plc: PlcType }, vnode?: VNodeChild) => VNodeChild) & { isExist: () => boolean },
    },
    self: () => PlcType,
}

export type TablePlc = PlcType | PlcGroup