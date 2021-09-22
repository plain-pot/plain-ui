
import {tPlc} from "./plc.type";

export function renderColgroup(flatPlcList: tPlc[]) {
    return (
        <colgroup>
            {flatPlcList.map((plc, index) => <col key={index} width={plc.props.width || ''}/>)}
        </colgroup>
    )
}
