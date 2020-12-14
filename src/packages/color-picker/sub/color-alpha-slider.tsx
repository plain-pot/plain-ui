import {designComponent} from "../../../use/designComponent";
import {EditProps} from "../../../use/useEdit";
import {useRefs} from "../../../use/useRefs";
import {useProps} from "../../../use/useProps";
import {computed, nextTick, reactive, watch} from 'vue';
import {unit} from "plain-utils/string/unit";
import {disabledUserSelect} from "plain-utils/dom/disabledUserSelect";
import {enableUserSelect} from "plain-utils/dom/enableUserSelect";
import './color-alpha-slider.scss'

const bg = require('./opacity.png')

export const ColorAlphaSlider = designComponent({
    name: 'pl-color-alpha-slider',
    props: {
        ...EditProps,

        color: {type: String},                                      // 当前颜色
        modelValue: {type: Number, default: 0},                     // 透明度
        size: {type: [String, Number]},                             // 大小
        thumbSize: {type: [String, Number], default: 10},           // 指示器宽度
    },
    emits: {
        onUpdateModelValue: (val: number) => true,
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
            top: 0,
            tempTop: 0,
            startY: null as null | number,
        })

        const styles = computed(() => ({
            height: unit(propsState.size),
            backgroundImage: `url(${bg})`,
        }))

        const shadowStyles = computed(() => ({
            background: `linear-gradient(to top, ${props.color}, rgba(255,255,255,0))`,
        }))

        const thumbStyles = computed(() => ({
            top: `${state.top}px`,
            width: unit(propsState.thumbSize)
        }))

        const height = computed(() => (propsState.size as number) - (propsState.thumbSize as number))

        const methods = {
            setTop: (top: number) => {
                state.top = Math.max(0, Math.min(height.value, top))
            },
            emitValue: () => {
                emit.onUpdateModelValue(Number((state.top / height.value * 100).toFixed(0)))
            }
        }

        const handler = {
            mousedown: (e: MouseEvent) => {
                document.body.addEventListener('mousemove', handler.mousemove)
                document.body.addEventListener('mouseup', handler.mouseup)
                if (e.target === refs.el) {
                    methods.setTop(e.offsetY - (propsState.thumbSize as number) / 2)
                    methods.emitValue()
                }
                disabledUserSelect()
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
                enableUserSelect()
            },
        }

        watch(() => props.modelValue, (val) => {
            nextTick().then(() => methods.setTop(val / 100 * height.value))
        }, {immediate: true})

        return {
            render: () => (
                <div class="pl-color-alpha-slider" style={styles.value as any} onMousedown={handler.mousedown} ref="el">
                    <div class="pl-color-alpha-shadow" style={shadowStyles.value}/>
                    <span class="pl-color-alpha-thumb" style={thumbStyles.value as any}/>
                </div>
            )
        }
    },
})