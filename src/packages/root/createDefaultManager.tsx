import {designComponent} from "../../use/designComponent";
import {nextTick, ref} from 'vue';
import {useRefList} from "../../use/useRefList";

/**
 * 创建一个默认的 root service manager组件
 * @author  韦胜健
 * @date    2020/11/26 9:20
 */
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

            /**
             * 获取一个 非show以及open的 service提供服务，如果存在
             * 符合这个条件的service，直接调用service函数，否则创建
             * 一个service，这个service在setup末尾需要调用一次service
             * 函数；
             * @author  韦胜健
             * @date    2020/11/26 9:23
             */
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