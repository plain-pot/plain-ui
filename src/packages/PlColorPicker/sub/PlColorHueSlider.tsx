import {computed, designComponent, InheritHtmlElement, reactive, useNumber, useRefs, useStyles, watch} from 'plain-ui-composition'
import './color-hue-slider.scss'
import {unit} from "plain-utils/string/unit";
import {disabledUserSelect} from "plain-utils/dom/disabledUserSelect";
import {enableUserSelect} from "plain-utils/dom/enableUserSelect";
import {delay} from "plain-utils/utils/delay";

export const PlColorHueSlider = designComponent({
    name: 'pl-color-hue-slider',
    props: {
        modelValue: {type: Number, default: 0},                          // 当前色相
        size: {type: [String, Number]},                             // 宽度
        thumbSize: {type: [String, Number], default: 10},           // 指示器宽度
    },
    emits: {
        onUpdateModelValue: (val: any) => true,
    },
    inheritPropsType: InheritHtmlElement,
    setup({props, event: {emit}}) {
        const {refs, onRef} = useRefs({
            el: HTMLDivElement,
        })
        const {numberState} = useNumber(props, ['size', 'thumbSize'])

        const state = reactive({
            left: 0,                                                // 指示器左偏移位置
            tempLeft: 0,                                            // 拖拽的时候，指示器的缓存左偏移位置
            startX: null as null | number,                          // 拖拽的时候起始位置
        })

        const styles = useStyles(() => ({
            width: unit(numberState.size)
        }))

        const thumbStyles = useStyles(() => ({
            left: `${state.left}px`,
            width: unit(numberState.thumbSize)
        }))

        const width = computed(() => (numberState.size as number) - (numberState.thumbSize as number))

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
                    methods.setLeft(e.offsetX - (numberState.thumbSize as number) / 2)
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
            delay().then(() => methods.setLeft(val / 360 * width.value))
        }, {immediate: true})

        return {
            refer: {
                refs,
            },
            render: () => (
                <div class="pl-color-hue-slider" onMousedown={handler.mousedown} style={styles.value} ref={onRef.el}>
                    <div class="pl-color-hue-slider-thumb" style={thumbStyles.value}/>
                </div>
            )
        }
    },
})

export default PlColorHueSlider
