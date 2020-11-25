import {VNodeChild} from "../../../shims";
import {registryRootService} from "../../root/registryRootService";
import {createDefaultManager} from "../../root/createDefaultManager";
import {PopperService} from "./popper-service";
import {App, reactive, computed} from 'vue';
import {installPlugin} from "../../../utils/installPlugin";
import Popper from '../../popper'

export interface PopperServiceOption {
    reference: () => any,
    render: () => VNodeChild,
    popperAttrs: () => any,

    getService?: () => typeof PopperService.use.class
}

export type PopperAgent = ReturnType<typeof getPopperService>

const getPopperService = registryRootService(
    'popper',
    createDefaultManager('pl-popper-manager', PopperService),
    (getManager) => {

        return (option: PopperServiceOption) => {

            /*---------------------------------------create popper agent-------------------------------------------*/
            const state = reactive({
                option,
            })
            const service = computed(() => {
                if (!state.option.getService) {
                    return null
                }
                const refer = state.option.getService()
                if (refer.state.option !== state.option) {
                    return null
                }
                return refer
            })
            const isShow = computed(() => !!service.value && service.value.isShow.value)
            const isOpen = computed(() => !!service.value && service.value.isShow.value)

            const agent = reactive({
                isShow, isOpen, service,
                show: () => {
                    if (!!agent.service) {
                        agent.service.show()
                    } else {
                        getManager().then(manager => manager.service(option))
                    }
                },
                hide: () => {
                    if (!!agent.service) {
                        agent.service.hide()
                    }
                },
                toggle: () => {
                    if (isShow.value) {
                        agent.hide()
                    } else {
                        agent.show()
                    }
                },
            })

            return agent
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