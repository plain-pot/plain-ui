import {tTableOptionHooks} from "./use.hooks";
import PlTable from "../../PlTable";
import {TableNode} from "../../PlTable/table/use/useTableNode";
import {tPlcType} from "../../PlTable/plc/utils/plc.type";

import {PlcIndex} from "../../PlcIndex";
import {iTableOptionState, tTableOptionConfig} from "../createUseTableOption.utils";
import {tTablePagination} from "./use.paginaiton";
import {tTableOptionSort} from "./use.sort.state";
import {tTableOptionCache} from "./use.cache";

export function useTableOptionBaseTable(
    {
        config,
        tableState,
        hooks,
        pagination,
        sortState,
        cache,
    }: {
        config: tTableOptionConfig,
        tableState: iTableOptionState,
        hooks: tTableOptionHooks,
        pagination: tTablePagination,
        sortState: tTableOptionSort,
        cache: tTableOptionCache,
    }) {
    const refTable = (table: typeof PlTable.use.class | null | undefined) => {
        hooks.onRefTable.exec(table!)
    }
    const handler = {
        onClickCell: (node: TableNode) => {hooks.onClickCell.exec(node)},
        onDblClickCell: (node: TableNode) => {hooks.onDblClickCell.exec(node)},
        onClickHead: (plc: tPlcType, e: MouseEvent) => hooks.onClickHead.exec({plc, e})
    }

    hooks.onTableRender.use(prev => [
        ...prev,
        {
            seq: 10,
            render: () => (
                <PlTable
                    ref={refTable as any}
                    showRows={config.showRows}
                    class="pl-table-pro-base-table"
                    bodyRowHeight={config.bodyRowHeight}
                    headRowHeight={config.headRowHeight}
                    data={tableState.list}
                    defaultEditingWhenAddRow={tableState.editingWhenAddRow}
                    currentKey={tableState.currentKey || undefined}
                    keyField={config.keyField}
                    config={cache.tablePropsConfig}
                    onClickRow={handler.onClickCell}
                    onDblclickCell={handler.onDblClickCell}
                    onClickHead={handler.onClickHead}
                    sort={sortState.sortQueryData.value}
                    onCollectPlcData={hooks.onCollectPlcData.exec}
                >
                    {/*todo 这里加上PlcIndex就会出现响应式依赖死循环的问题*/}
                    {/*<PlcIndex />*/}
                    {hooks.onColumns.exec([])}
                </PlTable>
            )
        }
    ])
}
