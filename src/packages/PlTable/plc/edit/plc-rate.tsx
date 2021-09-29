
import {PlRate} from "../../../PlRate";
import {designComponent} from "plain-ui-composition";
import {createPlcPropOptions, PlcEmitsOptions} from "../utils/plc.utils";
import {PlcScopeSlotsOptions} from "../utils/plc.scope-slots";
import {useExternalPlc} from "../core/useExternalPlc";

export default designComponent({
    name: 'plc-rate',
    props: {
        ...createPlcPropOptions({
            addEditPadding: true,
        }),
    },
    scopeSlots: PlcScopeSlotsOptions,
    emits: PlcEmitsOptions,
    setup({props, slots, scopeSlots, event}) {
        return useExternalPlc({
            props, scopeSlots, slots, event, defaultScopeSlots: {
                normal: ({row, plc}) => !plc.props.field ? null : <PlRate disabled v-model={row[plc.props.field]}/>,
                edit: ({row, plc}) => !plc.props.field ? null : <PlRate v-model={row[plc.props.field]}/>,
            }
        })
    },
})
