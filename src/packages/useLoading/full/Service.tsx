import {createDefaultService} from "../../PlRoot/createDefaultService";
import {LoadingMaskServiceFormatOption} from "./index";
import {reactive, ref} from "plain-ui-composition";
import {PlLoadingMask} from "../../PlLoadingMask";


export default createDefaultService({
    name: 'loading-mask-service',
    setup: (option: LoadingMaskServiceFormatOption) => {
        const isShow = ref(false)

        const state = reactive({
            option,
            key: 0,
        })

        const hide = () => isShow.value = false

        const service = (option: LoadingMaskServiceFormatOption) => {
            option.close = hide
            state.option = option
            state.key++
            isShow.value = true
            return hide
        }

        return {
            refer: {
                isShow,
                isOpen: isShow,
                service,
            },
            render: () => {
                return (
                    <PlLoadingMask
                        key={state.key}
                        v-model={isShow.value}
                        message={state.option.message}
                        loadingType={state.option.loadingType}
                        background={state.option.background}
                        unlock={state.option.unlock}
                        fixedPosition
                    />
                )
            }
        }
    }
})
