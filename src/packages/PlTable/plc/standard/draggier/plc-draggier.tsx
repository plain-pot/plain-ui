import {useListDraggier} from "./core";
import {ie} from "plain-utils/utils/ie";
import {useTableGetScroll} from "../../../table/use/useTableGetScroll";
import {injectPlainTable} from "../../../index";
import {computed, designComponent} from "plain-ui-composition";
import PlButton from "../../../../PlButton";

import {createPlcPropOptions, PlcEmitsOptions} from "../../utils/plc.utils";
import {PlcScopeSlotsOptions} from "../../utils/plc.scope-slots";
import {useExternalPlc} from "../../core/useExternalPlc";

export default designComponent({
    name: 'plc-draggier',
    props: createPlcPropOptions({
        autoFixedLeft: true,
        order: -9998,
        width: 40,
        align: 'center',
        noPadding: true,
        hideInForm: true,
    }),
    emits: PlcEmitsOptions,
    scopeSlots: PlcScopeSlotsOptions,
    setup({props, slots, scopeSlots, event}) {
        const table = injectPlainTable()
        const {getScroll} = useTableGetScroll(table.event.on.onVirtualMounted)
        const handler = computed(() => useListDraggier({
            virtual: !table.disabledVirtual.value && !ie,
            // virtual: true,
            rowClass: 'plt-row',
            getScroll,
            onChange: async (start, end) => {
                table.dataModel.value!.splice(end, 0, table.dataModel.value!.splice(start, 1)[0])
            },
        }))

        const onClick = (e: MouseEvent) => {
            e.stopPropagation()
            e.preventDefault()
        }

        return useExternalPlc({
            props, scopeSlots, slots, event, defaultScopeSlots: {
                normal: () => <PlButton
                    icon="el-icon-list"
                    mode="text"
                    class="plc-draggier-handler"
                    onMousedown={handler.value.handler.mousedown}
                    onClick={onClick}
                />
            }
        })
    },
})
