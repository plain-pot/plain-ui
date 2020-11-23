import {createComponentPlugin} from "../../utils/createComponentPlugin";
import {ColorPicker} from "./color-picker";
import {ColorAlphaSlider as alphaSlider} from "./sub/color-alpha-slider";

const ColorAlphaSlider = createComponentPlugin(alphaSlider)

export default {
    ColorAlphaSlider,
    ...createComponentPlugin(ColorPicker, [
        ColorAlphaSlider,
    ]),
}