import {reactive, computed, onBeforeUnmount, ComponentPublicInstance, getCurrentInstance} from 'vue';
import {useEdit} from "../../../use/useEdit";
import {PopperAgent, SpecificPopperServiceOption} from "./utils";

export type EditPopperAgent = ReturnType<typeof useEditPopperAgent>

export function useEditPopperAgent(
    {
        event: {emit},
        serviceGetter,
        option,
    }: {
        event: { emit: { onBlur: (e: Event) => void, onFocus: (e: Event) => void } },
        serviceGetter: (ins: ComponentPublicInstance) => ((o: SpecificPopperServiceOption) => PopperAgent),
        option: SpecificPopperServiceOption,
    }) {

    const ctx = getCurrentInstance()!
    const {editComputed} = useEdit()

    const state = reactive({
        agent: null as null | PopperAgent,
        focusCounter: 0,
    })

    const isShow = computed(() => !!state.agent && state.agent.isShow)
    const isOpen = computed(() => !!state.agent && state.agent.isOpen)

    const methods = {
        show: async () => {
            if (!editComputed.value.editable) return
            if (isShow.value) return;
            if (!state.agent) {
                state.agent = await serviceGetter(ctx.proxy!)(option)
            }
            await state.agent.show()
        },
        hide: async () => {
            if (!isShow.value) return
            await state.agent!.hide()
        },
        toggle: async () => {
            isShow.value ? methods.hide() : methods.show()
        }
    }

    const inputHandler = {
        onClickInput: async () => await methods.toggle(),
        onBlur: async (e: Event) => {
            state.focusCounter--
            if (state.focusCounter === 0) {
                emit.onBlur(e)
                await methods.hide()
            }
        },
        onFocus: (e: Event) => {
            if (state.focusCounter === 0) {
                emit.onFocus(e)
            }
            state.focusCounter = 1
        },
        onEsc: async () => {
            await methods.hide()
        },
        onEnter: async (e: KeyboardEvent) => {
            e.stopPropagation()
            e.preventDefault()
            await methods.show()
        }
    }

    /**
     * 当前组件示例销毁的时候，解除与service的绑定关系
     * @author  韦胜健
     * @date    2020/11/27 10:12
     */
    onBeforeUnmount(() => {
        if (!!state.agent) {
            state.agent.destroy()
        }
    })

    return {
        methods,
        inputHandler,
        state,
        isShow,
        isOpen,
        editComputed,
    }

}