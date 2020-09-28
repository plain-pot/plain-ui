import {PopperAgentOption} from "@/packages/popper/agent/type";
import {PopperController} from "@/packages/popper/agent/createPopperController";
import {reactive} from "@vue/composition-api";

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