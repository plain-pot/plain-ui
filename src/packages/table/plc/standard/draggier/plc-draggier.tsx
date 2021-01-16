import {designPlc} from "../../core/designPlc";
import {injectPlainTable} from "../../../table";
import {computed} from 'vue';
import {useListDraggier} from "./core";
import {ie} from "plain-utils/utils/ie";
import {useTableGetScroll} from "../../../core/useTableGetScroll";
import {PlButton} from "../../../../button/button";

export default designPlc({
    name: 'plc-draggier',
    standardProps: {
        autoFixedLeft: {default: true},
        order: {default: -9998},
        width: {default: 40},
        align: {default: 'center'},
        noPadding: {type: Boolean, default: true},
    },
    setup: (props) => {
        const {disabledVirtual, dataModel, event} = injectPlainTable()
        const {getScroll} = useTableGetScroll(event.on.onVirtualMounted)
        const handler = computed(() => useListDraggier({
            virtual: !disabledVirtual.value && !ie,
            // virtual: true,
            rowClass: 'plt-row',
            getScroll,
            onChange: async (start, end) => {
                dataModel.value!.splice(end, 0, dataModel.value!.splice(start, 1)[0])
            },
        }))
        return {
            onMousedown: handler.value.handler.mousedown,
            onClick: (e: MouseEvent) => {
                e.stopPropagation()
                e.preventDefault()
            },
        }
    }
}, {
    default: ({refer}) => <PlButton
        icon="el-icon-list"
        mode="text"
        class="plc-draggier-handler"
        {...refer}
    />
})