import {designPlc} from "../core/designPlc";
import {PlColorButton} from "../../../color-picker/color-button";
import {PlColorPicker} from "../../../color-picker/color-picker";

export default designPlc({
    name: 'plc-color-picker',
}, {
    default: ({row, plc}) => {
        return !!plc.props.field && <>
            <PlColorButton color={row[plc.props.field]} style="margin-right:6px;"/>
            {row[plc.props.field]}
        </>
    },
    edit: ({row, plc}) => !plc.props.field ? null : <PlColorPicker v-model={row[plc.props.field]}/>
},)