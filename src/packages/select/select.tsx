import {defineComponent, onMounted} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";
import {useCollectParent} from "@/use/useCollect";

export default defineComponent({
    name: 'pl-select',
    props: {
        value: {type: [String, Array]},
        multiple: {type: Boolean},
    },
    setup(props) {

        const {slots} = useSlots()
        const items = useCollectParent(true)

        onMounted(() => {
            console.log(items.value)
        })

        return () => (
            <pl-input>
                <div slot="hidden">
                    {slots.default()}
                </div>
            </pl-input>
        )
    },
})