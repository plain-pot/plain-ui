import {createDefaultService} from "../../root/createDefaultService";
import {PopperServiceOption} from "./index";
import {nextTick, reactive, ref} from 'vue';

export const PopperService = createDefaultService({
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
                await nextTick()
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
                console.log('onClickBody', e)
            }
        }

        return {
            refer,
            render: () => (
                <pl-popper
                    v-model={isShow.value}
                    {...{
                        trigger: 'manual',
                        reference: state.option.reference,
                        'onUpdate:open': (val: boolean) => isOpen.value = val,
                        ...handler,
                    }}
                    v-slots={{
                        popper: state.option.render,
                    }}
                />
            )
        }
    },
})