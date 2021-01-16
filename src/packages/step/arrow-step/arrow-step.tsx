import {designComponent} from "../../../use/designComponent";
import {getCurrentInstance, computed, Ref} from 'vue';
import {useSlots} from "../../../use/useSlots";
import {StepStatus, StepUtils} from "../step.utils";
import {ArrowStepCollector} from "./arrow-step-group";
import {useRefs} from "../../../use/useRefs";

export const PlArrowStep = designComponent({
    name: 'pl-arrow-step',
    props: {
        status: {type: String},
        title: {type: String},
        val: {type: String},
        hideIndex: {type: Boolean},
    },
    emits: {
        onClick: (e: MouseEvent) => true,
    },
    setup({props, event: {emit}}) {
        const ctx = getCurrentInstance()!
        const {slots} = useSlots(['title'])
        const {refs} = useRefs({el: HTMLDivElement})
        const stepGroup = ArrowStepCollector.child({sort: () => refs.el})
        /*---------------------------------------computer-------------------------------------------*/

        const index = computed(() => {
            return stepGroup.items.indexOf(ctx.proxy)
        }) as { value: number }

        const isLast = computed(() => {
            return index.value === stepGroup.items.length - 1
        })

        const isFirst = computed(() => {
            return index.value === 0
        })

        const currentStatus: Ref<StepStatus | null> = computed(() => {
            return StepUtils.getStepStatus({
                currentIndex: stepGroup.currentIndex as any,
                currentStatus: stepGroup.props.currentStatus as any
            }, {
                status: props.status as any,
                index: index as any
            })
        })

        const classes = computed(() => [
            'pl-arrow-step',
            `pl-arrow-step-status-${currentStatus.value}`,
        ])

        return {
            refer: {},
            render: () => (
                index.value != null ? (
                    <div class={classes.value} onClick={emit.onClick} ref="el">
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
        }
    },
})