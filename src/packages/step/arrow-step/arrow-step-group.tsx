import {computed, defineComponent, provide, reactive} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";
import {StepUtils} from "@/packages/step/step-utils";
import {useCollectParent} from "@/use/useCollect";

export const ARROW_STEP_GROUP_PROVIDER = '@@ARROW_STEP_GROUP_PROVIDER'

export default defineComponent({
    name: 'pl-arrow-step-group',
    props: {
        current: {},
        currentStatus: {type: String},

    },
    setup: (props) => {

        const {slots} = useSlots()
        const items = useCollectParent()
        const currentIndex = computed(() => StepUtils.getCurrentIndex(props.current, items.value))

        provide(ARROW_STEP_GROUP_PROVIDER, {
            items,
            currentIndex,
            props,
        })

        return () => (
            <div class="pl-arrow-step-group">
                {slots.default()}
            </div>
        )
    }
})