import {computed, defineComponent, inject, onBeforeUnmount, reactive, Ref} from "@vue/composition-api";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {STEP_GROUP_PROVIDER} from "@/packages/step/setp-group";
import {$plain} from "@/packages/base";
import {useRefs} from "@/use/useRefs";
import {useRefer} from "@/use/useRefer";
import {SlotFunc, useSlots} from "@/use/useSlots";

/**
 * v-if会触发created，会重新刷新index，但是v-show不会，暂时不管v-show
 * @author  韦胜健
 * @date    2020/4/3 10:39
 */

/*节点状态类型*/
enum STATUS {
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

        const refs = useRefs()

        const {slots} = useSlots({
            title: SlotFunc,
            content: SlotFunc,
        })

        const {emit} = useEvent({
            click: EmitFunc
        })

        const state = reactive({
            index: null as null | number,
        })

        const stepGroup = inject(STEP_GROUP_PROVIDER) as any

        /*---------------------------------------computer-------------------------------------------*/

        const icon = computed(() => {
            if (!!props.icon) return props.icon
            return null
        })

        const isLast = computed(() => {
            return state.index === stepGroup.state.items.length
        })

        /*const isFirst = computed(() => {
            return state.index === 1
        })*/

        const currentStatus: Ref<STATUS | null> = computed(() => {
            if (!!props.status) return props.status as STATUS
            if (stepGroup.currentIndex.value > state.index!) {
                return STATUS.finish
            } else if (stepGroup.currentIndex.value === state.index!) {
                if (!!stepGroup.props.currentStatus) {
                    return stepGroup.props.currentStatus as STATUS
                } else {
                    return STATUS.process
                }
            } else if (stepGroup.currentIndex.value < state.index!) {
                return STATUS.wait
            } else {
                return null
            }
        })


        const classes = computed(() => [
            'pl-step',
            `pl-step-status-${currentStatus.value}`,
            {
                'pl-step-has-icon': !!icon.value,
                'pl-step-last': isLast.value,
            }
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
            utils,
        })

        stepGroup.utils.addItem(ctx)

        onBeforeUnmount(() => {
            stepGroup.utils.removeItem(ctx)
        })

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
                                                {currentStatus.value === STATUS.finish ?
                                                    <pl-icon icon="el-icon-check"/>
                                                    :
                                                    (currentStatus.value === STATUS.error ?
                                                            <pl-icon icon="el-icon-close"/>
                                                            :
                                                            <span v-else>{state.index}</span>
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