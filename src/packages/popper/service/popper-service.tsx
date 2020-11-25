import {createDefaultService} from "../../root/createDefaultService";
import {PopperServiceOption} from "./index";
import {ref, reactive, nextTick, onBeforeUnmount} from 'vue';

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
        /**
         * 热更新的时候，root会销毁所有manager，此时需要将当前 popper-service与option解绑
         * @author  韦胜健
         * @date    2020/11/25 21:01
         */
        onBeforeUnmount(() => state.option.getService = undefined)

        return {
            refer,
            render: () => (
                <pl-popper
                    v-model={isShow.value}
                    {...{
                        trigger: 'manual',
                        reference: state.option.reference,
                        'onUpdate:open': (val: boolean) => isOpen.value = val
                    }}
                    v-slots={{
                        popper: state.option.render,
                    }}
                />
            )
        }
    },
})