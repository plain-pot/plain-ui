import {defineComponent} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";

export default defineComponent({
    name: 'pl-card-content',
    setup() {

        const {slots} = useSlots()

        return () => (
            <div class="pl-card-content">
                {slots.default()}
            </div>
        )
    }
})