import {computed, defineComponent, getCurrentInstance, inject, onBeforeUnmount, Ref} from "@vue/composition-api";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {STEP_GROUP_PROVIDER} from "@/packages/step/setp-group";
import {SlotFunc, useSlots} from "@/use/useSlots";
import {useCollectChild} from "@/use/useCollect";
import {StepUtils} from "@/packages/step/step-utils";

/**
 * v-if会触发created，会重新刷新index，但是v-show不会，暂时不管v-show
 * @author  韦胜健
 * @date    2020/4/3 10:39
 */

/*节点状态类型*/
export enum StepStatus {
    wait = 'wait',
    finish = 'finish',
    process = 'process',
    error = 'error',
}

export default defineComponent({
    name: 'pl-step',
    props: {
        icon: {type: String},
        status: {type: String},
        title: {type: String},
        content: {type: String},
        val: {type: String},
    },
    setup(props) {

        const ctx = getCurrentInstance()

        const {slots} = useSlots({
            title: SlotFunc,
            content: SlotFunc,
        })

        const {emit} = useEvent({
            click: EmitFunc
        })

        const stepGroup = inject(STEP_GROUP_PROVIDER) as any

        /*---------------------------------------computer-------------------------------------------*/

        const index = computed(() => {
            return stepGroup.items.value.indexOf(ctx) as number
        })

        const icon = computed(() => {
            if (!!props.icon) return props.icon
            return null
        })

        const isLast = computed(() => {
            return index.value === stepGroup.items.value.length - 1
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
            'pl-step',
            `pl-step-status-${currentStatus.value}`,
            {
                'pl-step-has-icon': !!icon.value,
                'pl-step-last': isLast.value,
            }
        ])

        useCollectChild()

        return () => (
            <div class={classes.value} onClick={emit.click}>
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
    },
})