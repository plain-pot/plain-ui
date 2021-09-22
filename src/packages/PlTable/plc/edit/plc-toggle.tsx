
import PlToggle from "../../../PlToggle";
import {designComponent} from "plain-ui-composition";
import {createPlcPropOptions, PlcEmitsOptions} from "../utils/plc.utils";
import {PlcScopeSlotsOptions} from "../utils/plc.scope-slots";
import {useExternalPlc} from "../core/useExternalPlc";

export default designComponent({
    name: 'plc-toggle',
    props: {
        ...createPlcPropOptions({
            addEditPadding: true,
        }),
        trueValue: {default: 'Y' as any},
        falseValue: {default: 'N' as any},
    },
    scopeSlots: PlcScopeSlotsOptions,
    emits: PlcEmitsOptions,
    setup({props, slots, scopeSlots, event}) {
        return useExternalPlc({
            props, scopeSlots, slots, event, defaultScopeSlots: {
                summary: () => null,
                normal: ({row, plc}) => !plc.props.field ? null : (
                    <PlToggle
                        disabled
                        v-model={row[plc.props.field]}
                        trueValue={props.trueValue}
                        falseValue={props.falseValue}
                    />
                ),
                edit: ({row, plc}) => !plc.props.field ? null : (
                    <PlToggle
                        v-model={row[plc.props.field]}
                        trueValue={props.trueValue}
                        falseValue={props.falseValue}
                    />
                ),
            }
        })
    },
})
