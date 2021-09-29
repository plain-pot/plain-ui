import {designComponent} from "plain-ui-composition";
import PlObject, {PlObjectPropsOption} from "../PlObject";
import {PlcEmitsOptions, PlcPropsOptions} from "../PlTable/plc/utils/plc.utils";
import {PlcScopeSlotsOptions} from "../PlTable/plc/utils/plc.scope-slots";
import {useExternalPlc} from "../PlTable/plc/core/useExternalPlc";


export const PlcObject = designComponent({
    name: 'plc-object',
    props: {
        ...PlcPropsOptions,
        ...PlObjectPropsOption,
    },
    scopeSlots: PlcScopeSlotsOptions,
    emits: PlcEmitsOptions,
    setup({props, slots, scopeSlots, event}) {
        return useExternalPlc({
            props, scopeSlots, slots, event, defaultScopeSlots: {
                edit: ({row, plc}) => !plc.props.field ? null :
                    <PlObject
                        {...Object.keys(PlObjectPropsOption).reduce((prev, key) => {
                            prev[key] = (props as any)[key]
                            return prev
                        }, {} as Record<string, any>)}
                        showKey={plc.props.field}
                        row={row}
                    />
            }
        })
    },
})

export default PlcObject
