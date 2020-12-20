import {designPlc} from "../core/designPlc";

export default designPlc({
    name: 'plc-color-picker',
    render: {
        edit: ({row, plc}) => {
            return !plc.props.field ? null : <pl-input v-model={row[plc.props.field]}/>
        }
    },
})