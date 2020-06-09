import {defineComponent} from "@vue/composition-api";
import {PlcGroupProps} from "@/packages/table/plc/plc-utils";
import {useSlots} from "@/use/useSlots";

export default defineComponent({
    name: 'plc-group',
    props: {
        ...PlcGroupProps,
    },
    setup(props) {

        const {slots} = useSlots()

        return () => (
            <div class="plc-group">
                {slots.default()}
            </div>
        )
    },
})