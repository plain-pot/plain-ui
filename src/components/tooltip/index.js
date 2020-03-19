import component from './pl-tooltip.vue'
import {TooltipDirective} from "./TooltipDrective";
import {plugin} from "../../utils";

export default plugin(component, [TooltipDirective])