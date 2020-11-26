import {reactive, computed, onBeforeUnmount} from 'vue';
import {useEdit} from "../../../use/useEdit";
import {PopperAgent} from "./utils";

export function useEditPopperAgent(
    {
        getAgent,
        event: {emit},
    }: {
        getAgent: () => PopperAgent | Promise<PopperAgent>,
        event: { emit: { blur: (e: Event) => void, focus: (e: Event) => void } },
    }) {

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
                state.agent = await getAgent()
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

    const handler = {
        clickInput: async () => await methods.toggle(),
        blur: async (e: Event) => {
            state.focusCounter--
            if (state.focusCounter === 0) {
                emit.blur(e)
                await methods.hide()
            }
        },
        focus: (e: Event) => {
            if (state.focusCounter === 0) {
                emit.focus(e)
            }
            state.focusCounter = 1
        },
        esc: async () => {
            await methods.hide()
        },
        enter: async (e: KeyboardEvent) => {
            e.stopPropagation()
            e.preventDefault()
            await methods.show()
        }
    }

    onBeforeUnmount(() => {
        if (!!state.agent) {
            state.agent.destroy()
        }
    })

    return {
        methods,
        handler,
        state,
        isShow,
        isOpen,
    }

}