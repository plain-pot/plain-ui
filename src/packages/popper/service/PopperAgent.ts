import {PopperAgentOption} from "@/packages/popper/service/PopperAgentOption";
import {computed, onBeforeUnmount, reactive, Ref} from "@vue/composition-api";
import {PopperController} from "@/packages/popper/service/PopperController";
import {PopperServiceComponent} from "@/packages/popper/service/PopperServiceComponent";
import {useEdit} from "@/use/useEdit";
import {EmitFunc, useEvent} from "@/use/useEvent";

export interface PopperAgent {
    option: PopperAgentOption | (() => PopperAgentOption),
    controller: PopperController,
    service?: PopperServiceComponent,

    show: () => void | Promise<any>,
    hide: () => void | Promise<any>,
    toggle: () => void | Promise<any>,
    destroy: () => void | Promise<any>,

    isShow: boolean,
    isOpen: boolean,
}

export function usePopperAgent(option: PopperAgentOption, controller: PopperController): PopperAgent {

    const state = reactive({
        option,
        controller,
        service: null as PopperServiceComponent | null,

        show: null,
        hide: null,
        toggle: null,
        destroy: null,

        isShow: null,
        isOpen: null,
    })

    const isShow = computed(() => {
        if (!state.service) return false
        return state.service.state.show
    })

    const isOpen = computed(() => {
        if (!state.service) return false
        return state.service.state.open
    })

    const methods = {
        show: async () => {
            if (isShow.value) return
            if (!isOpen.value) {
                state.service = await controller.getInstance()
                state.service!.bind(state)
            }
            await state.service!.show()
        },
        hide: async () => {
            if (!isShow.value) return
            await state.service!.hide()
        },
        toggle: async () => {
            if (!!isShow.value) {
                await methods.hide()
            } else {
                await methods.show()
            }
        },
        destroy: () => {
            if (!!isShow.value) {
                methods.hide()
            }
            if (!!state.service) {
                state.service.unbind(state)
            }
        },
    }

    Object.assign(state, {
        ...methods,
        isShow,
        isOpen,
    })

    // @ts-ignore
    return state as PopperAgent
}

export function usePopperAgentEditor(creator: () => Promise<PopperAgent>) {

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
        return state.agent.isShow
    })

    const isOpen = computed(() => {
        if (!state.agent) return false
        return state.agent.isOpen
    })

    const methods = {
        show: async () => {
            if (!editComputed.value.editable) return
            if (isShow.value) return;
            if (!state.agent) {
                state.agent = await creator()
            }
            state.agent.show()
        },
        hide: async () => {
            if (!isShow.value) return
            state.agent!.hide()
        },
        toggle: async () => {
            if (isShow.value) {
                methods.hide()
            } else {
                methods.show()
            }
        }
    }

    const handler = {
        clickInput: () => {
            methods.toggle()
        },
        blur: () => {
            state.focusCounter--
            if (state.focusCounter === 0) {
                emit.blur()
                methods.hide()
            }
        },
        focus: () => {
            if (state.focusCounter === 0) {
                emit.focus()
            }
            state.focusCounter = 1
        },
        esc: () => {
            methods.hide()
        },
        enter: (e: KeyboardEvent) => {
            e.stopPropagation()
            e.preventDefault()
            methods.show()
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