import './color-hue-slider.scss'
import {designComponent} from "../../../use/designComponent";
import {useRefs} from "../../../use/useRefs";
import {useProps} from "../../../use/useProps";
import {computed, nextTick, reactive, watch} from 'vue';
import {unit} from "plain-utils/string/unit";
import {disabledUserSelect} from "plain-utils/dom/disabledUserSelect";
import {enableUserSelect} from "plain-utils/dom/enableUserSelect";

export const ColorHueSlider = designComponent({
    name: 'pl-color-hue-slider',
    props: {
        modelValue: {type: Number, default: 0},                          // 当前色相
        size: {type: [String, Number]},                             // 宽度
        thumbSize: {type: [String, Number], default: 10},           // 指示器宽度
    },
    emits: {
        onUpdateModelValue: (val: any) => true,
    },
    setup({props, event: {emit}}) {
        const {refs} = useRefs({
            el: HTMLDivElement,
        })
        const {propsState} = useProps(props, {
            size: useProps.NUMBER,
            thumbSize: useProps.NUMBER,
        })

        const state = reactive({
            left: 0,                                                // 指示器左偏移位置
            tempLeft: 0,                                            // 拖拽的时候，指示器的缓存左偏移位置
            startX: null as null | number,                          // 拖拽的时候起始位置
        })

        const styles = computed(() => ({
            width: unit(propsState.size)
        }))

        const thumbStyles = computed(() => ({
            left: `${state.left}px`,
            width: unit(propsState.thumbSize)
        }))

        const width = computed(() => (propsState.size as number) - (propsState.thumbSize as number))

        const methods = {
            setLeft: (left: number) => {
                state.left = Math.max(0, Math.min(width.value, left))
            },
            emitValue: () => {
                emit.onUpdateModelValue(Number((state.left / width.value * 360).toFixed(0)))
            }
        }

        const handler = {
            mousedown: (e: MouseEvent) => {
                document.body.addEventListener('mousemove', handler.mousemove)
                document.body.addEventListener('mouseup', handler.mouseup)
                if (e.target === refs.el) {
                    methods.setLeft(e.offsetX - (propsState.thumbSize as number) / 2)
                    methods.emitValue()
                }
                disabledUserSelect()
                state.startX = e.clientX
                state.tempLeft = state.left
            },
            mousemove: (e: MouseEvent) => {
                const durX = e.clientX - state.startX!
                methods.setLeft(state.tempLeft + durX)
                methods.emitValue()
            },
            mouseup: () => {
                document.body.removeEventListener('mousemove', handler.mousemove)
                document.body.removeEventListener('mouseup', handler.mouseup)
                enableUserSelect()
            },
        }

        watch(() => props.modelValue, (val) => {
            nextTick().then(() => methods.setLeft(val / 360 * width.value))
        }, {immediate: true})

        return {
            render: () => (
                <div class="pl-color-hue-slider" onMousedown={handler.mousedown} style={styles.value as any} ref="el">
                    <div class="pl-color-hue-slider-thumb" style={thumbStyles.value as any}/>
                </div>
            )
        }
    },
})