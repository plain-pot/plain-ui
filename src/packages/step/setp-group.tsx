import {computed, defineComponent, provide, reactive} from "@vue/composition-api";
import {$plain} from "@/packages/base";
import {useSlots} from "@/use/useSlots";

export const STEP_GROUP_PROVIDER = '@@STEP_GROUP_PROVIDER'

export default defineComponent({
    name: 'pl-step-group',
    props: {
        current: {type: [String, Number]},                              // 双向绑定，指定当前步骤条的步骤，在step组件中，可以通过 status 属性覆盖状态
        currentStatus: {type: String},                                  // 当前激活节点的状态
        type: {type: String, default: 'normal'},                        // 步骤条类型，normal、navigation
        vertical: {type: Boolean},                                      // 步骤条是否为纵向
        titleAlignBottom: {type: Boolean},                              // 默认情况下，标题会放在图标右侧，设置该属性可以改为放在图标下面
        mini: {type: Boolean},                                          // 迷你步骤条
        dotIcon: {type: Boolean},                                       // 图标是否采用小圆点替代
    },
    setup(props) {

        const {slots} = useSlots()

        const state = reactive({
            items: [] as any[],
        })

        /*---------------------------------------computer-------------------------------------------*/
        const isTitleAlignBottom = computed(() => {
            return props.titleAlignBottom || props.vertical
        })
        const classes = computed(() => [
            'pl-step-group',
            `pl-step-group-${props.vertical ? 'vertical' : 'horizontal'}`,
            {
                'pl-step-group-title-align-bottom': isTitleAlignBottom.value,
                'pl-step-group-mini': props.mini,
                'pl-step-group-dot-icon': props.dotIcon,
            },
        ])

        const currentIndex = computed(() => {
            if (typeof props.current === "number") {
                return props.current
            } else {
                for (let i = 0; i < state.items.length; i++) {
                    const item = state.items[i];
                    if (item.val === props.current) return item.index
                }
            }
        })

        const utils = {
            refreshStepIndex: $plain.utils.debounce((): void => {
                state.items.forEach(item => item.utils.refreshIndex())
            }, 100),
            addItem: (item) => {
                state.items.push(item)
                utils.refreshStepIndex()
            },
            removeItem: (item) => {
                state.items.splice(state.items.indexOf(item), 1)
                utils.refreshStepIndex()
            }
        }

        provide(STEP_GROUP_PROVIDER, {
            state,
            utils,
            currentIndex,
            props,
            isTitleAlignBottom,
        })

        return () => (
            <div class={classes.value}>
                {slots.default()}
            </div>
        )
    },
})