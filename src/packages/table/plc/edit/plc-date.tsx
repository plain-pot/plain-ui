import {designPlc} from "../core/designPlc";
// import {PlDate} from "../../../date/date";

export default designPlc({
    name: 'plc-date',
}, {
    edit: ({row, plc}) => !plc.props.field ? null : <pl-date v-model={row[plc.props.field]}/>
},)