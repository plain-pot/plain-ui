import {designPlc} from "../core/designPlc";
import {PlNumber} from "../../../number/number";

export default designPlc({
    name: 'plc-number',
}, {
    edit: ({row, plc}) => !plc.props.field ? null : <PlNumber v-model={row[plc.props.field]}/>
},)