import './tooltip.scss'
import {useClasses, designComponent, onMounted, onUpdated, reactive, useModel, useRefs} from "plain-ui-composition";
import {debounce} from "plain-utils/utils/debounce";
import PlPopper from "../PlPopper";
import {unit} from "plain-utils/string/unit";

export const PlTooltip = designComponent({
    name: 'pl-tooltip',
    props: {
        modelValue: {type: Boolean},                        // 双向绑定控制是否显示
        showWidth: {type: [Number, String]},                // 设置宽度，当内容宽度超过这个宽度时，才会显示tooltip
        theme: {type: String, default: 'dark'},             // 主题，dark以及light

        placement: {type: String, default: 'top'},          // 位置
        popperClass: {type: Object},                        // 传递给 pl-popper 的popperClass 属性
        tooltip: {type: String},                            // tooltip 文本
    },
    inheritPropsType: PlPopper,
    emits: {
        onUpdateModelValue: (val?: boolean) => true
    },
    slots: ['popper', 'default'],
    setup({props, slots, event: {emit}}) {

        const state = reactive({
            scrollWidth: 0,
            offsetWidth: 0,
        })
        const {refs, onRef} = useRefs({
            reference: HTMLSpanElement,
            popper: PlPopper,
        })
        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)

        const popperClasses = useClasses(() => [
            'pl-tooltip',
            `pl-tooltip-theme-${props.theme}`,
            props.popperClass,
        ])

        const refresh = debounce(() => {
            if (!refs.reference) return
            const {scrollWidth, offsetWidth} = refs.reference
            if (state.scrollWidth != scrollWidth) state.scrollWidth = scrollWidth
            if (state.offsetWidth != offsetWidth) state.offsetWidth = offsetWidth
            // console.log({...state})
        }, 100)

        if (props.showWidth) {
            onUpdated(refresh)
            onMounted(refresh)
        }

        return {
            render: () => (
                <PlPopper
                    ref={onRef.popper}
                    disabled={!!props.showWidth ? state.offsetWidth === state.scrollWidth : false}
                    popperClass={popperClasses.value}
                    placement={props.placement}
                    v-model={model.value} v-slots={{
                    default: () => !!props.showWidth ? (
                        <span class="pl-tooltip-reference"
                              ref={onRef.reference}
                              style={{width: unit(props.showWidth)!}}>
                                {slots.default()}
                            </span>
                    ) : slots.default(),
                    popper: () => slots.popper(props.tooltip)
                }}/>
            )
        }
    },
})

export default PlTooltip
