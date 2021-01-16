import {designPlc} from "../core/designPlc";
import {PlInput} from "../../../input/input";

export default designPlc({
    name: 'plc-input',
}, {
    edit: ({row, plc}) => !plc.props.field ? null : <PlInput v-model={row[plc.props.field]}/>
},)