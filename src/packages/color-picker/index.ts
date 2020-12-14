import {createComponentPlugin} from "../../utils/createComponentPlugin";
import {ColorPicker} from "./color-picker";
import {ColorAlphaSlider} from "./sub/color-alpha-slider";
import {ColorHueSlider} from "./sub/color-hue-slider";
import {ColorSvPanel} from "./sub/color-sv-panel";
import {ColorPanel} from "./color-panel";
import ColorPickerService from './service/color-picker.service'

export default createComponentPlugin(ColorPicker, {
    exposeComponents: {
        ColorAlphaSlider,
        ColorHueSlider,
        ColorSvPanel,
        ColorPanel,
    },
    plugins: [ColorPickerService],
    expose: {
        ColorPickerService,
    }
})