import plc from './plc'
import PlcGroup from './plc-group'
import PlcCollector from './plc-collector'
import {createComponentPlugin} from "../../../utils/createComponentPlugin";

export default createComponentPlugin(plc, {
    exposeComponents: {
        PlcGroup,
        PlcCollector,
    }
})