import {designPlc} from "../core/designPlc";

export default designPlc({
    name: 'plc-color-picker',
}, {
    edit: ({row, plc}) => !plc.props.field ? null : <pl-color-picker v-model={row[plc.props.field]}/>
},)