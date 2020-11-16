import Service from './loading-mask-service'
import {registryRootService} from "../../root/registryRootService";
import {createDefaultManager} from "../../root/createDefaultManager";

export interface LoadingMaskServiceOption {
    message?: string,
    loadingType?: string,
    background?: string,
    unlock?: boolean,
}

export interface LoadingMaskServiceFormatOption extends LoadingMaskServiceOption {
    close: () => void
}

export const getLoadingMaskService = registryRootService(
    'loading',
    createDefaultManager('pl-loading-mask-manager', Service),
    (getManager) => {
        return (option: LoadingMaskServiceOption): LoadingMaskServiceFormatOption => {
            option = option || {};
            getManager().then(manager => manager.service(option as LoadingMaskServiceFormatOption));
            return option as LoadingMaskServiceFormatOption
        }
    }
)