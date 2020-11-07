import {designComponent} from "../../use/designComponent";
import {nextTick, reactive} from 'vue';
import {useRefList} from "../../use/useRefList";

export function createDefaultManager<ServiceComponent extends {
    use: {
        class: {
            isShow: { value: boolean },
            isOpen: { value: boolean },
            show: (...args: any[]) => any,
        }
    }
}>(name: string, serviceComponent: ServiceComponent) {
    return designComponent({
        name,
        setup() {

            const state = reactive({services: [0],})
            const refs = useRefList<ServiceComponent["use"]["class"]>()

            async function getService(): Promise<ServiceComponent["use"]["class"]> {
                for (let i = 0; i < refs.length; i++) {
                    const service = refs[i];
                    const {isShow, isOpen} = service
                    if (!isShow.value && !isOpen.value) {
                        return service
                    }
                }
                state.services.push(state.services.length)
                await nextTick()
                return getService()
            }

            return {
                refer: {
                    getService,
                },
                render: () => {
                    const ServiceComponent = serviceComponent as any
                    return (
                        <div class="pl-root-service-default-manager">
                            {state.services.map(i => <ServiceComponent key={i} ref="services"/>)}
                        </div>
                    )
                }
            }
        },
    })
}