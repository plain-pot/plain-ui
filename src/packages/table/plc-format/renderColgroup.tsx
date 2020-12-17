/**
 * 渲染colgroup，限制列的宽度
 * @author  韦胜健
 * @date    2020/9/8 16:09
 */
import {PlcType} from "../plc-core/plc.type";

export function renderColgroup(flatPlcList: PlcType[]) {
    return (
        <colgroup>
            {flatPlcList.map(plc => (
                <col style={{
                    width: `${plc.props.width}px`,
                    minWidth: `${plc.props.width}px`,
                }}/>
            ))}
        </colgroup>
    )
}