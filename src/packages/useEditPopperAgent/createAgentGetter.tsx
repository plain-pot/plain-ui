import {createUseService} from "../PlRoot/registryRootService";
import {createDefaultManager} from "../PlRoot/createDefaultManager";
import {computed, reactive} from 'plain-ui-composition';
import {createPopperServiceComponent} from "./createPopperServiceComponent";
import {CreateAgentGetterOption, PopperAgent, PopperServiceComponentOption, SpecificPopperServiceOption} from "./useEditPopperAgent.utils";
import {PlRoot} from "../PlRoot";

/**
 * 创建一个获取popper agent的函数
 * @author  韦胜健
 * @date    2020/11/26 21:15
 */
export function createUseEditPopperAgent(defaultOption: CreateAgentGetterOption) {
    const useService = (() => {
        const name = defaultOption.name
        /*---------------------------------------Specific Popper Service-------------------------------------------*/
        return createUseService({
            name,
            managerComponent: createDefaultManager(
                `pl-popper-service-${name}-manager`,
                createPopperServiceComponent(`pl-popper-service-${name}`)
            ),
            createService: (getManager) => {
                return (serviceOption: SpecificPopperServiceOption): PopperAgent => {
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
                        state: state as { option: PopperServiceComponentOption },
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
            }
        })
    })();

    const cacheMap = new WeakMap<any, ReturnType<typeof useService>>()
    return () => {
        const root = PlRoot.use.inject()
        let service = cacheMap.get(root)
        if (!!service) {return service}
        service = useService()
        cacheMap.set(root, service)
        return service!
    }
}
