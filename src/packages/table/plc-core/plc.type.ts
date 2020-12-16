import {VNodeChild} from "../../../shims";

export type PlcHeadFunction = () => VNodeChild

export type PlcDefaultFunction = () => VNodeChild

export type PlcEditFunction = () => VNodeChild

export type PlcSummaryFunction = () => VNodeChild

export type PlcRenderAfterRowFunction = () => VNodeChild

export type PlcEditableFunc = boolean | (() => boolean)