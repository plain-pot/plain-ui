import {designComponent} from "../../use/designComponent";
import {LoadingMaskServiceFormatOption} from "./index";
import {reactive, ref} from 'vue';

export default designComponent({
    name: 'loading-mask-service',
    props: {
        option: {type: Object as any as new() => LoadingMaskServiceFormatOption, required: true},
    },
    setup({props}) {

        const isShow = ref(false)

        const state = reactive({
            option: props.option,
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

        service(props.option)

        return {
            refer: {
                isShow,
                isOpen: isShow,
                service,
            },
            render: () => {
                return (
                    <pl-loading-mask
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
    },
})