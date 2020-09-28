import {designComponent} from "@/use/designComponent";
import {reactive} from "@vue/composition-api";
import {useRefs} from "@/use/useRefs";
import {$plain} from "@/packages/base";
import {PopperAgent, PopperServiceComponent} from "@/packages/popper/agent/type";
import {createPopperService} from "@/packages/popper/agent/createPopperService";

export function createPopperController(name: string, PopperService: ReturnType<typeof createPopperService>) {
    return designComponent(
        name,
        {},
        function () {

            const state = reactive({
                agents: [] as PopperAgent[],
            })

            const refs = useRefs({
                items: [] as { _refer: PopperServiceComponent["value"] }[]
            })

            function findServiceByAgent(agent: PopperAgent) {
                if (!refs.items) {
                    return null
                }
                return refs.items.find(item => item._refer!.option.value.agent === agent)
            }

            async function getPopperService(agent: PopperAgent) {

                // console.log(state.agents.map(({count, state: {show, open}}) => `count:${count},show:${show},open:${open}`))

                let workingService = findServiceByAgent(agent);
                if (!!workingService) {
                    return workingService
                }

                let replaceIndex = -1
                const replaceAgent = state.agents.find((item, i) => {
                    const {state: {show, open, optionGetter}} = item
                    const flag = !show && !open && !optionGetter().isPrivate
                    if (!!flag) {
                        item.state.show = false
                        item.state.open = false
                        replaceIndex = i
                    }
                    return flag
                })

                if (!!replaceAgent) {
                    state.agents.splice(replaceIndex, 1, agent)
                } else {
                    state.agents.push(agent)
                }

                await $plain.nextTick()
                return findServiceByAgent(agent)
            }

            return {
                state,
                getPopperService,
            }
        },
        function (refer) {
            return () => {
                return (
                    <div class={`pl-popper-service-controller ${name}`}>
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