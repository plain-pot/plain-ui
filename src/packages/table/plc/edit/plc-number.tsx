import {designPlc} from "../core/designPlc";

export default designPlc({
    name: 'plc-number',
}, {
    edit: ({row, plc}) => {
        return !plc.props.field ? null : <pl-number v-model={row[plc.props.field]}/>
    }
},)