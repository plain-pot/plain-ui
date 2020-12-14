import './color-sv-panel.scss'
import {designComponent} from "../../../use/designComponent";
import {useProps} from "../../../use/useProps";
import {computed, nextTick, reactive, watch} from 'vue';
import {hsv2rgb} from "../utils/ColorUtils";
import {unit} from "plain-utils/string/unit";
import {disabledUserSelect} from "plain-utils/dom/disabledUserSelect";
import {enableUserSelect} from "plain-utils/dom/enableUserSelect";

export const ColorSvPanel = designComponent({
    name: 'pl-color-sv-panel',
    props: {
        hue: {type: Number, default: 360},                      // 色相
        saturation: {type: Number},                             // 饱和度
        modelValue: {type: Number},                             // 亮度

        height: {type: [String, Number], default: 180},         // 面板高度
        width: {type: [String, Number], default: 240},          // 面板宽度
    },
    emits: {
        onChange: (val: any) => true,
        onDblclick: (e: MouseEvent) => true,
    },
    setup({props, event: {emit}}) {

        const {propsState} = useProps(props, {
            height: useProps.NUMBER,
            width: useProps.NUMBER,
        })

        const state = reactive({
            val: props.modelValue == null ? null : 100 - Number(props.modelValue),
            saturation: props.saturation,

            startX: 0,
            startY: 0,
            tempSaturation: 0,
            tempValue: 0,
        })

        const styles = computed(() => {
            const color = hsv2rgb(props.hue, 100, 100)
            return {
                width: unit(propsState.width),
                height: unit(propsState.height),
                backgroundColor: `rgb(${color.r},${color.g},${color.b})`,
            }
        })

        const thumbStyles = computed(() => {
            let {val, saturation} = state
            val = val == null ? 50 : val
            saturation = saturation == null ? 50 : saturation

            return {
                transform: `translate3d(${saturation * (propsState.width as number) / 100}px,${val * (propsState.height as number) / 100}px,0)`,
            }
        })

        const methods = {
            updatePosition: (x: number, y: number, isMouseDown = true): void => {
                const durX = Number((x / (propsState.width as number) * 100).toFixed(0));
                const durY = Number((y / (propsState.height as number) * 100).toFixed(0));

                state.saturation = (isMouseDown ? 0 : state.tempSaturation) + durX
                state.val = (isMouseDown ? 0 : state.tempValue) + durY
                state.saturation = Math.max(0, Math.min(100, state.saturation))
                state.val = Math.max(0, Math.min(100, state.val))

                emit.onChange({hue: props.hue, saturation: state.saturation, value: 100 - state.val})
            },
        }

        const handler = {
            mousedown: (e: MouseEvent) => {
                document.body.addEventListener('mousemove', handler.mousemove)
                document.body.addEventListener('mouseup', handler.mouseup)
                disabledUserSelect()
                methods.updatePosition(e.offsetX, e.offsetY)
                state.startX = e.clientX
                state.startY = e.clientY
                state.tempSaturation = state.saturation as number
                state.tempValue = state.val as number
            },
            mousemove: (e: MouseEvent) => {
                methods.updatePosition(e.clientX - state.startX, e.clientY - state.startY, false)
            },
            mouseup: () => {
                document.body.removeEventListener('mousemove', handler.mousemove)
                document.body.removeEventListener('mouseup', handler.mouseup)
                enableUserSelect()
            },
            dblclick: async (e: MouseEvent) => {
                nextTick().then(() => emit.onDblclick(e))
            },
        }

        watch(() => props.modelValue, (val) => {
            if (val == null) {
                state.val = null
                return
            }
            if (state.val !== 100 - val) state.val = 100 - val
        })
        watch(() => props.saturation, (val) => {
            if (val == null) {
                state.saturation = undefined
                return
            }
            if (state.saturation !== val) state.saturation = val
        })

        return {
            render: () => (
                <div class="pl-color-sv-panel" style={styles.value as any} onMousedown={handler.mousedown} onDblclick={handler.dblclick}>
                    <span class="pl-color-sv-thumb" style={thumbStyles.value}/>
                </div>
            )
        }
    },
})