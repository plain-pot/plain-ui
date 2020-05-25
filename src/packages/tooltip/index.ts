import './tooltip.scss'
import tooltip from './tooltip'
import {installPlugin} from "@/util/install";
import {TooltipDirective} from "@/packages/tooltip/TooltipDirective";

export default installPlugin([
    tooltip,
], [
    TooltipDirective,
])