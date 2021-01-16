import {createComponentPlugin} from "../../utils/createComponentPlugin";
import {PlColorPicker} from "./color-picker";
import {PlColorAlphaSlider} from "./sub/color-alpha-slider";
import {PlColorHueSlider} from "./sub/color-hue-slider";
import {PlColorSvPanel} from "./sub/color-sv-panel";
import {PlColorPanel} from "./color-panel";

export default createComponentPlugin(PlColorPicker, {
    exposeComponents: {
        PlColorAlphaSlider,
        PlColorHueSlider,
        PlColorSvPanel,
        PlColorPanel,
    }
})