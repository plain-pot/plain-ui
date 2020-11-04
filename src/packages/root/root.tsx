import {designComponent} from "../../use/designComponent";
import {StyleProps, useStyle} from "../../use/useStyle";
import {useSlots} from "../../use/useSlots";
import {ComponentPublicInstance, getCurrentInstance, nextTick, reactive, Teleport, markRaw} from 'vue';
import {RootController} from "./index";
import {useRefs} from "../../use/useRefs";

export default designComponent({
    name: 'pl-root',
    props: {
        ...StyleProps,
    },
    setup() {

        useStyle()
        const {slots} = useSlots()
        const ctx = getCurrentInstance()!
        const {refs} = useRefs({
            controllers: Object as any as (new() => ComponentPublicInstance[])
        })

        const state = reactive({
            controllers: [] as {
                name: string,
                Component: { name: string },
                RenderComponent: any,
            }[],
        })

        const getController = async (name: string, Component: { name: string }): Promise<ComponentPublicInstance> => {
            console.log('refs.controllers', refs.controllers)
            if (!!refs.controllers) {
                for (let i = 0; i < refs.controllers.length; i++) {
                    const controller = refs.controllers[i];
                    const {name, Component} = controller.$attrs
                    if (name === name && Component === Component) {
                        return controller
                    }
                }
            }
            state.controllers.push({
                name,
                Component,
                RenderComponent: markRaw(Component),
            })
            await nextTick()
            console.log(refs.controllers)
            const {name: newName, Component: newComponent} = refs.controllers[0]!.$attrs
            console.log(name === newName, Component === newComponent)
            // return getController(name, Component)
            return {} as any
        }


        const refer = {
            rootRef: () => ctx.proxy!.$root!,
            getController,
        }
        RootController.initRoot(refer)

        return {
            refer,
            render: () => [
                slots.default(),
                <Teleport to="body">
                    <div class="pl-root-service-container">
                        {state.controllers.map(({name, Component, RenderComponent}, index) => (
                            <RenderComponent key={index} {...{name, Component}} ref="controllers"/>
                        ))}
                    </div>
                </Teleport>
            ]
        }
    },
})