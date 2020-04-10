import PlainService from "../../service/service";
import Panel from "../pl-cascade-panel";

export default {
    install(Vue) {
        let controllerService;

        let $plain = Vue.prototype.$plain
        const CascadeAgent = PlainService.agent()
        const CascadeService = PlainService.service({
            name: 'pl-cascade-service',
            // @ts-ignore
            emitters: Panel.emitters,
            content: (h, context) => {
                return (
                    <pl-cascade-panel slot="popper"
                                      key={context.count}
                                      {...{
                                          props: context.options.props,
                                          on: context.options.listener,
                                      }}/>
                )
            },
            externalListener: {
                change() {
                    if (!this.options.props.selectBranch) {
                        this.hide()
                    }
                },
            },
            defaultPopperProps: {
                transition: 'pl-transition-popper-drop',
                arrow: false,
                height: '200px',
            }
        })

        const ColorController = PlainService.factory('pl-cascade-service-controller', CascadeService)

        $plain.$cascade = (option) => {
            if (!controllerService) {
                controllerService = $plain.newInstance(ColorController)
            }
            return new CascadeAgent(option, controllerService)
        }

    },
}