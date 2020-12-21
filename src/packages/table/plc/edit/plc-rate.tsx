import {designPlc} from "../core/designPlc";

export default designPlc({
    name: 'plc-rate',
    standardProps: {
        addEditPadding: {default: true},
    },
}, {
    default: ({row, plc}) => !plc.props.field ? null : <pl-rate disabled v-model={row[plc.props.field]}/>,
    edit: ({row, plc}) => !plc.props.field ? null : <pl-rate v-model={row[plc.props.field]}/>,
})