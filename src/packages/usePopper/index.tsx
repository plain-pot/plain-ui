import {createDefaultService} from "../PlRoot/createDefaultService";
import {computed, onBeforeUnmount, reactive, ref, VueNode} from "plain-ui-composition";
import {delay} from "plain-utils/utils/delay";
import PlPopper from "../PlPopper";

import {createUseService} from "../PlRoot/registryRootService";
import {createDefaultManager} from "../PlRoot/createDefaultManager";

export interface PopperServiceOption {
    reference: () => any,                                                   // popper reference 目标元素
    render: () => VueNode,                                                // popper content 内容
    popperAttrs: () => any,                                                 // pl-popper 属性或者监听的事件
    getService?: () => typeof PopperService.use.class,                     // option被提供服务之后，service与option绑定关系
    hideOnClickBody?: boolean,                                              // 是否点击外部body的时候自动关闭
}

const PopperService = createDefaultService({
    name: 'pl-popper-service',
    setup(option: PopperServiceOption) {

        const isShow = ref(false)
        const isOpen = ref(false)

        const state = reactive({
            option,
        })

        async function service(option: PopperServiceOption) {
            if (!option.getService || option.getService !== getRefer) {
                /*clear*/
                state.option.getService = undefined
                /*init*/
                state.option = option
                state.option.getService = getRefer
                await delay()
            }
            show()
        }

        function show() {
            isShow.value = true
        }

        function hide() {
            isShow.value = false
        }

        const refer = {
            state,
            isShow,
            isOpen,
            service,
            show,
            hide,
        }

        const getRefer = () => refer

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            onClickBody: (e: MouseEvent) => {
                if (state.option.hideOnClickBody !== false) {
                    hide()
                }
            }
        }

        return {
            refer,
            render: () => (
                <PlPopper
                    v-model={isShow.value}
                    {...{
                        trigger: 'manual',
                        reference: state.option.reference,
                        'onUpdate:open': (val: boolean) => isOpen.value = val,
                        ...handler,
                        ...(state.option.popperAttrs || {}),
                    }}
                    v-slots={{
                        popper: state.option.render,
                    }}
                />
            )
        }
    },
})

export const usePopper = createUseService({
    name: 'popper',
    optionsCallName: '$popper',
    managerComponent: createDefaultManager('pl-popper-manager', PopperService),
    createService: (getManager) => {
        return (option: PopperServiceOption) => {

            /*---------------------------------------create popper agent-------------------------------------------*/
            const state = reactive({option})
            const service = computed(() => !state.option.getService ? null : state.option.getService())
            const isShow = computed(() => !!service.value && service.value.isShow.value)
            const isOpen = computed(() => !!service.value && service.value.isShow.value)
            const agent = reactive({
                isShow,
                isOpen,
                service,
                show: () => !!agent.service ? agent.service.show() : getManager().then(manager => manager.service(state.option)),
                hide: () => !!agent.service && agent.service.hide(),
                toggle: () => isShow.value ? agent.hide() : agent.show(),
                destroy: () => {
                    agent.hide()
                    state.option.getService = undefined
                }
            })

            onBeforeUnmount(() => {
                agent.hide()
                state.option.getService = undefined
            })

            return agent
        }
    }
})

export default usePopper
