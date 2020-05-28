import {defineComponent} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";

export default defineComponent({
    name: 'pl-card-header',
    setup() {

        const {slots} = useSlots()

        return () => (
            <div class="pl-card-header">
                {slots.default()}
            </div>
        )
    }
})