import {createComponentPlugin} from "../../utils/createComponentPlugin";
import {ColorPicker} from "./color-picker";
import {ColorAlphaSlider as alphaSlider} from "./sub/color-alpha-slider";
import {ColorHueSlider as hueSlider} from "./sub/color-hue-slider";
import {ColorSvPanel as svPanel} from "./sub/color-sv-panel";
import {ColorPanel as panel} from "./color-panel";
import ColorPickerService from './service/color-picker.service'

const ColorAlphaSlider = createComponentPlugin(alphaSlider)
const ColorHueSlider = createComponentPlugin(hueSlider)
const ColorSvPanel = createComponentPlugin(svPanel)
const ColorPanel = createComponentPlugin(panel)

export default {
    ColorAlphaSlider,
    ColorHueSlider,
    ColorSvPanel,
    ColorPanel,
    ColorPickerService,
    ...createComponentPlugin(ColorPicker, [
        ColorAlphaSlider,
        ColorHueSlider,
        ColorSvPanel,
        ColorPanel,
        ColorPickerService,
    ]),
}