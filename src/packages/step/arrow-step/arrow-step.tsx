import {computed, defineComponent, inject, onBeforeUnmount, reactive, Ref} from "@vue/composition-api";
import {useRefs} from "@/use/useRefs";
import {SlotFunc, useSlots} from "@/use/useSlots";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {ARROW_STEP_GROUP_PROVIDER} from "@/packages/step/arrow-step/arrow-step-group";
import {StepStatus} from "@/packages/step/step";
import {$plain} from "@/packages/base";
import {useRefer} from "@/use/useRefer";

export default defineComponent({
    name: 'pl-arrow-step',
    props: {
        status: {type: String},
        title: {type: String},
        val: {type: String},
        hideIndex: {type: Boolean},
    },
    setup: (props) => {

        const refs = useRefs()

        const {slots} = useSlots({
            title: SlotFunc,
        })

        const {emit} = useEvent({
            click: EmitFunc
        })

        const state = reactive({
            index: null as null | number,
        })

        const stepGroup = inject(ARROW_STEP_GROUP_PROVIDER) as any

        /*---------------------------------------computer-------------------------------------------*/

        const isLast = computed(() => {
            return state.index === stepGroup.state.items.length
        })

        const isFirst = computed(() => {
            return state.index === 1
        })

        const currentStatus: Ref<StepStatus | null> = computed(() => {
            if (!!props.status) return props.status as StepStatus
            if (stepGroup.currentIndex.value > state.index!) {
                return StepStatus.finish
            } else if (stepGroup.currentIndex.value === state.index!) {
                if (!!stepGroup.props.currentStatus) {
                    return stepGroup.props.currentStatus as StepStatus
                } else {
                    return StepStatus.process
                }
            } else if (stepGroup.currentIndex.value < state.index!) {
                return StepStatus.wait
            } else {
                return null
            }
        })

        const classes = computed(() => [
            'pl-arrow-step',
            `pl-arrow-step-status-${currentStatus.value}`,
        ])

        const utils = {
            refreshIndex: async () => {
                await $plain.nextTick()

                state.index = Array
                    .from(refs.$el!.parentNode!.childNodes)
                    .filter((item: any) => item.nodeName !== '#comment' && (!item.style || item.style.display !== 'none'))
                    .indexOf(refs.$el) + 1
            }
        }

        const ctx = useRefer({
            state,
            utils,
        })

        stepGroup.utils.addItem(ctx)

        onBeforeUnmount(() => {
            stepGroup.utils.removeItem(ctx)
        })

        return () => (
            state.index != null ? (
                <div class={classes.value} onClick={emit.click}>
                    <div class="pl-arrow-step-content">
                        {!props.hideIndex && <span class="pl-arrow-step-sequence">{state.index}. &nbsp;</span>}
                        <span>{slots.default(props.title)}</span>
                    </div>
                    {!isLast.value ? <pl-triangle direction="right" size={20}/> : null}
                    {!isFirst.value ? [
                        <pl-triangle direction="bottom" half="start" size={20}/>,
                        <pl-triangle direction="top" half="start" size={20}/>
                    ] : null}
                </div>
            ) : <div/>
        )
    },
})