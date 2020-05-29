import {computed, defineComponent, provide, reactive} from "@vue/composition-api";
import {useSlots} from "@/use/useSlots";
import {StepUtils} from "@/packages/step/step-utils";

export const ARROW_STEP_GROUP_PROVIDER = '@@ARROW_STEP_GROUP_PROVIDER'

export default defineComponent({
    name: 'pl-arrow-step-group',
    props: {
        current: {},
        currentStatus: {type: String},

    },
    setup: (props) => {

        const {slots} = useSlots()
        const state = reactive({
            items: [] as any[],
        })

        const currentIndex = computed(() => StepUtils.getCurrentIndex(props.current, state.items))

        const utils = StepUtils.getStepUtils(state.items)

        provide(ARROW_STEP_GROUP_PROVIDER, {
            state,
            utils,
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