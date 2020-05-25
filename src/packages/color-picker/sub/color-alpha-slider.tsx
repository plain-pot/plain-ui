import {computed, defineComponent, reactive, watch} from "@vue/composition-api";
import {EditProps} from "@/use/useEdit";
import {FormatPropsType, useProps} from "@/use/useProps";
import {$plain} from "@/packages/base";
import {ElRef, useRefs} from "@/use/useRefs";
import {EmitFunc, useEvent} from "@/use/useEvent";

const bg = require('./opacity.png')

export default defineComponent({
    name: 'pl-color-alpha-slider',
    props: {
        ...EditProps,

        color: {type: String},                                      // 当前颜色
        value: {type: Number, default: 0},                          // 透明度
        size: {type: [String, Number]},                             // 大小
        thumbSize: {type: [String, Number], default: 10},           // 指示器宽度
    },
    setup(props) {

        const refs = useRefs({
            el: ElRef,
        })

        const {emit} = useEvent({
            input: EmitFunc,
        })

        const propsState = useProps(props, {
            size: FormatPropsType.number,
            thumbSize: FormatPropsType.number,
        })

        const state = reactive({
            top: 0,
            tempTop: 0,
            startY: null as null | number,
        })

        const styles = computed(() => ({
            height: $plain.utils.suffixPx(propsState.size),
            backgroundImage: `url(${bg})`,
        }))

        const shadowStyles = computed(() => ({
            background: `linear-gradient(to top, ${props.color}, rgba(255,255,255,0))`,
        }))

        const thumbStyles = computed(() => ({
            top: `${state.top}px`,
            width: $plain.utils.suffixPx(propsState.thumbSize)
        }))

        const height = computed(() => propsState.size - propsState.thumbSize)

        const methods = {
            setTop: (top) => {
                state.top = Math.max(0, Math.min(height.value, top))
            },
            emitValue: () => {
                emit.input(Number((state.top / height.value * 100).toFixed(0)))
            }
        }

        const handler = {
            mousedown: (e: MouseEvent) => {
                document.body.addEventListener('mousemove', handler.mousemove)
                document.body.addEventListener('mouseup', handler.mouseup)
                if (e.target === refs.$el) {
                    methods.setTop(e.offsetY - propsState.thumbSize / 2)
                    methods.emitValue()
                }
                $plain.disableSelect()
                state.startY = e.clientY
                state.tempTop = state.top
            },
            mousemove: (e: MouseEvent) => {
                const durY = e.clientY - state.startY!
                methods.setTop(state.tempTop + durY)
                methods.emitValue()
            },
            mouseup: (e: MouseEvent) => {
                document.body.removeEventListener('mousemove', handler.mousemove)
                document.body.removeEventListener('mouseup', handler.mouseup)
                $plain.enableSelect()
            },
        }

        watch(() => props.value, (val) => {
            $plain.nextTick(() => methods.setTop(val / 100 * height.value))
        })

        return () => (
            <div class="pl-color-alpha-slider" style={styles.value} onMousedown={handler.mousedown} ref={"el"}>
                <div class="pl-color-alpha-shadow" style={shadowStyles.value}/>
                <span class="pl-color-alpha-thumb" style={thumbStyles.value}/>
            </div>
        )
    },
})