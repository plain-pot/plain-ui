import {designComponent} from "../../use/designComponent";
import {StyleProps, useStyle} from "../../use/useStyle";
import {useSlots} from "../../use/useSlots";
import {ComponentPublicInstance, getCurrentInstance, markRaw, nextTick, reactive, Teleport} from 'vue';
import {RootController} from "./registryRootService";
import {useRefList} from "../../use/useRefList";
import './root.scss'

export default designComponent({
    name: 'pl-root',
    props: {
        ...StyleProps,
    },
    setup() {

        /*全局样式定义*/
        useStyle()
        /*默认插槽*/
        const {slots} = useSlots()
        /*controller代理对象引用*/
        let refs = useRefList<ComponentPublicInstance>()
        /*当前状态*/
        const state = reactive({
            controllers: [] as {
                name: string,
                Component: { use: { class: any } },
                RenderComponent: any,
            }[],
        })

        /**
         * 获取一个Controller实例
         * @author  韦胜健
         * @date    2020/11/5 10:19
         */
        async function getManagerInstance<ManagerComponent extends { use: { class: any } }>(
            name: string,
            managerComponent: ManagerComponent
        ): Promise<ManagerComponent["use"]["class"]> {
            if (!!refs) {
                for (let i = 0; i < refs.length; i++) {
                    const managerInstance = refs[i];
                    if (!!managerInstance) {
                        const {name: attrName, Component: attrComponent} = managerInstance.$attrs
                        if (name === attrName && managerComponent === attrComponent) {
                            return managerInstance as any
                        }
                    }
                }
            }
            /*当前引用中没有该实例，手动创建一个*/
            state.controllers.push({
                name,
                Component: managerComponent,
                RenderComponent: markRaw(managerComponent),
            })
            await nextTick()
            return getManagerInstance(name, managerComponent)
        }

        const ctx = getCurrentInstance()!
        const refer = {
            rootRef: () => ctx.proxy!.$root!,
            getManagerInstance,
        }
        RootController.initRoot(refer)

        return {
            refer,
            render: () => [
                slots.default(),
                <Teleport to="body">
                    <div class="pl-root-service-container">
                        {state.controllers.map(({name, Component, RenderComponent}, index) => (
                            <RenderComponent key={index} {...{name, Component}} ref={proxy => refs[index] = proxy as any}/>
                        ))}
                    </div>
                </Teleport>
            ]
        }
    },
})