import {defineComponent, reactive, watch} from "@vue/composition-api";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {Color, ColorFormat} from "@/packages/color-picker/color/Color";
import {isEffectiveColorString} from "@/packages/color-picker/color/ColorUtils";
import {CompRef, useRefs} from "@/use/useRefs";
import {$plain} from "@/packages/base";

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

export default defineComponent({
    name: 'pl-color-panel',
    props: {
        value: {type: String},                      // 当前颜色值
        enableAlpha: {type: Boolean},               // 是否启用透明度
        format: {type: String},                     // 格式类型：hex、rgb
    },
    setup(props) {

        const refs = useRefs({
            input: CompRef,
        })

        const {emit} = useEvent({
            input: EmitFunc,
            dblclickSvPanel: EmitFunc,
        })

        const defaultColor = () => getDefaultColor(props.format as ColorFormat, props.enableAlpha as boolean)

        const state = reactive({
            val: props.value,
            color: new Color(
                props.value || defaultColor(),
                props.enableAlpha as boolean,
                props.format as ColorFormat
            ),
        })

        const methods = {
            reset: () => {
                state.val = props.value
                state.color.setValue(props.value || defaultColor())
            },
        }
        const handler = {
            svChange: ({value, saturation}) => {
                state.color.val = value
                state.color.saturation = saturation
                state.color.updateByHsv()
                state.val = state.color.color
            },
            hueChange: (hue) => {
                state.color.hue = hue
                state.color.updateByHsv()
                state.val = state.color.color
            },
            alphaChange: (alpha) => {
                state.color.alpha = alpha
                state.color.updateByAlpha()
                state.val = state.color.color
            },
            confirm: () => {
                emit.input(state.val)
            },
            dblclickSvPanel: (e) => {
                handler.confirm()
                emit.dblclickSvPanel(e)
            },
            inputChange: (val: string) => {
                if (!val) {
                    state.color.setValue(val)
                    return
                }
                let formatVal = val.replace(/\s/g, '')
                if (!isEffectiveColorString(formatVal)) {
                    return;
                } else {
                    state.color.setValue(formatVal)
                    if (val !== formatVal) {
                        refs.input.model.value = formatVal
                    }
                }
            },
            inputBlur: () => {
                if (!!refs.input.model.value && refs.input.model.value !== state.color.color) {
                    $plain.$message('请输入正确的颜色值！')
                    refs.input.model.value = state.color.color
                }
            },
            inputEnter: async () => {
                await $plain.nextTick()
                if (!!refs.input.model.value && refs.input.model.value !== state.color.color) {
                    $plain.$message('请输入正确的颜色值！')
                    refs.input.model.value = state.color.color
                } else {
                    handler.confirm()
                }
            },
        }

        /*---------------------------------------watch-------------------------------------------*/

        watch(() => props.value, (val) => {
            state.color.setValue(val || defaultColor())
            state.val = state.color.color
        }, {lazy: true})

        watch(() => props.enableAlpha, (val) => {
            state.color.enableAlpha = val as boolean
            state.color.updateByAlpha()
        }, {lazy: true})

        watch(() => props.format, (val) => {
            state.color.format = val as ColorFormat || ColorFormat.hex
            state.color.format === ColorFormat.hex ? state.color.updateByHex() : state.color.updateByRgb()
        }, {lazy: true})

        return () => (
            <div class="pl-color-panel">
                <pl-color-sv-panel height="180"
                                   width="240"
                                   hue={state.color.hue}
                                   value={state.color.val}
                                   saturation={state.color.saturation}
                                   onChange={handler.svChange} onDblclick={handler.dblclickSvPanel}/>

                {!!state.color.enableAlpha && (
                    <pl-color-alpha-slider
                        size="180"
                        color={state.color.hex}
                        value={state.color.alpha}
                        onChange={handler.alphaChange}/>
                )}


                <pl-color-hue-slider size="240"
                                     value={state.color.hue}
                                     onInput={val => state.color.hue = val}
                                     onChange={handler.hueChange}/>
                <div class="pl-color-panel-input-group">
                    <pl-input ref="input"
                              size="mini"
                              value={state.val}
                              width={props.enableAlpha ? 204 : 186}
                              onChange={handler.inputChange}
                              onBlur={handler.inputBlur}
                              onEnter={handler.inputEnter}/>
                    <pl-button-group size="mini" mode="stroke">
                        <pl-button icon="el-icon-close" onClick={methods.reset}/>
                        <pl-button icon="el-icon-check" onClick={handler.confirm}/>
                    </pl-button-group>
                </div>
            </div>
        )
    },
})