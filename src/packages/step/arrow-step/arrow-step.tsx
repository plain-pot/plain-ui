import {computed, defineComponent, getCurrentInstance, inject, Ref} from "@vue/composition-api";
import {SlotFunc, useSlots} from "@/use/useSlots";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {ARROW_STEP_GROUP_PROVIDER} from "@/packages/step/arrow-step/arrow-step-group";
import {StepStatus} from "@/packages/step/step";
import {useCollectChild} from "@/use/useCollect";
import {StepUtils} from "@/packages/step/step-utils";

export default defineComponent({
    name: 'pl-arrow-step',
    props: {
        status: {type: String},
        title: {type: String},
        val: {type: String},
        hideIndex: {type: Boolean},
    },
    setup: (props) => {

        const ctx = getCurrentInstance()

        const {slots} = useSlots({
            title: SlotFunc,
        })

        const {emit} = useEvent({
            click: EmitFunc
        })

        const stepGroup = inject(ARROW_STEP_GROUP_PROVIDER) as any

        /*---------------------------------------computer-------------------------------------------*/

        const index = computed(() => {
            return stepGroup.items.value.indexOf(ctx) as number
        })

        const isLast = computed(() => {
            return index.value === stepGroup.items.value.length - 1
        })

        const isFirst = computed(() => {
            return index.value === 0
        })

        const currentStatus: Ref<StepStatus | null> = computed(() => {
            return StepUtils.getStepStatus({
                currentIndex: stepGroup.currentIndex,
                currentStatus: stepGroup.props.currentStatus
            }, {
                status: props.status,
                index
            })
        })

        const classes = computed(() => [
            'pl-arrow-step',
            `pl-arrow-step-status-${currentStatus.value}`,
        ])

        useCollectChild()

        return () => (
            index.value != null ? (
                <div class={classes.value} onClick={emit.click}>
                    <div class="pl-arrow-step-content">
                        {!props.hideIndex && <span class="pl-arrow-step-sequence">{index.value + 1}. &nbsp;</span>}
                        <span>{slots.default(props.title)}</span>
                    </div>
                    {!isLast.value ? <pl-triangle direction="right" size={null}/> : null}
                    {!isFirst.value ? [
                        <pl-triangle direction="bottom" half="start" size={null}/>,
                        <pl-triangle direction="top" half="start" size={null}/>
                    ] : null}
                </div>
            ) : <div/>
        )
    },
})