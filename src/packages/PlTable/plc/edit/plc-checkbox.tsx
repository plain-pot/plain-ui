
import PlCheckbox from "../../../PlCheckbox";
import {designComponent} from "plain-ui-composition";
import {createPlcPropOptions, PlcEmitsOptions} from "../utils/plc.utils";
import {useExternalPlc} from "../core/useExternalPlc";
import {PlcScopeSlotsOptions} from "../utils/plc.scope-slots";

export default designComponent({
    name: 'plc-checkbox',
    props: {
        ...createPlcPropOptions({addEditPadding: true,}),
        trueValue: {default: 'Y' as any},
        falseValue: {default: 'N' as any},
    },
    scopeSlots: PlcScopeSlotsOptions,
    emits: PlcEmitsOptions,
    setup({props, slots, scopeSlots, event}) {
        return useExternalPlc({
            props, scopeSlots, event, slots, defaultScopeSlots: {
                summary: () => null,
                normal: ({row, plc}) => !plc.props.field ? null :
                    <PlCheckbox
                        disabled
                        v-model={row[plc.props.field]}
                        trueValue={props.trueValue}
                        falseValue={props.falseValue}
                    />,
                edit: ({row, plc}) => !plc.props.field ? null :
                    <PlCheckbox
                        v-model={row[plc.props.field]}
                        trueValue={props.trueValue}
                        falseValue={props.falseValue}
                    />,
            }
        })
    },
})
