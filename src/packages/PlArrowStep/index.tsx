import {computed, designComponent, useClasses, useRefs} from "plain-ui-composition";
import {ArrowStepCollector} from "../PlArrowStepGroup";
import {StepStatus, StepUtils} from "../PlStepGroup/step.utils";

import PlTriangle from "../PlTriangle";
import {getCurrentInstance} from "vue";

export const PlArrowStep = designComponent({
    name: 'pl-arrow-step',
    props: {
        status: {type: String},
        title: {type: String},
        val: {type: String},
        hideIndex: {type: Boolean},
    },
    inheritPropsType: HTMLDivElement,
    slots: ['default'],
    setup({props, slots}) {
        const ctx = getCurrentInstance()!
        const {refs, onRef} = useRefs({el: HTMLDivElement})
        const stepGroup = ArrowStepCollector.child({sort: () => refs.el!})
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

        const currentStatus: { value: StepStatus | null } = computed(() => {
            return StepUtils.getStepStatus({
                currentIndex: stepGroup.currentIndex as any,
                currentStatus: stepGroup.props.currentStatus as any
            }, {
                status: props.status as any,
                index: index as any
            })
        })

        const classes = useClasses(() => [
            'pl-arrow-step',
            `pl-arrow-step-status-${currentStatus.value}`,
        ])

        return {
            refer: {
                refs,
                props,
            },
            render: () => (
                index.value != null ? (
                    <div class={classes.value} ref={onRef.el}>
                        <div class="pl-arrow-step-content">
                            {!props.hideIndex && <span class="pl-arrow-step-sequence">{index.value + 1}. &nbsp;</span>}
                            <span>{slots.default() || props.title}</span>
                        </div>
                        {!isLast.value && <PlTriangle direction="right" size={null as any}/>}
                        {!isFirst.value && <>
                            <PlTriangle direction="bottom" half="start" size={null as any}/>
                            <PlTriangle direction="top" half="start" size={null as any}/>
                        </>}
                    </div>
                ) : <div/>
            )
        }
    },
})

export default PlArrowStep
