import PlSelect from "../../../PlSelect";
import {designComponent} from "plain-ui-composition";
import {createDefaultFilterConfigProp, PlcEmitsOptions, PlcPropsOptions} from "../utils/plc.utils";
import {PlcScopeSlotsOptions} from "../utils/plc.scope-slots";
import {useExternalPlc} from "../core/useExternalPlc";
import {tDefaultFilterConfigParam} from "../../../PlFilter/FilterConfig";
import {toArray} from "plain-utils/utils/toArray";

export default designComponent({
    name: 'plc-select',
    props: {
        ...PlcPropsOptions,
        filterName: {type: String, default: 'select'},
        filterHandler: {type: String, default: '包含'},
        defaultFilterConfig: createDefaultFilterConfigProp((data) => {
            const {config, plc} = data as tDefaultFilterConfigParam
            if (!config.options) {
                config.options = () => {
                    if (plc.slots.options.isExist()) {
                        return plc.slots.options()
                    } else {
                        return plc.slots.default(undefined)
                    }
                }
            }
        }),
    },
    scopeSlots: PlcScopeSlotsOptions,
    emits: PlcEmitsOptions,
    slots: ['default', 'options'],
    setup({props, scopeSlots, event, slots}) {
        return useExternalPlc({
            props, slots, scopeSlots, event, defaultScopeSlots: {
                summary: () => null,
                normal: (scope) => {
                    if (!props.field) {return null}
                    const val = scope.row[props.field]

                    let content = toArray(scopeSlots.normal.isExist() ? scopeSlots.normal(scope) : slots.default())
                    // const children = (isFragment(content) ? content.props.children : content) as ReactElement[]
                    const children = content
                    const selectedOption: any = !children ? null : children.find((child: any) => !!child && typeof child === "object" && child.props.val === val)
                    return !selectedOption ? val : (selectedOption.children.default() || selectedOption.props.label)
                },
                edit: ({row, plc, node}) => !plc.props.field ? null : (
                    <PlSelect v-model={row[plc.props.field]}>
                        {scopeSlots.normal.isExist() ? scopeSlots.normal({plc, node, row}) : slots.default()}
                    </PlSelect>
                ),
            }
        })
    },
})
