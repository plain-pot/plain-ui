import {PopperAgentOption} from "@/packages/popper/agent/type";
import {PopperController} from "@/packages/popper/agent/createPopperController";
import {reactive} from "@vue/composition-api";
import {$plain} from "@/packages/base";

let count = 0

export function usePopperAgent(optionGetter: () => PopperAgentOption, controller: { _refer: PopperController["value"] }) {

    const agent = {
        count: count++,
        state: reactive({
            show: false,                    // pl-popper绑定值，当前是否开启
            open: false,                    // pl-popper 的open绑定值
            optionGetter,                   // PopperAgentOption,
            showCount: 0,                   // 统计show的次数
        }),
        freezeState: {
            popperService: null as any,     // PopperService组件实例
            destroyed: false,               // 标记，当前是否已经销毁
        },
        async show() {
            if (!!this.state.show) {
                return
            }
            if (!this.state.open) {
                this.freezeState.popperService = await controller._refer!.getPopperService(this)
            }
            // console.log(this.count, this.state)
            this.state.showCount++
            await $plain.nextTick()
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