import {designComponent} from "plain-ui-composition";
import {PlcEmitsOptions, PlcPropsOptions} from "../utils/plc.utils";

import {PlcScopeSlotsOptions} from "../utils/plc.scope-slots";
import {useBasePlc} from "./useBasePlc";
import {applyPropsState, getPropsState} from "../utils/usePropsState";

export const Plc = designComponent({
    name: 'plc',
    props: PlcPropsOptions,
    scopeSlots: PlcScopeSlotsOptions,
    emits: PlcEmitsOptions,
    setup({props, slots, scopeSlots, event}) {
        return useBasePlc({props, scopeSlots, event, slots})
    },
    expose: {
        applyPropsState,
        getPropsState,
    },
})

export default Plc
