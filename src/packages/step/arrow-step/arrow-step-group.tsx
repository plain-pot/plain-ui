import {designComponent} from "../../../use/designComponent";
import {useSlots} from "../../../use/useSlots";
import {computed} from 'vue';
import {StepUtils} from "../step.utils";
import {useCollect} from "../../../use/useCollect";
import {ArrowStep} from "./arrow-step";
import './arrow-step.scss'

export const ArrowStepGroup = designComponent({
    name: 'pl-arrow-step-group',
    props: {
        current: {},
        currentStatus: {type: String},
    },
    setup({props}) {
        const {slots} = useSlots()
        const items = ArrowStepCollector.parent() as any[]
        const currentIndex = computed(() => StepUtils.getCurrentIndex(props.current, items)) as { value: number }
        return {
            refer: {
                props,
                currentIndex,
                items,
            },
            render: () => (
                <div class="pl-arrow-step-group">
                    {slots.default()}
                </div>
            )
        }
    },
})

export const ArrowStepCollector = useCollect(() => ({
    parent: ArrowStepGroup,
    child: ArrowStep,
}))