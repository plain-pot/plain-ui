
import {PlInput} from "../../../PlInput";
import {designComponent} from "plain-design-composition";
import {PlcEmitsOptions, PlcPropsOptions} from "../utils/plc.utils";
import {PlcScopeSlotsOptions} from "../utils/plc.scope-slots";
import {useExternalPlc} from "../core/useExternalPlc";

export default designComponent({
    name: 'plc-input',
    props: {
        ...PlcPropsOptions,
    },
    scopeSlots: PlcScopeSlotsOptions,
    emits: PlcEmitsOptions,
    setup({props, slots, scopeSlots, event}) {
        return useExternalPlc({
            props, scopeSlots, slots, event, defaultScopeSlots: {
                edit: ({row, plc}) => !plc.props.field ? null : <PlInput v-model={row[plc.props.field]}/>
            }
        })
    },
})
