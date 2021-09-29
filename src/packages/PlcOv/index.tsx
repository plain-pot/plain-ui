import {designComponent} from "plain-ui-composition";
import {createDefaultFilterConfigProp, PlcEmitsOptions, PlcPropsOptions} from "../PlTable/plc/utils/plc.utils";
import {PlObjectPropsOption} from "../PlObject";
import {useExternalPlc} from "../PlTable/plc/core/useExternalPlc";
import {PlcScopeSlotsOptions} from "../PlTable/plc/utils/plc.scope-slots";
import useOv from "../useOv";
import PlOv from "../PlOv";

import {tDefaultFilterConfigParam} from "../PlFilter/FilterConfig";
import {iOvService} from "../useOv/useOv.utils";

export const PlcOv = designComponent({
    name: 'plc-ov',
    props: {
        ...PlcPropsOptions,
        ...PlObjectPropsOption,
        filterName: {type: String, default: 'ov'},
        filterHandler: {type: String, default: '包含'},
        defaultFilterConfig: createDefaultFilterConfigProp((param) => {
            const {config, plc} = param as tDefaultFilterConfigParam
            const {ov} = plc.props as any
            const $ov = (plc.refer() as any).$ov as iOvService
            config.ov = ov
            config.$ov = $ov
        }),

        ov: {type: String},
    },
    scopeSlots: PlcScopeSlotsOptions,
    emits: PlcEmitsOptions,
    setup({props, slots, scopeSlots, event}) {

        const {$ov} = useOv()

        return useExternalPlc({
            props,
            slots,
            scopeSlots,
            event,
            externalRefer: {
                $ov,
            },
            defaultScopeSlots: {
                normal: ({row, plc}) => !plc.props.field || !props.ov || !row[plc.props.field] ? '' : $ov.getNameByTypeAndCodeComputed(props.ov, row[plc.props.field]),
                edit: ({row, plc}) => !plc.props.field || !props.ov ? null : <PlOv v-model={row[plc.props.field]} ov={props.ov}/>
            }
        })
    },
})

export default PlcOv
