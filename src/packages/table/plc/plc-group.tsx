import {defineComponent} from "@vue/composition-api";
import {PLC_COLLECTOR, PlcGroupProps, PlcType} from "@/packages/table/plc/plc-utils";
import {useSlots} from "@/use/useSlots";
import {useCollectChild, useCollectParent} from "@/use/useCollect";
import {useRefer} from "@/use/useRefer";

export default defineComponent({
    name: 'plc-group',
    props: {
        ...PlcGroupProps,
    },
    setup(props) {

        const {slots} = useSlots()

        useCollectChild({provideString: PLC_COLLECTOR})
        const items = useCollectParent({sort: true, provideString: PLC_COLLECTOR})

        const refer = {
            items,
            type: PlcType.GROUP
        }

        useRefer(refer)

        return () => (
            <div class="plc-group">
                {slots.default()}
            </div>
        )
    },
})