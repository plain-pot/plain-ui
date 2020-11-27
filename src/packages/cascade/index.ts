import cascade from './cascade'
import panel from './panel/cascade-panel'
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import CascadeService from './service/cascade-service'

const CascadePanel = createComponentPlugin(panel)

export default {
    CascadePanel,
    CascadeService,
    ...createComponentPlugin(cascade, [
        CascadePanel,
        CascadeService,
    ]),
}