import {designComponent} from "@/use/designComponent";
import {reactive} from "@vue/composition-api";
import {useRefs} from "@/use/useRefs";
import {$plain} from "@/packages/base";
import {PopperAgent, PopperServiceComponent} from "@/packages/popper/agent/type";
import {createPopperService} from "@/packages/popper/agent/createPopperService";

export function createPopperController(name: string, PopperService: ReturnType<typeof createPopperService>) {
    const ComponentName = `pl-popper-controller-${name}`
    return designComponent(
        ComponentName,
        {},
        function () {

            const state = reactive({
                agents: [] as PopperAgent[],
            })

            const refs = useRefs({
                items: [] as { _refer: PopperServiceComponent["value"] }[]
            })

            async function getPopperService(agent: PopperAgent) {

                let workingService;
                let workableIndex;

                if (!!refs.items && refs.items.length > 0) {
                    refs.items.forEach((item, i) => {
                        const {agent: itemAgent} = item._refer!.option.value
                        const {state: {show, open, optionGetter}} = itemAgent

                        if (itemAgent === agent) {
                            workingService = item
                            return true
                        }
                        if ((!show && !open && !optionGetter().isPrivate)) {
                            workableIndex = i
                        }
                    })
                    if (workingService != null) {
                        return workingService
                    }
                    if (workableIndex != null) {
                        state.agents.splice(workableIndex, 1, agent)
                        console.log(state.agents.map(agent => agent.count))
                        await $plain.nextTick();
                        return refs.items[workableIndex]
                    }
                }

                state.agents.push(agent)
                await $plain.nextTick()
                return getPopperService(agent)
            }

            return {
                state,
                getPopperService,
            }
        },
        function (refer) {
            return () => {
                return (
                    <div class={`pl-popper-service-controller ${ComponentName}`}>
                        {refer.state.agents.map((agent, index) => (
                            // @ts-ignore
                            <PopperService agent={agent} key={index} {...{ref: 'items', refInFor: true}}/>
                        ))}
                    </div>
                )
            }
        }
    )
}

export type PopperController = ReturnType<ReturnType<typeof createPopperController>["use"]["ref"]>