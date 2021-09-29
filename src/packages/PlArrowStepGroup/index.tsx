import './arrow-step.scss'
import {useCollect} from "../../use/useCollect";
import {PlArrowStep} from "../PlArrowStep";
import {computed, InheritHtmlElement, designComponent, reactive, useRefs} from "plain-ui-composition";
import {StepUtils} from "../PlStepGroup/step.utils";
import PlDialog from "../PlDialog";

export const PlArrowStepGroup = designComponent({
    name: 'pl-arrow-step-group',
    props: {
        current: {},
        currentStatus: {type: String},
    },
    inheritPropsType: InheritHtmlElement,
    slots: ['default'],
    setup({props, slots}) {
        const {refs, onRef} = useRefs({
            el: HTMLDivElement,
        })
        const dialog = PlDialog.use.inject(null)
        const state = reactive({
            showContent: !dialog || dialog.model.value,
        })
        if (!!dialog) {
            dialog.event.on.onOpen(() => {
                state.showContent = true
            })
        }
        const items = ArrowStepCollector.parent() as any[]
        const currentIndex = computed(() => StepUtils.getCurrentIndex(props.current, items)) as { value: number }
        return {
            refer: {
                props,
                currentIndex,
                items,
                refs,
            },
            render: () => (
                <div class="pl-arrow-step-group" ref={onRef.el}>
                    {state.showContent && slots.default()}
                </div>
            )
        }
    },
})

export default PlArrowStepGroup

export const ArrowStepCollector = useCollect(() => ({
    parent: PlArrowStepGroup,
    child: PlArrowStep,
}))
