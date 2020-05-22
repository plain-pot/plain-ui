import {PopperAgentOption} from "@/packages/popper/service/PopperAgentOption";
import {reactive} from "@vue/composition-api";

export function usePopperAgent(option?: PopperAgentOption, ControllerInstance?) {

    const state = reactive({
        instance: null,
        flag: false,
    })
    const methods = {
        show: () => {
            state.flag = true
        },
        hide: () => {
            state.flag = false
        },
    }

    return {
        state,
        methods,
    }
}