import {computed, defineComponent, reactive, watch} from "@vue/composition-api";
import {FormatPropsType, useProps} from "@/use/useProps";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {$plain} from "@/packages/base";
import {hsv2rgb} from "@/packages/color-picker/color/ColorUtils";

export default defineComponent({
    name: 'pl-color-sv-panel',
    props: {
        hue: {type: Number, default: 360},                      // 色相
        saturation: {type: Number},                             // 饱和度
        value: {type: Number},                                  // 亮度

        height: {type: [String, Number], default: 180},         // 面板高度
        width: {type: [String, Number], default: 240},          // 面板宽度
    },
    setup(props) {

        const {emit} = useEvent({
            change: EmitFunc,
            dblclick: EmitFunc,
        })

        const propsState = useProps(props, {
            height: FormatPropsType.number,
            width: FormatPropsType.number,
        })

        const state = reactive({
            val: props.value == null ? null : 100 - Number(props.value),
            saturation: props.saturation,

            startX: 0,
            startY: 0,
            tempSaturation: 0,
            tempValue: 0,
        })

        const styles = computed(() => {
            const color = hsv2rgb(props.hue, 100, 100)
            return {
                width: $plain.utils.suffixPx(propsState.width),
                height: $plain.utils.suffixPx(propsState.height),
                backgroundColor: `rgb(${color.r},${color.g},${color.b})`,
            }
        })

        const thumbStyles = computed(() => {
            let {val, saturation} = state
            val = val == null ? 50 : val
            saturation = saturation == null ? 50 : saturation

            return {
                transform: `translate3d(${saturation * propsState.width / 100}px,${val * propsState.height / 100}px,0)`,
            }
        })


        const methods = {
            updatePosition: (x: number, y: number, isMouseDown = true): void => {
                const durX = Number((x / propsState.width * 100).toFixed(0));
                const durY = Number((y / propsState.height * 100).toFixed(0));

                state.saturation = (isMouseDown ? 0 : state.tempSaturation) + durX
                state.val = (isMouseDown ? 0 : state.tempValue) + durY
                state.saturation = Math.max(0, Math.min(100, state.saturation))
                state.val = Math.max(0, Math.min(100, state.val))

                emit.change({hue: props.hue, saturation: state.saturation, value: 100 - state.val})
            },
        }

        const handler = {
            mousedown: (e: MouseEvent) => {
                document.body.addEventListener('mousemove', handler.mousemove)
                document.body.addEventListener('mouseup', handler.mouseup)
                $plain.disableSelect()
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
                $plain.enableSelect()
            },
            dblclick: async (e: MouseEvent) => {
                await $plain.nextTick()
                emit.dblclick(e)
            },
        }

        watch(() => props.value, (val) => {
            if (val == null) {
                state.val = null
                return
            }
            if (state.val !== 100 - val) state.val = 100 - val
        }, {lazy: true})
        watch(() => props.saturation, (val) => {
            if (val == null) {
                state.saturation = undefined
                return
            }
            if (state.saturation !== val) state.saturation = val
        }, {lazy: true})


        return () => (
            <div class="pl-color-sv-panel" style={styles.value} onMousedown={handler.mousedown} onDblclick={handler.dblclick}>
                <span class="pl-color-sv-thumb" style={thumbStyles.value}/>
            </div>
        )
    },
})