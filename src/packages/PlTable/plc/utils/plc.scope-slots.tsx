import {TableRenderScope, tPlcType} from "./plc.type";
import {VNodeChild} from "../../../../shims";
import {VueNode} from "react";

export type PlcRenderFunction = (scope: TableRenderScope) => VNodeChild
export type PlcPropsHead = (scope: { plc: tPlcType }) => VNodeChild
export type PlcPropsDefault = PlcRenderFunction
export type PlcPropsSummary = PlcRenderFunction
export type PlcPropsEdit = PlcRenderFunction
export type PlcPropsForm = PlcRenderFunction

export type ScopeSlotsType<ScopeSlots extends Record<string, (...args: any) => any>> = { [k in keyof ScopeSlots]: ((scope: Parameters<ScopeSlots[k]>[0], defaultNode?: VueNode) => VueNode) & { isExist: () => boolean } }

export const PlcScopeSlotsOptions = {
    head: {} as PlcPropsHead,                       // 列标题渲染函数
    normal: {} as PlcPropsDefault,                  // 列内容默认渲染函数
    summary: {} as PlcPropsSummary,                 // 列内容在合计行上的渲染函数
    edit: {} as PlcPropsEdit,                       // 列内容在编辑状态下的渲染函数
    form: {} as PlcPropsForm,                       // 表单编辑时渲染的内容
}

export type tPlcScopeSlots = ScopeSlotsType<typeof PlcScopeSlotsOptions>

export type tPlcSlots = Record<string, ((defaultSlot?: VueNode) => VueNode) & { isExist: () => boolean }>
