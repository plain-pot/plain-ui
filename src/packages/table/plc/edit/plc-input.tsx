import {designPlc} from "../core/designPlc";

export default designPlc({
    name: 'plc-input',
}, {
    edit: ({row, plc}) => !plc.props.field ? null : <pl-input v-model={row[plc.props.field]}/>
},)