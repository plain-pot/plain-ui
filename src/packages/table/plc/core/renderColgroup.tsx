import {Plc} from "./plc.type";

export function renderColgroup(flatPlcList: Plc[]) {
    return (
        <colgroup>
            {flatPlcList.map((plc) => <col width={plc.props.width || ''}/>)}
        </colgroup>
    )
}