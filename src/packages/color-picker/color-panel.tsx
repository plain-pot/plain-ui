import './color-panel.scss'
import {designComponent} from "../../use/designComponent";
import {Color, ColorFormat} from "./utils/Color";
import {nextTick, reactive, watch} from 'vue';
import {isEffectiveColorString} from "./utils/ColorUtils";
import Input from '../input'
import {useRefs} from "../../use/useRefs";
import {$$notice} from "../notice-service";

function getDefaultColor(format: ColorFormat, enableAlpha: boolean) {
    if (format === ColorFormat.hex) {
        return '#12b4a5'
    } else {
        if (enableAlpha) {
            return 'rgba(18,180,165,0.5)'
        } else {
            return 'rgb(18,180,165)'
        }
    }
}

export const ColorPanel = designComponent({
    name: 'pl-color-panel',
    props: {
        modelValue: {type: String},                      // 当前颜色值
        enableAlpha: {type: Boolean},               // 是否启用透明度
        format: {type: String},                     // 格式类型：hex、rgb
    },
    emits: {
        onUpdateModelValue: (val: any) => true,
        onBblclickSvPanel: (e: MouseEvent) => true,
    },
    setup({props, event: {emit}}) {

        const {refs} = useRefs({
            input: Input,
        })

        const defaultColor = () => getDefaultColor(props.format as ColorFormat, props.enableAlpha as boolean)

        const state = reactive({
            val: props.modelValue,
            color: new Color(
                props.modelValue || defaultColor(),
                props.enableAlpha as boolean,
                props.format as ColorFormat
            ),
        })

        const methods = {
            reset: () => {
                state.val = props.modelValue
                state.color.setValue(props.modelValue || defaultColor())
            },
        }
        const handler = {
            svChange: ({value, saturation}: { value: number, saturation: number }) => {
                state.color.val = value
                state.color.saturation = saturation
                state.color.updateByHsv()
                state.val = state.color.color
            },
            hueChange: (hue: number) => {
                state.color.hue = hue
                state.color.updateByHsv()
                state.val = state.color.color
            },
            alphaChange: (alpha: number) => {
                state.color.alpha = alpha
                state.color.updateByAlpha()
                state.val = state.color.color
            },
            confirm: () => {
                emit.onUpdateModelValue(state.val)
            },
            dblclickSvPanel: (e: MouseEvent) => {
                handler.confirm()
                emit.onBblclickSvPanel(e)
            },
            inputChange: (val: string) => {
                if (!val) {
                    state.color.setValue(val)
                    state.val = state.color.color
                    return
                }
                let formatVal = val.replace(/\s/g, '')
                if (!isEffectiveColorString(formatVal)) {
                    return;
                } else {
                    state.color.setValue(formatVal)
                    if (val !== formatVal) {
                        refs.input!.model.value = formatVal
                    }
                    state.val = state.color.color
                }
            },
            inputBlur: () => {
                if (!!refs.input!.model.value && refs.input!.model.value !== state.color.color) {
                    $$notice.warn('请输入正确的颜色值！')
                    refs.input!.model.value = state.color.color
                }
            },
            inputEnter: async () => {
                await nextTick()
                if (!!refs.input!.model.value && refs.input!.model.value !== state.color.color) {
                    $$notice('请输入正确的颜色值！')
                    refs.input!.model.value = state.color.color
                } else {
                    handler.confirm()
                }
            },
        }

        /*---------------------------------------watch-------------------------------------------*/

        watch(() => props.modelValue, (val) => {
            state.color.setValue(val || defaultColor())
            state.val = state.color.color
        })

        watch(() => props.enableAlpha, (val) => {
            state.color.enableAlpha = val as boolean
            state.color.updateByAlpha()
        })

        watch(() => props.format, (val) => {
            state.color.format = val as ColorFormat || ColorFormat.hex
            state.color.format === ColorFormat.hex ? state.color.updateByHex() : state.color.updateByRgb()
        })

        return {
            render: () => (
                <div class="pl-color-panel">
                    <pl-color-sv-panel height="180"
                                       width="240"
                                       hue={state.color.hue}
                                       modelValue={state.color.val}
                                       saturation={state.color.saturation}
                                       onChange={handler.svChange} onDblclick={handler.dblclickSvPanel}/>

                    {state.color.enableAlpha && (
                        <pl-color-alpha-slider
                            size="180"
                            color={state.color.hex}
                            modelValue={state.color.alpha}
                            onChange={handler.alphaChange}/>
                    )}


                    <pl-color-hue-slider size="240"
                                         modelValue={state.color.hue}
                                         onInput={(val: number) => state.color.hue = val}
                                         onChange={handler.hueChange}/>
                    <div class="pl-color-panel-input-group">
                        <pl-input ref="input"
                                  size="mini"
                                  modelValue={state.val}
                                  width={props.enableAlpha ? 204 : 186}
                                  onChange={handler.inputChange}
                                  onBlur={handler.inputBlur}
                                  onEnter={handler.inputEnter}/>
                        <pl-button-group size="mini">
                            <pl-button icon="el-icon-close-bold" onClick={methods.reset}/>
                            <pl-button icon="el-icon-check-bold" onClick={handler.confirm}/>
                        </pl-button-group>
                    </div>
                </div>
            )
        }

    },
})