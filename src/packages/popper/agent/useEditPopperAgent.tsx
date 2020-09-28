import {PopperAgent} from "@/packages/popper/agent/type";
import {useEdit} from "@/use/useEdit";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {computed, onBeforeUnmount, reactive} from "@vue/composition-api";

export function useEditPopperAgent(agentGetter: () => PopperAgent | Promise<PopperAgent>) {

    const {editComputed} = useEdit()
    const {emit} = useEvent({
        blur: EmitFunc,
        focus: EmitFunc,
    })
    const state = reactive({
        agent: null as PopperAgent | null,
        focusCounter: 0,
    })

    const isShow = computed(() => {
        if (!state.agent) return false
        return state.agent.state.show
    })

    const isOpen = computed(() => {
        if (!state.agent) return false
        return state.agent.state.open
    })

    const methods = {
        show: async () => {
            if (!editComputed.value.editable) return
            if (isShow.value) return;
            if (!state.agent) {
                state.agent = await agentGetter()
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
        clickInput: async () => {
            await methods.toggle()
        },
        blur: async () => {
            state.focusCounter--
            if (state.focusCounter === 0) {
                emit.blur()
                await methods.hide()
            }
        },
        focus: () => {
            if (state.focusCounter === 0) {
                emit.focus()
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