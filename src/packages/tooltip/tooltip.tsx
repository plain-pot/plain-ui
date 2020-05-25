import {computed, defineComponent, reactive} from "@vue/composition-api";
import PlainPopper from "../../../submodules/plain-popper";
import {useRefs} from "@/use/useRefs";
import {FormatPropsType, useProps} from "@/use/useProps";

const PlainTooltip = PlainPopper.PlainTooltip

const props = {
    text: {type: [String, Object]},                             // tooltip 文本
    showOverflowTooltip: {type: Boolean},                       // 是否当文本超过宽度的时候才悬浮显示tooltip

    // popper
    offset: {type: [Number, String]},                           // 偏移量
    placement: {type: String, default: 'top'},                  // 位置
    arrow: {type: Boolean, default: true},                      // 是否需要箭头
    boundary: {default: 'window'},                              // 边界元素

    // tooltip
    theme: {type: String},                                      // 主题 dark,light
    animate: {type: String},                                    // 动画 drop,scale,fade
    trigger: {type: String, default: 'hover'},                  // 触发方式 click,hover,focus,manual,always
}

export default defineComponent({
    name: 'pl-tooltip',
    props: {
        ...props,
    },
    setup(props, context) {

        const refs = useRefs()

        const propsState = useProps(props, {
            text: FormatPropsType.promise,
            offset: FormatPropsType.number,
        })

        const state = reactive({
            tooltip: null as any,
            unwatch: null as Function | null,
        })

        const isShow = computed(() => {
            if (!state.tooltip) return false
            return state.tooltip.isShow
        })

        const utils = {
            initTooltip: () => {
                // @ts-ignore
                state.tooltip = new PlainTooltip({
                    targetEl: refs.$el,
                    content: props.text,

                    offset: propsState.offset,
                    placement: props.placement,
                    arrow: props.arrow,
                    boundary: props.boundary,
                    theme: props.theme,
                    animate: props.animate,
                    trigger: props.trigger,
                })
            }
        }

        const methods = {
            show: () => {

            }
        }

        return () => (
            <div>

            </div>
        )
    },
})