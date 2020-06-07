import {defineComponent, provide} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";
import {useCollectParent} from "@/use/useCollect";
import {SELECT_PANEL_PROVIDER} from "@/packages/select/select-utils";

export const I_AM_SELECT_PANEL = '@@I_AM_SELECT_PANEL'

export default defineComponent({
    name: 'pl-select-panel',
    props: {},
    setup(props) {

        const {slots} = useSlots()
        provide(I_AM_SELECT_PANEL, true)

        const items = useCollectParent({sort: true, provideString: SELECT_PANEL_PROVIDER})

        return () => (
            <div class="pl-select-panel">
                {slots.default()}
            </div>
        )
    },
})