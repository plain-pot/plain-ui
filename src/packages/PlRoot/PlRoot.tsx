import {designComponent, useRefList, markRaw, reactive} from "plain-ui-composition"
import {StyleProps, useStyle} from "../../use/useStyle";
import {delay} from "plain-utils/utils/delay";

import {createPortal} from 'react-dom'
import './PlRoot.scss'

export const PlRoot = designComponent({
    name: 'pl-root',
    slots: ['default'],
    provideRefer: true,
    props: {
        ...StyleProps,
    },
    setup({slots}) {

        /*全局样式定义*/
        useStyle()
        /*controller代理对象引用*/
        let {refList, onRefList} = useRefList()
        /*当前状态*/
        const state = reactive({
            managers: [] as {
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
            if (!!refList && refList.length > 0) {
                for (let i = 0; i < refList.length; i++) {
                    const managerInstance = refList[i];
                    if (!!managerInstance) {
                        const {name: attrName, Component: attrComponent} = managerInstance.props
                        if (name === attrName && managerComponent === attrComponent) {
                            return managerInstance as any
                        }
                    }
                }
            }
            /*当前引用中没有该实例，手动创建一个*/
            state.managers.push({
                name,
                Component: managerComponent,
                RenderComponent: markRaw(managerComponent),
            })
            await delay(0)
            return getManagerInstance(name, managerComponent)
        }

        const refer = {
            getManagerInstance,
        }

        return {
            refer,
            render: () => <>
                {slots.default()}
                {createPortal(
                    <div class="pl-root-service-container">
                        {state.managers.map(({name, Component, RenderComponent}, index) => (
                            <RenderComponent
                                key={index}
                                {...{name, Component}}
                                ref={onRefList(index)}
                            />
                        ))}
                    </div>,
                    document.body,
                )}
            </>
        }
    },
})

export type PlRootInstance = typeof PlRoot.use.class
