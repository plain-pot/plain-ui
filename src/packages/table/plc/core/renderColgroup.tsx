import {Plc} from "./plc.type";

export function renderColgroup(flatPlcList: Plc[]) {
    return (
        <colgroup>
            {flatPlcList.map((plc) => <col style={`width:${plc.props.width}px`}/>)}
        </colgroup>
    )
}