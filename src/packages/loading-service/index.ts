import Loading from '../loading'
import LoadingMask from '../loading-mask'
import {App} from 'vue';
import {installPlugin} from "../../utils/installPlugin";
import {LoadingMaskDirective} from "./mask/loading-mask-directive";
import {getLoadingMaskService} from "./mask";
import {getLoadingBarService} from "./bar";
import './loading-service.scss'

export default {
    install(app: App) {
        installPlugin(app, Loading)
        installPlugin(app, LoadingMask)
        app.directive('loading', LoadingMaskDirective)
        app.mixin({
            computed: {
                $loading() {
                    return {
                        mask: getLoadingMaskService(this),
                        bar: getLoadingBarService(this),
                    }
                },
            },
        })
    },
}