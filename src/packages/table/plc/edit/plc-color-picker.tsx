import {designPlc} from "../core/designPlc";

export default designPlc({
    name: 'plc-color-picker',
}, {
    default: ({row, plc}) => {
        return !!plc.props.field && <>
            <pl-color-button color={row[plc.props.field]} style="margin-right:6px;"/>
            {row[plc.props.field]}
        </>
    },
    edit: ({row, plc}) => !plc.props.field ? null : <pl-color-picker v-model={row[plc.props.field]}/>
},)