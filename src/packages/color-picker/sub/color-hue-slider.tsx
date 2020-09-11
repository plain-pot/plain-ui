import {computed, defineComponent, reactive, watch} from "@vue/composition-api";
import {FormatPropsType, useProps} from "@/use/useProps";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {$plain} from "@/packages/base";
import {ElRef, useRefs} from "@/use/useRefs";

export default defineComponent({
    name: 'pl-color-hue-slider',
    props: {
        value: {type: Number, default: 0},                          // 当前色相
        size: {type: [String, Number]},                             // 宽度
        thumbSize: {type: [String, Number], default: 10},           // 指示器宽度
    },
    setup(props) {

        const refs = useRefs()

        const propsState = useProps(props, {
            size: FormatPropsType.number,
            thumbSize: FormatPropsType.number,
        })

        const {emit} = useEvent({
            input: EmitFunc,
        })

        const state = reactive({
            left: 0,                                                // 指示器左偏移位置
            tempLeft: 0,                                            // 拖拽的时候，指示器的缓存左偏移位置
            startX: null as null | number,                          // 拖拽的时候起始位置
        })

        const styles = computed(() => ({
            width: $plain.utils.suffixPx(propsState.size)
        }))

        const thumbStyles = computed(() => ({
            left: `${state.left}px`,
            width: $plain.utils.suffixPx(propsState.thumbSize)
        }))

        const width = computed(() => propsState.size - propsState.thumbSize)

        const methods = {
            setLeft: (left) => {
                state.left = Math.max(0, Math.min(width.value, left))
            },
            emitValue: () => {
                emit.input(Number((state.left / width.value * 360).toFixed(0)))
            }
        }

        const handler = {
            mousedown: (e: MouseEvent) => {
                document.body.addEventListener('mousemove', handler.mousemove)
                document.body.addEventListener('mouseup', handler.mouseup)
                if (e.target === refs.$el) {
                    methods.setLeft(e.offsetX - propsState.thumbSize / 2)
                    methods.emitValue()
                }
                $plain.disableSelect()
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
                $plain.enableSelect()
            },
        }

        watch(() => props.value, (val) => {
            $plain.nextTick(() => methods.setLeft(val / 360 * width.value))
        },{immediate: true})

        return () => (
            <div class="pl-color-hue-slider" onMousedown={handler.mousedown} style={styles.value}>
                <div class="pl-color-hue-slider-thumb" style={thumbStyles.value}/>
            </div>
        )
    },
})