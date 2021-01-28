import {registryRootService} from "../root/registryRootService";
import {designComponent} from "../../use/designComponent";
import {VNodeChild} from "../../shims";
import {PropType, ref, reactive} from 'vue';
import {createDefaultService} from "../root/createDefaultService";
import {createDefaultManager} from "../root/createDefaultManager";

interface ContextmenuServiceOption {
    reference: MouseEvent | HTMLElement | { x: string, y: string }
    content: () => VNodeChild,
}

const Service = createDefaultService({
    name: 'pl-contextmenu-service',
    setup(option: ContextmenuServiceOption) {

        const isShow = ref(false)
        const state = reactive({
            option,
        })

        const service = (option: ContextmenuServiceOption) => {
            state.option = option
            isShow.value = true
        }

        return {
            refer: {
                isShow,
                isOpen: isShow,
                service,
            },
            render: () => {
                return (
                    <div class="pl-contextmenu-service" v-show={isShow.value}>
                        <div class="pl-contextmenu-service-body">
                            {state.option.content()}
                        </div>
                    </div>
                )
            }
        }

    },
})

export const getContextmenuService = registryRootService(
    'contextmenu',
    createDefaultManager('pl-contextmenu-service-manager', Service),
    (getManager) => {

    }
)