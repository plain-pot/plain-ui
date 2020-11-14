import Loading from '../loading'
import LoadingMask from '../loading-mask'
import {App} from 'vue';
import {installPlugin} from "../../utils/installPlugin";
import {LoadingMaskDirective} from "./mask/loading-mask-directive";
import {getLoadingMaskService} from "./mask";

export default {
    install(app: App) {
        installPlugin(app, Loading)
        installPlugin(app, LoadingMask)
        app.directive('loading', LoadingMaskDirective)
        app.mixin({
            beforeCreate() {
                Object.defineProperty(this, '$loading', {
                    get() {
                        return {
                            mask: getLoadingMaskService(this),
                        }
                    },
                })
            },
        })
    },
}