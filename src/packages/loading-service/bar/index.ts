import Service from './loading-bar-service'
import {createDefaultManager} from "../../root/createDefaultManager";
import {registryRootService} from "../../root/root-service";
import {RequireFormat} from "../../../shims";

export interface LoadingBarOption {
    color?: string,
    doneColor?: string,
    failColor?: string,
    height?: number,
    percent?: number,
    autoStart?: boolean,
    autoProcess?: boolean,
}

export type LoadingBarFormatOption = RequireFormat<LoadingBarOption,
    "color" | "doneColor" | "failColor" | "height" | "percent" | "autoStart" | "autoProcess">

export interface LoadingBarHandler {
    init: (option: LoadingBarOption) => void,
    update: (option: LoadingBarOption) => void,
    start: () => void,
    done: () => void,
    fail: () => void,
}

export enum LoadingBarStatus {
    wait = 'wait',
    process = 'process',
    done = 'done',
    fail = 'fail',
}

function formatOption(option: LoadingBarOption): LoadingBarFormatOption {
    return Object.assign(option, {
        color: option.color || 'primary',
        doneColor: option.doneColor || 'primary',
        failColor: option.failColor || 'error',
        percent: option.percent || 0,
        height: option.height || 4,
        autoStart: option.autoStart == null ? true : option.autoStart,
        autoProcess: option.autoProcess == null ? true : option.autoProcess,
    }) as LoadingBarFormatOption
}

export const getLoadingBarService = registryRootService(
    'loading-bar',
    createDefaultManager('pl-loading-bar-manager', Service),
    getManager => {
        return (option?: LoadingBarOption): LoadingBarFormatOption & LoadingBarHandler => {
            const fo = formatOption(option || {})
            getManager().then(manager => manager.service(fo))
            return fo as any
        }
    }
)