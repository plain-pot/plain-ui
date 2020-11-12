import Service from './loading-mask-service'
import {registryRootService} from "../root/root-service";
import {createDefaultManager} from "../root/root-service-default-manager";
import {App} from 'vue';
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import LoadingMask from '../loading-mask'


export interface LoadingMaskServiceOption {
    message?: string,
    loadingType?: string,
    background?: string,
    unlock?: boolean,
}

export interface LoadingMaskServiceFormatOption extends LoadingMaskServiceOption {
    close: () => void
}

const getLoadingService = registryRootService(
    'loading',
    createDefaultManager('pl-loading-mask-manager', Service),
    (getManager) => {
        return {
            mask: (option: LoadingMaskServiceOption): LoadingMaskServiceFormatOption => {
                option = option || {};
                (async () => {
                    const manager = await getManager()
                    manager.service(option as LoadingMaskServiceFormatOption)
                })();
                return option as LoadingMaskServiceFormatOption
            }
        }
    }
)

export default createComponentPlugin({
    ...Service,
    getLoadingService,
}, [
    LoadingMask,
    {
        install(app: App) {
            app.mixin({
                beforeCreate() {
                    Object.defineProperty(this, '$loading', {
                        get() {
                            return getLoadingService(this)
                        },
                    })
                },
            })
        },
    }
])