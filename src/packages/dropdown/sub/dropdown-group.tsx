import {defineComponent} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";

export default defineComponent({
    name: 'pl-dropdown-group',
    props: {
        label: {type: String}
    },
    setup(props,) {

        const {slots} = useSlots()

        return () => {
            return (
                <div class={"pl-dropdown-group"}>
                    {!!props.label && (
                        <div class={"pl-dropdown-group-label"}>
                            {props.label}
                        </div>
                    )}
                    {slots.default()}
                </div>
            )
        }
    },
})