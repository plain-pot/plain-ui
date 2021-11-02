import {designComponent, useRefList, ref} from "plain-ui-composition";
import {delay} from "plain-utils/utils/delay";

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
                using?: boolean,
            }
        }
    },
    isItemAvailable?: (refs: typeof serviceComponent.use.class[], opt: Option) => null | typeof serviceComponent.use.class,
) {
    return designComponent({
        name: managerName,
        props: {
            name: {required: true},
            Component: {required: true},
        },
        setup({props}) {

            const options = ref([] as Option[])
            const {refList, onRefList} = useRefList(serviceComponent)

            /**
             * 获取一个 非show以及open的 service提供服务，如果存在
             * 符合这个条件的service，直接调用service函数，否则创建
             * 一个service，这个service在setup末尾需要调用一次service
             * 函数；
             * @author  韦胜健
             * @date    2020/11/26 9:23
             */
            const service = async (option: Option): Promise<void> => {
                const markItem = (item: any) => {
                    item.using = true
                    setTimeout(() => item.using = false)
                    return item.service(option)
                }

                if (isItemAvailable) {
                    const item = isItemAvailable(refList, option)
                    if (!!item) {
                        return markItem(item)
                    }
                } else {
                    for (let i = 0; i < refList.length; i++) {
                        const item = refList[i];
                        const {isShow, isOpen, using} = item
                        if (!isShow.value && !isOpen.value && !using) {
                            return markItem(item)
                        }
                    }
                }

                // 没有合适的item，创建新的item提供服务
                options.value.push(option as any)
                await delay()
            }

            return {
                refer: {
                    managerName,
                    service,
                    props,
                },
                render: () => {
                    const ServiceComponent = serviceComponent as any
                    return (
                        <div class={managerName}>
                            {options.value.map((opt, i) => <ServiceComponent
                                key={i}
                                option={opt}
                                ref={onRefList(i)}
                            />)}
                        </div>
                    )
                }
            }
        },
    })
}
