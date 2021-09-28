
import {designComponent} from "plain-design-composition";
import {createPlcPropOptions, PlcEmitsOptions} from "../utils/plc.utils";
import {PlcScopeSlotsOptions} from "../utils/plc.scope-slots";
import {useExternalPlc} from "../core/useExternalPlc";

export default designComponent({
    name: 'plc-index',
    props: {
        ...createPlcPropOptions({
            autoFixedLeft: true,
            order: -9995,
            width: 45,
            align: 'center',
            noPadding: true,
            hideInForm: true,
        }),
        summaryText: {type: String, default: '合计'},
        start: {type: Number, default: 0},
    },
    scopeSlots: {
        ...PlcScopeSlotsOptions,
    },
    emits: {
        ...PlcEmitsOptions,
    },
    setup({props, slots, scopeSlots, event}) {
        return useExternalPlc({
            props, scopeSlots, event, slots, defaultScopeSlots: {
                head: () => '#',
                normal: ({node, plc}) => (plc.props as any).start + node.index + 1,
                summary: () => <span class="plc-index-summary-text">{props.summaryText}</span>,
            }
        })
    },
})
