import {createPopperService} from "@/packages/popper/agent/createPopperService";
import {createPopperController, PopperController} from "@/packages/popper/agent/createPopperController";
import {PopperAgentOption} from "@/packages/popper/agent/type";
import {$plain} from "@/packages/base";
import {usePopperAgent} from "@/packages/popper/agent/usePopperAgent";

export function definePopperService(
    Service: ReturnType<typeof createPopperService>
) {
    const Controller = createPopperController(`${Service.name}-controller`, Service)
    let controller: { _refer: PopperController["value"] }

    return (optionGetter: () => PopperAgentOption) => {
        if (!controller) {
            controller = $plain.newInstance(Controller)
        }
        return usePopperAgent(optionGetter, controller)
    }
}