import {definePopperService} from "@/packages/popper/agent/definePopperService";
import {createPopperService} from "@/packages/popper/agent/createPopperService";

export const $time = definePopperService(createPopperService({
    name: 'time',
    render(h, ctx) {
        return (
            <pl-time-panel
                slot="popper"
                key={ctx._refer!.option.value.agent.state.showCount}
                {
                    ...{
                        props: ctx._refer!.option.value.props,
                        on: ctx._refer!.option.value.targetListener,
                    }
                }
            />
        )
    },
}))