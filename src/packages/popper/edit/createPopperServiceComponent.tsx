import {createDefaultService} from "../../root/createDefaultService";
import {nextTick, reactive, ref} from 'vue';
import {PopperServiceComponentOption} from "./utils";

export function createPopperServiceComponent(name: string) {
    return createDefaultService({
        name,
        setup(option: PopperServiceComponentOption) {
            const isShow = ref(false)
            const isOpen = ref(false)

            const state = reactive({
                option,
            })

            async function service(option: PopperServiceComponentOption) {
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

            return {
                refer,
                render: () => (
                    <pl-popper
                        v-model={isShow.value}
                        {...{
                            trigger: 'manual',
                            reference: state.option.serviceOption.reference,
                            'onUpdate:open': (val: boolean) => isOpen.value = val,
                        }}
                        v-slots={{
                            // todo
                            popper: () => state.option.defaultOption.render({}),
                        }}
                    />
                )
            }
        },
    })
}