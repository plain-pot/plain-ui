import {designComponent} from "../../use/designComponent";
import {nextTick, ref} from 'vue';
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

            const services = ref([] as any[])
            const refs = useRefList<ServiceComponent["use"]["class"]>()

            async function getService(option: any): Promise<ServiceComponent["use"]["class"]> {
                for (let i = 0; i < refs.length; i++) {
                    const service = refs[i];
                    const {isShow, isOpen} = service
                    if (!isShow.value && !isOpen.value) {
                        return service
                    }
                }
                services.value.push(option)
                await nextTick()
                return getService(option)
            }

            return {
                refer: {
                    name,
                    getService,
                },
                render: () => {
                    const ServiceComponent = serviceComponent as any
                    return (
                        <div class={name}>
                            {services.value.map((opt, i) => <ServiceComponent
                                key={i}
                                option={opt}
                                ref={(proxy: any) => refs[i] = proxy}
                            />)}
                        </div>
                    )
                }
            }
        },
    })
}