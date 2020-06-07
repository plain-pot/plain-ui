import {defineComponent} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";

export default defineComponent({
    name: 'pl-select-panel',
    props: {},
    setup(props) {

        const {slots} = useSlots()

        return () => (
            <div class="pl-select-panel">
                {slots.default()}
            </div>
        )
    },
})