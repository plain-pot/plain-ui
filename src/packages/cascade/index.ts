import {PlCascade} from './cascade'
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import {PlCascadePanel} from "./panel/cascade-panel";

export default createComponentPlugin(PlCascade, {
    exposeComponents: {
        PlCascadePanel,
    }
})