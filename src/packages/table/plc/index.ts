import plc from './plc'
import group from './plc-group'
import collector from './plc-collector'

import {installPlugin} from "@/util/install";

export default installPlugin([
    plc, group, collector,
])