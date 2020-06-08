import {defineComponent, inject} from "@vue/composition-api";
import {SlotFunc, useSlots} from "@/use/useSlots";
import {useCollectChild, useCollectParent} from "@/use/useCollect";
import {SELECT_PANEL_COLLECTOR} from "@/packages/select/select-utils";
import {useRefer} from "@/use/useRefer";
import {I_AM_SELECT_PANEL} from "@/packages/select/select-panel";

export default defineComponent({
    name: 'pl-select-group',
    props: {
        label: {type: String},

        group: {type: Boolean, default: true},
    },
    setup(props) {

        const {slots, $slots} = useSlots({
            label: SlotFunc,
        })

        const underPanelFlag = inject(I_AM_SELECT_PANEL)
        useCollectChild({provideString: SELECT_PANEL_COLLECTOR})
        const items = useCollectParent({sort: true, provideString: SELECT_PANEL_COLLECTOR})

        useRefer({
            props,
            items,
        })

        return () => (
            <div class="pl-select-group">
                {underPanelFlag && (!!$slots.label || !!props.label) && (<div class="pl-select-group-label">{slots.label(props.label)}</div>)}
                <div class="pl-select-group-content">
                    {slots.default()}
                </div>
            </div>
        )
    }
})