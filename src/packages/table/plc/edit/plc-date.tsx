import {designPlc} from "../core/designPlc";

export default designPlc({
    name: 'plc-date',
    render: {
        edit: ({row, plc}) => {
            return !plc.props.field ? null : <pl-date v-model={row[plc.props.field]}/>
        }
    },
})