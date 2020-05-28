import {defineComponent} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";

export default defineComponent({
    name: 'pl-arrow-step-group',
    props: {},
    setup: (props) => {

        const {slots} = useSlots()

        return () => (
            <div>
                {slots.default()}
            </div>
        )
    }
})