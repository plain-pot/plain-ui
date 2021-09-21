import {createServiceWithoutContext, createUseService} from "../../PlRoot/registryRootService";
import {createDefaultManager} from "../../PlRoot/createDefaultManager";
import Service from './Service'

export interface LoadingMaskServiceOption {
    message?: string,
    loadingType?: string,
    background?: string,
    unlock?: boolean,
}

export interface LoadingMaskServiceFormatOption extends LoadingMaskServiceOption {
    close: () => void
}

export const useLoadingMask = createUseService({
        name: 'loading',
        managerComponent: createDefaultManager('pl-loading-mask-manager', Service),
        createService: (getManager) => {
            return (option: LoadingMaskServiceOption): LoadingMaskServiceFormatOption => {
                option = option || {};
                getManager().then(manager => manager.service(option as LoadingMaskServiceFormatOption));
                return option as LoadingMaskServiceFormatOption
            }
        }
    },
)

export const $$loadingMask = createServiceWithoutContext(useLoadingMask)