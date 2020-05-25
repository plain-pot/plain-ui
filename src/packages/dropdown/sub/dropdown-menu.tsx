import {defineComponent} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";

export default defineComponent({
    name: 'pl-dropdown-menu',
    setup() {

        const {slots} = useSlots()

        return () => {
            return (
                <div class={"pl-dropdown-menu"}>
                    {slots.default()}
                </div>
            )
        }
    },
})