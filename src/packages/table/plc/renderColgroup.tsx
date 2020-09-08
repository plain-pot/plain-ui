import {PlainTable} from "@/packages/table/table/table";

/**
 * 渲染colgroup，限制列的宽度
 * @author  韦胜健
 * @date    2020/9/8 16:09
 */
export function renderColgroup(table: PlainTable) {
    return () => (
        <colgroup>
            {!!table.plcData.value && table.plcData.value.flatPlcList.map(plc => (
                <col style={{
                    width: `${plc.props.width}px`,
                    minWidth: `${plc.props.width}px`,
                }}/>
            ))}
        </colgroup>
    )
}