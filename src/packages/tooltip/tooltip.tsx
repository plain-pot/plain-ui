import {designComponent} from "../../use/designComponent";
import {useModel} from "../../use/useModel";
import './tooltip.scss'
import {useSlots} from "../../use/useSlots";
import {useClass} from "../../use/useClasses";
import {unit} from "plain-utils/string/unit";
import {useRefs} from "../../use/useRefs";
import {onUpdated, reactive, onMounted} from 'vue';
import {debounce} from "plain-utils/utils/debounce";

export default designComponent({
    name: 'pl-tooltip',
    props: {
        modelValue: {type: Boolean},                        // 双向绑定控制是否显示
        tooltip: {type: String},                            // tooltip提示文本，可以通过 tooltip插槽替换
        showWidth: {type: Number},                          // 设置宽度，当内容宽度超过这个宽度时，才会显示tooltip
        theme: {type: String, default: 'dark'},             // 主题，dark以及light

        placement: {type: String, default: 'top-start'},    // 位置
        popperClass: {type: Object},                        // 传递给 pl-popper 的popperClass 属性
    },
    emits: {
        onUpdateModelValue: (val: boolean) => true
    },
    setup({props, event: {emit}}) {

        const state = reactive({
            scrollWidth: 0,
            offsetWidth: 0,
        })
        const {refs} = useRefs({
            reference: HTMLSpanElement
        })
        const {slots} = useSlots(['tooltip'])
        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)

        const popperClasses = useClass(() => [
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
                <pl-popper
                    disabled={!!props.showWidth ? state.offsetWidth === state.scrollWidth : false}
                    popperClass={popperClasses.value}
                    placement={props.placement}
                    v-model={model.value}
                    v-slots={{
                        default: () => {
                            refresh()
                            return !!props.showWidth ? (
                                <span class="pl-tooltip-reference"
                                      ref="reference"
                                      style={{width: unit(props.showWidth)!}}>
                                {slots.default(props.tooltip)}
                            </span>
                            ) : slots.default(props.tooltip)
                        },
                        popper: () => slots.tooltip(props.tooltip)
                    }}
                />
            )
        }
    },
})