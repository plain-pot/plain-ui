import {defineComponent} from "@vue/composition-api";
import {SlotFunc, useSlots} from "@/use/useSlots";
import {useCollectChild, useCollectParent} from "@/use/useCollect";
import {SELECT_PANEL_PROVIDER} from "@/packages/select/select-utils";
import {useRefer} from "@/use/useRefer";

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

        useCollectChild({provideString: SELECT_PANEL_PROVIDER})
        const items = useCollectParent({sort: true, provideString: SELECT_PANEL_PROVIDER})

        useRefer({
            props,
            items,
        })

        return () => (
            <div class="pl-select-group">
                {(!!$slots.label || !!props.label) && (<div class="pl-select-group-label">{slots.label(props.label)}</div>)}
                <div class="pl-select-group-content">
                    {slots.default()}
                </div>
            </div>
        )
    }
})