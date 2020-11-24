import {createDefaultService} from "../../root/createDefaultService";
import {PopperServiceOption} from "./index";
import {ref, reactive, nextTick} from 'vue';

export const PopperService = createDefaultService({
    name: 'pl-popper-service',
    setup(option: PopperServiceOption) {

        const isShow = ref(false)
        const isOpen = ref(false)

        const state = reactive({
            option,
        })

        async function service(option: PopperServiceOption) {
            state.option = option
            await nextTick()
            isShow.value = true
        }

        return {
            refer: {
                isShow,
                isOpen,
                service,
            },
            render: () => (
                <pl-popper
                    v-model={isShow.value}
                    {...{
                        trigger: 'click',
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