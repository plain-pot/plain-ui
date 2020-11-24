import {VNodeChild} from "../../../shims";
import {registryRootService} from "../../root/registryRootService";
import {createDefaultManager} from "../../root/createDefaultManager";
import {PopperService} from "./popper-service";
import {App} from 'vue';
import {installPlugin} from "../../../utils/installPlugin";
import Popper from '../../popper'

export interface PopperServiceOption {
    reference: () => any,
    render: () => VNodeChild,
    popperAttrs: () => any,
}

const getPopperService = registryRootService(
    'popper',
    createDefaultManager('pl-popper-manager', PopperService),
    (getManager) => {

        return (option: PopperServiceOption) => {
            getManager().then(manager => {
                manager.service(option)
            })
        }
    },
)

export default {
    install(app: App) {
        installPlugin(app, Popper)
        app.mixin({
            beforeCreate() {
                Object.defineProperty(this, '$popper', {
                    get() {
                        return getPopperService(this)
                    },
                })
            },
        })
    },
}