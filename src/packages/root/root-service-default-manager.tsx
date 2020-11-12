import {designComponent} from "../../use/designComponent";
import {nextTick, ref} from 'vue';
import {useRefList} from "../../use/useRefList";

export function createDefaultManager<Option>(
    managerName: string,
    serviceComponent: {
        use: {
            class: {
                isShow: { value: boolean },
                isOpen: { value: boolean },
                service: (option: Option) => any,
            }
        }
    }) {
    return designComponent({
        name: managerName,
        setup() {

            const options = ref([] as Option[])
            const refs = useRefList<typeof serviceComponent["use"]["class"]>()

            const service = async (option: Option): Promise<void> => {
                for (let i = 0; i < refs.length; i++) {
                    const item = refs[i];
                    const {isShow, isOpen} = item
                    if (!isShow.value && !isOpen.value) {
                        return item.service(option)
                    }
                }
                options.value.push(option as any)
                await nextTick()
            }

            return {
                refer: {
                    managerName,
                    service,
                },
                render: () => {
                    const ServiceComponent = serviceComponent as any
                    return (
                        <div class={managerName}>
                            {options.value.map((opt, i) => <ServiceComponent
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