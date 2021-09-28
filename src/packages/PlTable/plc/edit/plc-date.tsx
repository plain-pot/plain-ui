import PlDate from "../../../PlDate";

import {designComponent, PropType} from "plain-design-composition";
import {createDefaultFilterConfigProp, PlcEmitsOptions, PlcPropsOptions} from "../utils/plc.utils";
import {PlcScopeSlotsOptions} from "../utils/plc.scope-slots";
import {useExternalPlc} from "../core/useExternalPlc";
import {tDefaultFilterConfigParam} from "../../../PlFilter/FilterConfig";
import {DatePanel} from "../../../PlDate/date.utils";
// import {PlDate} from "../../../date/date";

const InheritProps = {
    datetime: {type: Boolean},
    displayFormat: {type: String},                                              // 显示值格式化字符串
    valueFormat: {type: String},                                                // 值格式化字符串
    max: {type: String},                                                        // 最大值
    min: {type: String},                                                        // 最小值
    panel: {type: String as PropType<keyof typeof DatePanel>, default: DatePanel.date},
}

export default designComponent({
    name: 'plc-date',
    props: {
        ...PlcPropsOptions,
        filterName: {type: String, default: 'date'},
        filterHandler: {type: String, default: '范围'},
        defaultFilterConfig: createDefaultFilterConfigProp((data) => {
            const {config, plc} = data as tDefaultFilterConfigParam
            if (config.datetime == null) {
                config.datetime = (plc.props as any).datetime
            }
        }),

        ...InheritProps,
    },
    scopeSlots: PlcScopeSlotsOptions,
    emits: PlcEmitsOptions,
    setup({props, slots, scopeSlots, event}) {
        return useExternalPlc({
            props, scopeSlots, slots, event, defaultScopeSlots: {
                edit: ({row, plc}) => !plc.props.field ? null : <PlDate
                    v-model={row[plc.props.field]}
                    {...Object.keys(InheritProps).reduce((prev, key) => (prev[key] = (props as any)[key], prev), {} as Record<string, any>)}
                />
            }
        })
    },
})
