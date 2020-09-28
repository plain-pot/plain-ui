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

                if (!!refs.items && refs.items.length > 0) {
                    let index = -1;
                    let service = refs.items.find((item, i) => {
                        const {agent: itemAgent} = item._refer!.option.value
                        const {state: {show, open, optionGetter}} = itemAgent
                        const flag = itemAgent === agent || (!show && !open && !optionGetter().isPrivate)
                        if (!!flag) {
                            index = i
                        }
                        return flag
                    })
                    if (!!service && index != -1) {
                        state.agents.splice(index, 1, agent)
                        await $plain.nextTick();
                        return service
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