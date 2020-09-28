import {PopperAgent, PopperAgentOption} from "@/packages/popper/agent/type";
import {PopperController} from "@/packages/popper/agent/createPopperController";
import {computed, onBeforeUnmount, reactive} from "@vue/composition-api";
import {useEdit} from "@/use/useEdit";
import {EmitFunc, useEvent} from "@/use/useEvent";

let count = 0

export function usePopperAgent(optionGetter: () => PopperAgentOption, controller: { _refer: PopperController["value"] }) {

    const agent = {
        count: count++,
        state: reactive({
            show: false,                    // pl-popper绑定值，当前是否开启
            open: false,                    // pl-popper 的open绑定值
            optionGetter,                   // PopperAgentOption
        }),
        freezeState: {
            popperService: null,            // PopperService组件实例
            destroyed: false,               // 标记，当前是否已经销毁
        },
        async show() {
            if (!!this.state.show) {
                return
            }
            if (!this.state.open) {
                this.freezeState.popperService = await controller._refer!.getPopperService(this)
            }
            this.state.show = true
        },
        async hide() {
            if (!this.state.show) {
                return
            }
            this.state.show = false
        },
        async toggle() {
            this.state.show ? this.hide() : this.show()
        },
        destroy() {
            this.freezeState.destroyed = true
        }
    }

    return agent
}

function useEditPopperAgent(agentGetter: () => PopperAgent | Promise<PopperAgent>) {

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