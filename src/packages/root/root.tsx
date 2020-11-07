import {designComponent} from "../../use/designComponent";
import {StyleProps, useStyle} from "../../use/useStyle";
import {useSlots} from "../../use/useSlots";
import {ComponentPublicInstance, getCurrentInstance, markRaw, nextTick, reactive, Teleport} from 'vue';
import {RootController} from "./root-service";
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
                Component: { name: string },
                RenderComponent: any,
            }[],
        })

        /**
         * 获取一个Controller实例
         * @author  韦胜健
         * @date    2020/11/5 10:19
         */
        const getController = async (name: string, Component: { name: string }): Promise<ComponentPublicInstance> => {
            if (!!refs) {
                for (let i = 0; i < refs.length; i++) {
                    const controller = refs[i];
                    const {name, Component} = controller.$attrs
                    if (name === name && Component === Component) {
                        return controller
                    }
                }
            }
            /*当前引用中没有该实例，手动创建一个*/
            state.controllers.push({
                name,
                Component,
                RenderComponent: markRaw(Component),
            })
            await nextTick()
            return getController(name, Component)
        }

        const ctx = getCurrentInstance()!
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
                            <RenderComponent key={index} {...{name, Component}} ref={proxy => refs[index] = proxy as any}/>
                        ))}
                    </div>
                </Teleport>
            ]
        }
    },
})