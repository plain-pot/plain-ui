import {createComponentPlugin} from "../../utils/createComponentPlugin";
import {ColorPicker} from "./color-picker";
import {ColorAlphaSlider as alphaSlider} from "./sub/color-alpha-slider";
import {ColorHueSlider as hueSlider} from "./sub/color-hue-slider";
import {ColorSvPanel as svPanel} from "./sub/color-sv-panel";

const ColorAlphaSlider = createComponentPlugin(alphaSlider)
const ColorHueSlider = createComponentPlugin(hueSlider)
const ColorSvPanel = createComponentPlugin(svPanel)

export default {
    ColorAlphaSlider,
    ColorHueSlider,
    ColorSvPanel,
    ...createComponentPlugin(ColorPicker, [
        ColorAlphaSlider,
        ColorHueSlider,
        ColorSvPanel,
    ]),
}