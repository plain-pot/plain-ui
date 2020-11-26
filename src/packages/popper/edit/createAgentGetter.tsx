import {ComponentPublicInstance, computed, reactive} from 'vue';
import {registryRootService, RootServiceScope} from "../../root/registryRootService";
import {createDefaultManager} from "../../root/createDefaultManager";
import {createPopperServiceComponent} from "./createPopperServiceComponent";
import {CreateAgentGetterOption, PopperAgent, PopperServiceComponentOption, SpecificPopperServiceOption} from './utils';

interface ExternalOption {
    reference: any
}

export function createAgentGetter(defaultOption: CreateAgentGetterOption, scope = RootServiceScope.ins) {

    function create(ins: ComponentPublicInstance) {
        const name = defaultOption.name
        /*---------------------------------------Specific Popper Service-------------------------------------------*/
        const popperServiceGetter = registryRootService(
            name,
            createDefaultManager(
                `pl-popper-service-${name}-manager`,
                createPopperServiceComponent(`pl-popper-service-${name}`)
            ),
            (getManager) => {
                return (serviceOption: SpecificPopperServiceOption & ExternalOption): PopperAgent => {

                    const option: PopperServiceComponentOption = {
                        defaultOption,
                        serviceOption,
                        getService: undefined,
                    }

                    /*---------------------------------------create popper agent-------------------------------------------*/
                    const state = reactive({option})
                    const service = computed(() => !state.option.getService ? null : state.option.getService())
                    const isShow = computed(() => !!service.value && service.value.isShow.value)
                    const isOpen = computed(() => !!service.value && service.value.isShow.value)
                    const agent = reactive({
                        isShow,
                        isOpen,
                        service,
                        show: () => {!!agent.service ? agent.service.show() : getManager().then(manager => manager.service(option))},
                        hide: () => {!!agent.service && agent.service.hide()},
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

    const cacheMap = new WeakMap<ComponentPublicInstance, ReturnType<typeof create>>()

    return (ins: ComponentPublicInstance) => {
        const cacheKey = scope === RootServiceScope.ins ? ins : ins.$root!
        let service = cacheMap.get(cacheKey)
        if (!!service) {
            return service
        }
        service = create(ins)
        cacheMap.set(cacheKey, service)
        return service
    }
}