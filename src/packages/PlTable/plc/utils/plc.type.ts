import {ComponentEvent, ExtractPropTypes} from "plain-ui-composition";
import {TableNode} from "../../table/use/useTableNode";
import {PlcEmitsOptions, PlcGroupPropsOptions, PlcPropsOptions, PlcPublicAttrsType} from "./plc.utils";
import {PlcPropsHead, tPlcScopeSlots, tPlcSlots} from "./plc.scope-slots";
import {PlainObject} from "plain-utils/utils/event";

export type TableRenderScope = { plc: tPlc, node: TableNode, row: PlainObject }
export type PlcPropsType = Omit<ExtractPropTypes<typeof PlcPropsOptions>, 'width' | 'order'> & { width: number, order: number | undefined }
export type PlcGroupPropsType = Omit<ExtractPropTypes<typeof PlcGroupPropsOptions>, 'order'> & { order: number | undefined }
export type tPlcEvent = ComponentEvent<typeof PlcEmitsOptions>

export type tPlcGroup = PlcPublicAttrsType & {
    group: true,
    children: tPlcType[],
    props: PlcGroupPropsType,
    refer: () => tPlcGroup,
    slots: { head: PlcPropsHead & { isExist: () => boolean } },
    setDurWidth: (width: number) => void,
    setPropsState: (data: Partial<PlcGroupPropsType>) => void,
    getState: () => PlcPropsType,
}

export type tPlc = PlcPublicAttrsType & {
    group: false,
    props: PlcPropsType,
    slots: tPlcSlots,
    scopeSlots: tPlcScopeSlots,
    event: tPlcEvent,
    refer: () => tPlc,
    setDurWidth: (width: number) => void,
    setPropsState: (data: Partial<PlcPropsType>) => void,
    getState: () => PlcPropsType,
}

export type tPlcType = tPlcGroup | tPlc
