import plc from './plc'
import group from './plc-group'
import {installPlugin} from "@/util/install";

export default installPlugin([
    plc, group,
])