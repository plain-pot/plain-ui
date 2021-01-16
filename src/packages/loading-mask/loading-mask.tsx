import './loading-mask.scss'
import {designComponent} from "../../use/designComponent";
import {nextIndex} from "../../utils/nextIndex";
import {computed, nextTick, reactive, watch, Transition, onMounted} from 'vue';
import {useModel} from "../../use/useModel";
import {useStyles} from "../../use/useStyles";
import {useRefs} from "../../use/useRefs";
import Loading from '../loading'

export const PlLoadingMask =  designComponent({
    name: 'pl-loading-mask',
    props: {
        modelValue: {type: Boolean},                                    // 是否打开loading遮罩
        message: {type: String},                                        // 提示信息
        loadingType: {type: String, default: 'delta'},                  // loading类型
        background: {type: String, default: 'rgba(255,255,255,0.85)'},  // 遮罩背景色
        unlock: {type: Boolean},                                        // 取消阻止点击事件
        fixedPosition: {type: Boolean},                                 // 是否为根节点的加载遮罩
        inDirective: {type: Boolean},                                   // 是否为遮罩指令服务的实例
    },
    emits: {
        onUpdateModelValue: (val: boolean | undefined) => true,
    },
    setup({props, event}) {

        const {refs} = useRefs({
            el: HTMLElement
        })

        const modelValue = useModel(() => props.modelValue, event.emit.onUpdateModelValue)

        const state = reactive({
            isMounted: false,
            zIndex: nextIndex() + (!props.fixedPosition ? -1500 : 0) + 1,
        })

        const classes = computed(() => [
            'pl-loading-mask',
            {
                'pl-loading-mask-unlock': props.unlock,
                'pl-loading-mask-fixed-position': props.fixedPosition
            }
        ])

        const styles = useStyles(style => {
            style.background = props.background
            style.zIndex = state.zIndex
        })

        const utils = {
            /**
             * 检查父节点的position是否为 absolute，relative或者fixed，不是的话，设置为 relative
             * @author  韦胜健
             * @date    2020/11/3 16:42
             */
            resetParentPosition: async () => {
                if (props.fixedPosition) {
                    return
                }
                await nextTick()
                const el = refs.el
                if (el) {
                    let parentNode = el.parentNode as HTMLElement
                    if (props.inDirective) {
                        parentNode = parentNode.parentNode as HTMLElement
                    }
                    if (!!parentNode) {
                        const styles = window.getComputedStyle(parentNode)
                        const position = styles.position
                        if (['absolute', 'relative', 'fixed'].indexOf(position) === -1) {
                            parentNode.style.position = 'relative'
                        }
                    }
                }
            }
        }

        watch(() => modelValue.value && state.isMounted, async val => {
            !!val && (state.zIndex = nextIndex() + (!props.fixedPosition ? -1500 : 0) + 1);
            await utils.resetParentPosition()
        })

        onMounted(() => {
            utils.resetParentPosition()
            setTimeout(() => {
                state.isMounted = true
            }, 23)
        })

        return {
            render: () => (
                <Transition name="pl-transition-loading-mask">
                    {!!modelValue.value && state.isMounted && (
                        <div style={styles.value} class={classes.value} ref="el">
                            <Loading type={props.loadingType}/>
                            {!!props.message && <span>{props.message}</span>}
                        </div>
                    )}
                </Transition>
            )
        }
    },
})