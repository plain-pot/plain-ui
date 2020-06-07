import {computed, defineComponent, onMounted} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";
import {useCollectParent} from "@/use/useCollect";
import {SELECT_PANEL_PROVIDER} from "@/packages/select/select-utils";

export default defineComponent({
    name: 'pl-select',
    props: {
        value: {type: [String, Array]},
        multiple: {type: Boolean},
    },
    setup(props) {

        const {slots} = useSlots()
        const items = useCollectParent({sort: false, provideString: SELECT_PANEL_PROVIDER})

        const displayValue = computed(() => {
            for (let i = 0; i < items.value.length; i++) {
                const item = items.value[i];
                if (item.val === props.value) {
                    return item.label
                }
            }
            return null
        })

        return () => (
            <pl-input value={displayValue.value}>
                <template slot="hidden">
                    {slots.default()}
                </template>
            </pl-input>
        )
    },
})