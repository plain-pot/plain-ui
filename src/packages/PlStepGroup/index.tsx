import {computed, designComponent, useRefs,InheritHtmlElement} from "plain-ui-composition";
import {useClasses} from "plain-ui-composition";
import {StepUtils} from "./step.utils";
import {useCollect} from "../../use/useCollect";
import {PlStep} from "../PlStep";
import './step-group.scss'

export const PlStepGroup = designComponent({
    name: 'pl-step-group',
    props: {
        current: {type: [String, Number]},                              // 双向绑定，指定当前步骤条的步骤，在step组件中，可以通过 status 属性覆盖状态
        currentStatus: {type: String},                                  // 当前激活节点的状态
        type: {type: String, default: 'normal'},                        // 步骤条类型，normal、navigation
        vertical: {type: Boolean},                                      // 步骤条是否为纵向
        titleAlignBottom: {type: Boolean},                              // 默认情况下，标题会放在图标右侧，设置该属性可以改为放在图标下面
        mini: {type: Boolean, default: true},                           // 迷你步骤条
        dotIcon: {type: Boolean},                                       // 图标是否采用小圆点替代
    },
    slots: ['default'],
    inheritPropsType: InheritHtmlElement,
    setup({props, slots}) {

        const {refs, onRef} = useRefs({el: HTMLDivElement})
        const items = StepCollector.parent() as any[]

        /*---------------------------------------computer-------------------------------------------*/

        const isTitleAlignBottom = computed(() => {
            return props.titleAlignBottom || props.vertical
        })
        const classes = useClasses(() => [
            'pl-step-group',
            `pl-step-group-${props.vertical ? 'vertical' : 'horizontal'}`,
            {
                'pl-step-group-title-align-bottom': isTitleAlignBottom.value,
                'pl-step-group-mini': props.mini,
                'pl-step-group-dot-icon': props.dotIcon,
            },
        ])
        const currentIndex = computed(() => StepUtils.getCurrentIndex(props.current, items)) as { value: number }

        return {
            refer: {
                items,
                currentIndex,
                props,
                isTitleAlignBottom,
                refs,
            },
            render: () => (
                <div class={classes.value} ref={onRef.el}>
                    {slots.default()}
                </div>
            )
        }
    },
})


export const StepCollector = useCollect(() => ({
    parent: PlStepGroup,
    child: PlStep,
}))

export default PlStepGroup
