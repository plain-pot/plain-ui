import './loading-mask.scss'
import {designComponent} from "../../use/designComponent";
import {nextIndex} from "../../utils/nextIndex";
import {computed, nextTick, reactive, watch} from 'vue';
import {useModel} from "../../use/useModel";
import {useStyles} from "../../use/useStyles";
import {useRefs} from "../../use/useRefs";

export default designComponent({
    name: 'loading-mask',
    props: {
        modelValue: {type: Boolean},                                    // 是否打开loading遮罩
        message: {type: String},                                        // 提示信息
        loadingType: {type: String, default: 'delta'},                  // loading类型
        background: {type: String, default: 'rgba(255,255,255,0.85)'},  // 遮罩背景色
        unlock: {type: Boolean},                                        // 取消阻止点击事件
        fixedPosition: {type: Boolean},                                 // 是否为根节点的加载遮罩
    },
    emits: {
        updateModelValue: (val: boolean | undefined) => true,
    },
    setup({props, event}) {

        const {refs} = useRefs({
            el: HTMLElement
        })

        const modelValue = useModel(() => props.modelValue, event.emit.updateModelValue)

        const state = reactive({
            zIndex: nextIndex(),
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
                await nextTick()
                const el = refs.el as HTMLElement | null
                if (el) {
                    const parentNode = el.parentNode as HTMLElement
                    if (!!parentNode) {
                        const position = parentNode.style.position
                        if (['absolute', 'relative', 'fixed'].indexOf(position) === -1) {
                            parentNode.style.position = 'relative'
                        }
                    }
                }
            }
        }

        watch(() => modelValue.value, async val => {
            !!val && (state.zIndex = nextIndex());
            await utils.resetParentPosition()
        })

        return {
            render: () => (
                <transition name="pl-transition-loading-mask">
                    {!!modelValue.value && (
                        <div style={styles.value} class={classes.value}>
                            <pl-loading type={props.loadingType}/>
                            {!!props.message && <span>{props.message}</span>}
                        </div>
                    )}
                </transition>
            )
        }
    },
})