import {defineComponent} from "@vue/composition-api";
import {useCollectParent} from "@/use/useCollect";
import {PLC_COLLECTOR} from "@/packages/table/plc/plc-utils";
import {useSlots} from "@/use/useSlots";
import {useRefer} from "@/use/useRefer";

export default defineComponent({
    name: 'plc-collector',
    setup() {
        const items = useCollectParent({sort: true, provideString: PLC_COLLECTOR})

        const {slots} = useSlots()

        const refer = {
            items,
        }

        useRefer(refer)

        return () => (
            <div class="plc-collector">
                {slots.default()}
            </div>
        )
    },
})