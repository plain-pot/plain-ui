import cascade from './cascade'
import panel from './service/cascade-panel'
import {createComponentPlugin} from "../../utils/createComponentPlugin";

const CascadePanel = createComponentPlugin(panel)

export default {
    CascadePanel,
    ...createComponentPlugin(cascade, [
        CascadePanel,
    ]),
}