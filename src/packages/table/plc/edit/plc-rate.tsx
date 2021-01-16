import {designPlc} from "../core/designPlc";
import {PlRate} from "../../../rate/rate";

export default designPlc({
    name: 'plc-rate',
    standardProps: {
        addEditPadding: {default: true},
    },
}, {
    default: ({row, plc}) => !plc.props.field ? null : <PlRate disabled v-model={row[plc.props.field]}/>,
    edit: ({row, plc}) => !plc.props.field ? null : <PlRate v-model={row[plc.props.field]}/>,
})