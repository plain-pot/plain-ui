import {designPlc} from "../core/designPlc";

export default designPlc({
    name: 'plc-number',
    render: {
        edit: ({row, plc}) => {
            return !plc.props.field ? null : <pl-input v-model={row[plc.props.field]}/>
        }
    },
})