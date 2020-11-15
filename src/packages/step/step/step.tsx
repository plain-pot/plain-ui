import {designComponent} from "../../../use/designComponent";
import {useSlots} from "../../../use/useSlots";
import {computed, getCurrentInstance, Ref} from 'vue';
import {StepStatus, StepUtils} from "../step.utils";
import {StepCollector} from "./step-group";
import {useRefs} from "../../../use/useRefs";

export const Step = designComponent({
    name: 'pl-step',
    props: {
        icon: {type: String},
        status: {type: String},
        title: {type: String},
        content: {type: String},
        val: {type: String},
    },
    emits: {
        click: (e: MouseEvent) => true,
    },
    setup({props, event: {emit}}) {
        const {refs} = useRefs({
            el: HTMLDivElement
        })
        const {slots} = useSlots(['title', 'content'])
        const stepGroup = StepCollector.child({sort: () => refs.el})
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

        const currentStatus: Ref<StepStatus | null> = computed(() => {
            return StepUtils.getStepStatus({
                currentIndex: stepGroup.currentIndex as any,
                currentStatus: stepGroup.props.currentStatus as any
            }, {
                status: props.status as any,
                index
            })
        })


        const classes = computed(() => [
            'pl-step',
            `pl-step-status-${currentStatus.value}`,
            {
                'pl-step-has-icon': !!icon.value,
                'pl-step-last': isLast.value,
            }
        ])

        return {
            refer: {},
            render: () => (
                <div class={classes.value} onClick={emit.click} ref="el">
                    <div class="pl-step-head">
                        {!stepGroup.props.vertical && (stepGroup.isTitleAlignBottom.value || isLast.value) && <span class="pl-step-divider pl-step-divider-prev" v-if=""/>}
                        <span class="pl-step-icon">
                        {
                            !!icon.value ?
                                (currentStatus.value !== 'process' ? <pl-icon icon={icon.value}/> : <pl-loading type="delta"/>)
                                :
                                (
                                    !!stepGroup.props.dotIcon ?
                                        (<span class="pl-step-dot"/>)
                                        :
                                        (
                                            <span class="pl-step-number">
                                                {currentStatus.value === StepStatus.finish ?
                                                    <pl-icon icon="el-icon-check"/>
                                                    :
                                                    (currentStatus.value === StepStatus.error ?
                                                            <pl-icon icon="el-icon-close"/>
                                                            :
                                                            <span v-else>{index.value + 1}</span>
                                                    )
                                                }
                                            </span>
                                        )
                                )
                        }
                    </span>
                        {!stepGroup.isTitleAlignBottom.value && (
                            <span class="pl-step-title">
                            {slots.title(props.title)}
                        </span>
                        )}
                        {(stepGroup.isTitleAlignBottom.value || !isLast.value) && <span class="pl-step-divider pl-step-divider-next"/>}
                    </div>
                    <div class="pl-step-body">
                        {!stepGroup.isTitleAlignBottom.value ?
                            <span class="pl-step-icon"/>
                            :
                            <span class="pl-step-title">
                            {slots.title(props.title)}
                        </span>
                        }
                        <span class="pl-step-content">
                        {slots.content(props.content)}
                    </span>
                    </div>
                </div>
            )
        }
    },
})