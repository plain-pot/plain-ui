import {designComponent} from "plain-ui-composition";
import {createDefaultFilterConfigProp, PlcEmitsOptions, PlcPropsOptions} from "../PlTable/plc/utils/plc.utils";
import {PlcScopeSlotsOptions} from "../PlTable/plc/utils/plc.scope-slots";
import {useExternalPlc} from "../PlTable/plc/core/useExternalPlc";

import useAddress from "../useAddress";
import PlAddress from "../PlAddress";
import {tDefaultFilterConfigParam} from "../PlFilter/FilterConfig";
import {iAddressService} from "../useAddress/useAddress.utils";

export const PlcAddress = designComponent({
    name: 'plc-address',
    props: {
        ...PlcPropsOptions,
        filterName: {type: String, default: 'address'},
        filterHandler: {type: String, default: '包含'},
        defaultFilterConfig: createDefaultFilterConfigProp((param) => {
            const {config, plc} = param as tDefaultFilterConfigParam
            const {province, city, district} = plc.props as any
            const $address = (plc.refer() as any).$address as iAddressService
            config.province = province
            config.city = city
            config.district = district
            config.$address = $address
        }),

        parentValue: {type: String},                        // 父值
        parentField: {type: String},                        // 父值所在字段名称
        province: {type: Boolean, default: false},          // 是否为选择省份
        city: {type: Boolean, default: false},              // 是否为选择城市
        district: {type: Boolean, default: false},          // 是否为选择区县
    },
    scopeSlots: PlcScopeSlotsOptions,
    emits: PlcEmitsOptions,
    setup({props, scopeSlots, event, slots}) {
        const {$address} = useAddress()

        return useExternalPlc({
            props, slots, scopeSlots, event, defaultScopeSlots: {
                normal: (scope) => {
                    return !scope.plc.props.field ? null : $address.getNameByCodeComputed(scope.row[scope.plc.props.field])
                },
                edit: ({row, plc}) => !plc.props.field ? null : (
                    <PlAddress
                        v-model={row[plc.props.field!]}
                        province={props.province}
                        city={props.city}
                        district={props.district}
                        parentValue={props.parentValue != null ? props.parentValue : (!!props.parentField ? row[props.parentField] : undefined)}
                    />
                ),
            },
            externalRefer: {
                $address
            },
        })
    },
})

export default PlcAddress
