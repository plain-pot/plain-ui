import {VNodeChild} from "../../../shims";
import {PlcComponentPublicData, PlcGroupProps, PlcProps} from "./plc.utils";
import {ComponentPublicInstance, ComputedRef, ExtractPropTypes} from 'vue';
import {TableNode} from "../table-core/node";

/*---------------------------------------plc props function type-------------------------------------------*/

export type PlcHeadFunction = () => VNodeChild

export type PlcDefaultFunction = () => VNodeChild

export type PlcEditFunction = () => VNodeChild

export type PlcSummaryFunction = () => VNodeChild

export type PlcRenderAfterRowFunction = () => VNodeChild

export type PlcEditableFunc = boolean | (() => boolean)

/*---------------------------------------main-------------------------------------------*/

type PlcTypeProps = Omit<ExtractPropTypes<typeof PlcProps>, 'width' | 'fit' | 'order'> & { width: number, fit: number, order: number | undefined }
type PlcTypeState = { [k in keyof PlcTypeProps]: PlcTypeProps[k] | null }

type PlcGroupTypeProps = Omit<ExtractPropTypes<typeof PlcGroupProps>, 'order'> & { order: number | undefined }
type PlcGroupTypeState = { [k in keyof PlcGroupTypeProps]: PlcTypeProps[k] | null }

export type PlcGroup = typeof PlcComponentPublicData & {
    group: true,
    scopedSlots: {
        head: (scope: { plc: PlcType | PlcGroup }, vnode?: VNodeChild) => VNodeChild,
    },
    props: ComputedRef<PlcGroupTypeProps>,
    state: PlcGroupTypeState,
    children: (PlcType | PlcGroup)[]
    setDurWidth: (width: number) => void,
}

export type PlcType = typeof PlcComponentPublicData & {
    group: false,
    ctx: ComponentPublicInstance,
    props: ComputedRef<PlcTypeProps>,
    state: PlcTypeState,
    setDurWidth: (width: number) => void,
    scopedSlots: {
        head: (scope: { plc: PlcType | PlcGroup }, vnode?: VNodeChild) => VNodeChild,
        default: (scope: { node: TableNode, plc: PlcType }, vnode?: VNodeChild) => VNodeChild,
        edit: (scope: { node: TableNode, plc: PlcType }, vnode?: VNodeChild) => VNodeChild,
        summary: (scope: { node: TableNode, plc: PlcType }, vnode?: VNodeChild) => VNodeChild,
    },
}