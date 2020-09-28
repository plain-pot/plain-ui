import './cascade.scss'
import cascade from './cascade'
import panel from './cascade-panel'
import {installPlugin} from "@/util/install";

export default installPlugin([
    cascade,
    panel,
], [])