import {computed, defineComponent, onBeforeUnmount, onMounted, reactive, watch} from "@vue/composition-api";
import {useRefs} from "@/use/useRefs";
import {FormatPropsType, useProps} from "@/use/useProps";
import {$plain} from "@/packages/base";
import {useSlots} from "@/use/useSlots";
import {useRefer} from "@/use/useRefer";
import {PlainTooltip} from "../../../src-doc/page/plain-popper/PlainTooltip";
import {PlacementType} from "../../../src-doc/page/plain-popper/PlainPopperUtils";

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
    setup(props) {

        const refs = useRefs()
        const {slots} = useSlots()

        const propsState = useProps(props, {
            text: FormatPropsType.promise,
            offset: FormatPropsType.number,
        })

        const state = reactive({
            tooltip: null as null | PlainTooltip,
            unwatch: null as Function | null,
        })

        const isShow = computed(() => {
            if (!state.tooltip) return false
            return state.tooltip.state.isShow
        })

        const classes = computed(() => [
            'pl-tooltip',
            {
                'pl-tooltip-show-overflow-tooltip': props.showOverflowTooltip
            }
        ])

        const utils = {
            initTooltip: () => {
                // @ts-ignore
                state.tooltip = new PlainTooltip({
                    content: props.text,

                    reference: refs.$el,
                    offset: propsState.offset,
                    placement: props.placement as PlacementType,
                    arrowSize: props.arrow ? undefined : 0,
                    boundary: props.boundary,
                    theme: props.theme as any,
                    animate: props.animate as any,
                    trigger: props.trigger as any,
                })
            },
            destroyTooltip: () => {
                if (!!state.tooltip) {
                    state.tooltip.hide()
                    state.tooltip.destroy()
                    state.tooltip = null
                }
            },
            reset: () => {
                if (!!state.tooltip) {
                    utils.destroyTooltip()
                }
                utils.initTooltip()
            }
        }

        const methods = {
            show: () => {
                if (!state.tooltip) {
                    utils.initTooltip()
                }
                state.tooltip!.show()
            },
            hide: () => {
                if (!!state.tooltip) {
                    state.tooltip.hide()
                }
            }
        }

        onMounted(() => {
            utils.initTooltip()
        })

        onBeforeUnmount(() => {
            utils.destroyTooltip()
            if (!!state.unwatch) {
                state.unwatch()
            }
        })

        Object.keys(props).forEach(propsName => {
            if (propsName === 'showOverflowTooltip') {
                watch(() => props.showOverflowTooltip, (val) => {
                    if (val) {
                        state.unwatch = watch(() => props.text, async () => {
                            await $plain.nextTick()
                            const {offsetWidth, scrollWidth} = refs.$el
                            if (offsetWidth >= scrollWidth) {
                                if (!!state.tooltip) {
                                    utils.destroyTooltip()
                                }
                            } else {
                                if (!state.tooltip) {
                                    utils.initTooltip()
                                }
                            }
                        })
                    } else {
                        !!state.unwatch && state.unwatch()
                    }
                }, {immediate: true})
            } else {
                watch(() => props[propsName], () => {
                    utils.reset()
                }, {immediate: true})
            }
        })

        useRefer({
            utils,
            methods,
            isShow,
            state,
            propsState,
            refs,
            slots,
        })

        return () => (
            <span class={classes.value} tabIndex={props.trigger === 'focus' ? '0' : null}>
                {slots.default(propsState.text)}&nbsp;&nbsp;
            </span>
        )
    },
})