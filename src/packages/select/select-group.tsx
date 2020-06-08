import {computed, defineComponent, inject} from "@vue/composition-api";
import {SlotFunc, useSlots} from "@/use/useSlots";
import {useCollectChild, useCollectParent} from "@/use/useCollect";
import {SELECT_PANEL_COLLECTOR} from "@/packages/select/select-utils";
import {useRefer} from "@/use/useRefer";
import {SELECT_PANEL_PROVIDER, SelectPanelContextType} from "@/packages/select/select-panel";

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

        const selectPanel = inject(SELECT_PANEL_PROVIDER) as SelectPanelContextType
        useCollectChild({provideString: SELECT_PANEL_COLLECTOR})
        const items = useCollectParent({sort: true, provideString: SELECT_PANEL_COLLECTOR})
        const isShow = computed(() => !!selectPanel && items.value.length > 0 && items.value.some(item => selectPanel.utils.isShow(item)))

        const classes = computed(() => [
            'pl-select-group',
            {
                'pl-select-group-show': isShow.value
            }
        ])

        useRefer({
            props,
            items,
        })

        return () => (
            <div class={classes.value}>
                {!!selectPanel && isShow.value && (!!$slots.label || !!props.label) && (<div class="pl-select-group-label">{slots.label(props.label)}</div>)}
                <div class="pl-select-group-content">
                    {slots.default()}
                </div>
            </div>
        )
    }
})