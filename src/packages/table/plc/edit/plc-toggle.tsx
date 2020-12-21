import {designPlc} from "../core/designPlc";

export default designPlc({
    name: 'plc-toggle',
    standardProps: {
        addEditPadding: {default: true},
    },
}, {
    summary: () => null,
    default: ({row, plc}) => !plc.props.field ? null : <pl-toggle disabled v-model={row[plc.props.field]} trueValue="Y" falseValue="N"/>,
    edit: ({row, plc}) => !plc.props.field ? null : <pl-toggle v-model={row[plc.props.field]} trueValue="Y" falseValue="N"/>,
})