import {computed, designComponent, reactive, useNumber, useRefs, useStyles, watch} from 'plain-ui-composition'
import './color-alpha-slider.scss'
import {EditProps} from "../../../use/useEdit";
import {unit} from "plain-utils/string/unit";
import {disabledUserSelect} from "plain-utils/dom/disabledUserSelect";
import {enableUserSelect} from "plain-utils/dom/enableUserSelect";
import {delay} from "plain-utils/utils/delay";

// @ts-ignore
import opacityPng from '../../PlColorButton/opacity.png'

export const PlColorAlphaSlider = designComponent({
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
    inheritPropsType: HTMLDivElement,
    setup({props, event: {emit}}) {

        const {refs, onRef} = useRefs({
            el: HTMLDivElement,
        })

        const {numberState} = useNumber(props, ['size', 'thumbSize'])

        const state = reactive({
            top: 0,
            tempTop: 0,
            startY: null as null | number,
        })

        const styles = useStyles(() => ({
            height: unit(numberState.size),
            backgroundImage: `url(${opacityPng})`,
        }))

        const shadowStyles = useStyles(() => ({
            background: `linear-gradient(to top, ${props.color}, rgba(255,255,255,0))`,
        }))

        const thumbStyles = useStyles(() => ({
            top: `${state.top}px`,
            width: unit(numberState.thumbSize)
        }))

        const height = computed(() => (numberState.size as number) - (numberState.thumbSize as number))

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
                    methods.setTop(e.offsetY - (numberState.thumbSize as number) / 2)
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
            delay().then(() => methods.setTop(val / 100 * height.value))
        }, {immediate: true})

        return {
            refer: {
                refs,
            },
            render: () => (
                <div class="pl-color-alpha-slider" style={styles.value} onMousedown={handler.mousedown} ref={onRef.el}>
                    <div class="pl-color-alpha-shadow" style={shadowStyles.value}/>
                    <span class="pl-color-alpha-thumb" style={thumbStyles.value}/>
                </div>
            )
        }
    },
})

export default PlColorAlphaSlider
