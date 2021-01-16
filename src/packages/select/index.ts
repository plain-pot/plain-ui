import {PlSelect} from './select'
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import {PlSelectPanel} from "./select-panel";

export default createComponentPlugin(PlSelect, {
    exposeComponents: {
        PlSelectPanel,
    },
})