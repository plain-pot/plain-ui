import {TableNode} from "./useTableNode";
import {createHooks, createSyncHooks} from "../../../createUseTableOption/use/use.hooks";
import {PlainScroll} from "../../../PlScroll";
import {TableHoverPart} from "../utils/table.utils";
import {tPlcType} from "../../plc/utils/plc.type";
import {tPlcCacheStateData} from "../../plc/utils/usePropsState";
import {VueNode} from "plain-ui-composition";

export function useTableHooks() {
    const hooks = {
        /*单击行*/
        onClickRow: createHooks<(data: { node: TableNode, e: MouseEvent }) => void>(),
        /*双击行*/
        onDblClickRow: createHooks<(data: { node: TableNode, e: MouseEvent }) => void>(),
        /*单击单元格*/
        onClickCell: createHooks<(data: { node: TableNode, e: MouseEvent }) => void>(),
        /*双击单元格*/
        onDblClickCell: createHooks<(data: { node: TableNode, e: MouseEvent }) => void>(),

        /*virtual挂载*/
        onVirtualMounted: createHooks<(data: { scroll: PlainScroll }) => void>(),
        /*左右滚动*/
        onScrollLeft: createHooks<(data: { scrollLeft: number, part: TableHoverPart }) => void>(),

        /*收集原始列信息*/
        onPlcTypes: createHooks<(list: tPlcType[]) => void>(),
        /*table根节点挂载*/
        onTableMounted: createHooks<(el: HTMLDivElement) => void>(),
        /*禁用虚拟滚动*/
        onDisabledVirtual: createSyncHooks<(flag: boolean) => void>(true),
        /*渲染行tr*/
        onRenderRow: createSyncHooks<(scope: { node: TableNode, row: any, content: VueNode }) => void>(),
        /*配置列信息*/
        onConfigPlc: createHooks<(data: { plcList: tPlcType[], stateData: tPlcCacheStateData }) => void>(),
    }

    return hooks;
}

export type tTableHooks = ReturnType<typeof useTableHooks>
