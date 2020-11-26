import {VNodeChild} from "../../../shims";
import {ComponentPublicInstance, computed, reactive} from 'vue';
import {registryRootService} from "../../root/registryRootService";
import {createDefaultManager} from "../../root/createDefaultManager";
import {createPopperServiceComponent, SpecificPopperServiceOption} from "./createPopperServiceComponent";

interface ExternalOption {}

export function createAgentGetter(
    {
        name,
        render,
    }: {
        name: string,
        render: (attrs: any) => VNodeChild,
    }
) {
    return (ins: ComponentPublicInstance) => {

        /*---------------------------------------Specific Popper Service-------------------------------------------*/

        const popperServiceGetter = registryRootService(
            name,
            createDefaultManager(
                `pl-popper-service-${name}-manager`,
                createPopperServiceComponent({
                    name: `pl-popper-service-${name}`,
                    render: () => render({}),
                })
            ),
            (getManager) => {
                return (option: SpecificPopperServiceOption & ExternalOption) => {
                    /*---------------------------------------create popper agent-------------------------------------------*/
                    const state = reactive({option})
                    const service = computed(() => !state.option.getService ? null : state.option.getService())
                    const isShow = computed(() => !!service.value && service.value.isShow.value)
                    const isOpen = computed(() => !!service.value && service.value.isShow.value)
                    const agent = reactive({
                        isShow,
                        isOpen,
                        service,
                        show: () => !!agent.service ? agent.service.show() : getManager().then(manager => manager.service(option)),
                        hide: () => !!agent.service && agent.service.hide(),
                        toggle: () => isShow.value ? agent.hide() : agent.show(),
                        destroy: () => {
                            agent.hide()
                            state.option.getService = undefined
                        }
                    })
                    return agent
                }
            },
        )

        return popperServiceGetter(ins)
    }
}