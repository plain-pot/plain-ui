import PlColorButton from "../../../PlColorButton";
import PlColorPicker from "../../../PlColorPicker";

import {designComponent} from "plain-design-composition";
import {PlcEmitsOptions, PlcPropsOptions} from "../utils/plc.utils";
import {PlcScopeSlotsOptions} from "../utils/plc.scope-slots";
import {useExternalPlc} from "../core/useExternalPlc";

export default designComponent({
    name: 'plc-color-picker',
    props: {
        ...PlcPropsOptions
    },
    scopeSlots: PlcScopeSlotsOptions,
    emits: PlcEmitsOptions,
    setup({props, slots, scopeSlots, event}) {
        return useExternalPlc({
            props, scopeSlots, event, slots, defaultScopeSlots: {
                normal: ({row, plc}) => {
                    return !!plc.props.field && <>
                        <PlColorButton color={row[plc.props.field]} style={{marginRight: '6px'}}/>
                        {row[plc.props.field]}
                    </>
                },
                edit: ({row, plc}) => !plc.props.field ? null : <PlColorPicker v-model={row[plc.props.field]}/>
            }
        })
    },
})
