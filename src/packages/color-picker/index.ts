import {createComponentPlugin} from "../../utils/createComponentPlugin";
import {ColorPicker} from "./color-picker";
import {ColorAlphaSlider as alphaSlider} from "./sub/color-alpha-slider";
import {ColorHueSlider as hueSlider} from "./sub/color-hue-slider";

const ColorAlphaSlider = createComponentPlugin(alphaSlider)
const ColorHueSlider = createComponentPlugin(hueSlider)

export default {
    ColorAlphaSlider,
    ColorHueSlider,
    ...createComponentPlugin(ColorPicker, [
        ColorAlphaSlider,
        ColorHueSlider,
    ]),
}