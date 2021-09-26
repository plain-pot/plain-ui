import {computed, designComponent, getCurrentInstance, useRefs} from "plain-ui-composition";
import {StepStatus, StepUtils} from "../PlStepGroup/step.utils";
import {useClasses} from "plain-ui-composition";

import PlIcon from "../PlIcon";
import PlLoading from "../PlLoading";
import {StepCollector} from "../PlStepGroup";

export const PlStep = designComponent({
    name: 'pl-step',
    props: {
        icon: {type: String},
        status: {type: String},
        val: {type: String},
    },
    emits: {
        onClick: (e: MouseEvent) => true,
    },
    inheritPropsType: HTMLDivElement,
    slots: ['title', 'content', 'default'],
    setup({props, event: {emit}, slots}) {
        const {refs, onRef} = useRefs({
            el: HTMLDivElement
        })
        const stepGroup = StepCollector.child({sort: () => refs.el!})
        const ctx = getCurrentInstance()!

        /*---------------------------------------computer-------------------------------------------*/

        const index = computed(() => stepGroup.items.indexOf(ctx.proxy))

        const icon = computed(() => {
            if (!!props.icon) return props.icon
            return null
        })

        const isLast = computed(() => {
            return index.value === stepGroup.items.length - 1
        })

        const currentStatus: { value: StepStatus | null } = computed(() => {
            return StepUtils.getStepStatus({
                currentIndex: stepGroup.currentIndex as any,
                currentStatus: stepGroup.props.currentStatus as any
            }, {
                status: props.status as any,
                index
            })
        })


        const classes = useClasses(() => [
            'pl-step',
            `pl-step-status-${currentStatus.value}`,
            {
                'pl-step-has-icon': !!icon.value,
                'pl-step-last': isLast.value,
            }
        ])

        return {
            refer: {
                props,
                refs,
            },
            render: () => (
                <div class={classes.value} onClick={emit.onClick} ref={onRef.el}>
                    <div class="pl-step-head">
                        {!stepGroup.props.vertical && (stepGroup.isTitleAlignBottom.value || isLast.value) && <span class="pl-step-divider pl-step-divider-prev"/>}
                        <span class="pl-step-icon">
                        {
                            !!icon.value ?
                                (currentStatus.value !== 'process' ? <PlIcon icon={icon.value}/> : <PlLoading type="delta"/>)
                                :
                                (
                                    !!stepGroup.props.dotIcon ?
                                        (<span class="pl-step-dot"/>)
                                        :
                                        (
                                            <span class="pl-step-number">
                                                {currentStatus.value === StepStatus.finish ?
                                                    <PlIcon icon="el-icon-check"/>
                                                    :
                                                    (currentStatus.value === StepStatus.error ?
                                                            <PlIcon icon="el-icon-close"/>
                                                            :
                                                            <span>{index.value + 1}</span>
                                                    )
                                                }
                                            </span>
                                        )
                                )
                        }
                    </span>
                        {!stepGroup.isTitleAlignBottom.value && (
                            <span class="pl-step-title">
                            {slots.title()}
                        </span>
                        )}
                        {(stepGroup.isTitleAlignBottom.value || !isLast.value) && <span class="pl-step-divider pl-step-divider-next"/>}
                    </div>
                    <div class="pl-step-body">
                        {!stepGroup.isTitleAlignBottom.value ?
                            <span class="pl-step-icon"/>
                            :
                            <span class="pl-step-title">
                            {slots.title()}
                        </span>
                        }
                        <span class="pl-step-content">
                        {slots.content()}
                    </span>
                    </div>
                </div>
            )
        }
    },
})

export default PlStep
