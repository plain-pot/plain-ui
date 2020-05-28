import {usePopperController} from "@/packages/popper/service/PopperController";
import {$plain} from "@/packages/base";
import {usePopperAgent} from "@/packages/popper/service/PopperAgent";
import {usePopperServiceComponent} from "@/packages/popper/service/PopperServiceComponent";

export default {
    install() {

        let controllerService;
        const DropdownServiceComponent = usePopperServiceComponent({
            name: 'pl-dropdown-service',
            content: (h, ctx) => {
                return (
                    <pl-dropdown-content
                        slot="popper"
                        key={ctx.state.count}
                        {
                            ...{
                                props: ctx.options.value.props,
                                on: ctx.options.value.listener,
                            }
                        }
                    />
                )
            },
            defaultPopperProps: {
                noContentPadding: true,
            },
            externalListener: {
                'click-item'() {
                    if ((this as any).options.value.props.closeOnClickItem !== false) {
                        this.hide()
                    }
                },
            },
            hideOnClickBody: false,
        })

        const DropdownController = usePopperController('pl-dropdown-service-controller', DropdownServiceComponent)

        // @ts-ignore
        $plain.$dropdown = (option) => {
            if (!controllerService) {
                controllerService = $plain.newInstance(DropdownController)
            }
            return usePopperAgent(option, controllerService)
        }
    },
}