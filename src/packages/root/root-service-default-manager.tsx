import {designComponent} from "../../use/designComponent";
import {DefineComponent, nextTick, reactive} from 'vue';
import {useRefs} from "../../use/useRefs";

export interface RootServiceRefer {
    isShow: { value: boolean },
    isOpen: { value: boolean },
    show: (option: any) => void | Promise<void>,
}

export default designComponent({
    name: 'pl-root-service-controller',
    props: {
        id: {type: Number},
        serviceComponent: {type: Object},
    },
    setup({props}) {

        const {refs} = useRefs({
            services: Object as any as (new() => RootServiceRefer[])
        })

        const state = reactive({
            services: [0],
        })

        const getService = async (): Promise<RootServiceRefer> => {
            for (let i = 0; i < refs.services.length; i++) {
                const service = refs.services[i];
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
                const ServiceComponent = props.serviceComponent as DefineComponent
                return (
                    <div class="pl-root-service-controller">
                        {state.services.map(i => <ServiceComponent key={i} ref="services"/>)}
                    </div>
                )
            }
        }
    },
})