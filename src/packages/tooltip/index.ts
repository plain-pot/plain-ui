import Tooltip from './tooltip'
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import {App} from 'vue';
import {TooltipDirective} from "./tooltip-directive";

export default createComponentPlugin(Tooltip, [
    {
        install(app: App) {
            app.directive('tooltip', TooltipDirective)
        },
    }
])