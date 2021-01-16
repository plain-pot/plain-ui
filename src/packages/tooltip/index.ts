import {PlTooltip} from './tooltip'
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import {App} from 'vue';
import {TooltipDirective} from "./tooltip-directive";

export default createComponentPlugin(PlTooltip, {
    plugins: [
        {
            install(app: App) {
                app.directive('tooltip', TooltipDirective)
            },
        }
    ]
})