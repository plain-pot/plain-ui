import {ExtractPropTypes} from 'vue'
import {PlcGroupProps, PlcProps, PlcPublicAttrsType} from "./plc.utils";
import {SimpleObject, VNodeChild} from "../../../../shims";
import {TableNode} from "../../core/useTableNode";

export type TableRenderScope = { plc: Plc, node: TableNode, row: SimpleObject }

type PlcPropsType = Omit<ExtractPropTypes<typeof PlcProps>, 'width' | 'order'> & { width: number, order: number | undefined }
type PlcStateType = { [k in keyof PlcPropsType]: PlcPropsType[k] | null }

type PlcGroupPropsType = Omit<ExtractPropTypes<typeof PlcGroupProps>, 'order'> & { order: number | undefined }
type PlcGroupStateType = { [k in keyof PlcGroupPropsType]: PlcGroupPropsType[k] | null }

type ScopedSlotFunc<T> = T & { isExist: () => boolean }

export type PlcGroup = PlcPublicAttrsType & {
    group: true,
    children: TablePlc[],
    props: PlcGroupPropsType,
    state: PlcGroupStateType,
    refer: () => PlcGroup,
    setDurWidth: (width: number) => void,
    scopedSlots: {
        head: ScopedSlotFunc<(scope: { plc: PlcGroup }, vnode?: VNodeChild) => VNodeChild>,
    },
}

export type Plc = PlcPublicAttrsType & {
    group: false,
    props: PlcPropsType,
    state: PlcStateType,
    refer: () => Plc,
    setDurWidth: (width: number) => void,
    scopedSlots: {
        head: ScopedSlotFunc<((scope: { plc: TablePlc }, vnode?: VNodeChild) => VNodeChild)>,
        default: ScopedSlotFunc<((scope: TableRenderScope, vnode?: VNodeChild) => VNodeChild)>,
        edit: ScopedSlotFunc<((scope: TableRenderScope, vnode?: VNodeChild) => VNodeChild)>,
        summary: ScopedSlotFunc<((scope: TableRenderScope, vnode?: VNodeChild) => VNodeChild)>,
    },
}

export type TablePlc = PlcGroup | Plc