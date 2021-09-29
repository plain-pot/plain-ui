/**
 * 用来注册root组件，建立 root 与 app中的 $root根实例的唯一对应关系
 * @author  韦胜健
 * @date    2020/11/26 9:32
 */
import {PlRoot, PlRootInstance} from "./PlRoot";
import {App, createApp} from 'vue'

import {addClass} from "plain-utils/dom/addClass";

export const RootMapper = (() => {
    const get = (appRootInstance: any): PlRootInstance => {
        return appRootInstance._PL_ROOT
    }
    const set = (appRootInstance: any, rootInstance: PlRootInstance) => {
        if (!!appRootInstance._PL_ROOT) {
            return console.log('pl-root: 在一个app中只能使用一次', {newRoot: rootInstance, oldRoot: appRootInstance._PL_ROOT})
        }
        appRootInstance._PL_ROOT = rootInstance
    }
    return {
        get, set
    }
})()

export function createUseService<_,
    ManagerComponent extends { use: { class: { props: { name: any, Component: any } } } },
    CreateService extends (getManager: () => Promise<ManagerComponent["use"]["class"]>) => any>(
    {
        name,
        optionsCallName,
        managerComponent,
        createService,
    }: {
        name: string,
        optionsCallName: string,
        managerComponent: ManagerComponent,
        createService: CreateService,
    }
) {
    /*不同的root，使用的service可能不一样*/
    let map = new WeakMap<any, ReturnType<CreateService>>()

    const use = (getRoot?: () => PlRootInstance | Promise<PlRootInstance>): ReturnType<CreateService> => {
        let root: PlRootInstance;
        if (!getRoot) {
            root = PlRoot.use.inject()
            let service = map.get(root)
            if (!!service) { return service}
            service = createService(async () => root!.getManagerInstance(name, managerComponent))
            map.set(root, service!)
            return service!
        } else {
            return createService(async () => {
                const root = await getRoot()
                return root.getManagerInstance(name, managerComponent)
            })
        }
    }

    return Object.assign(use, {
        install(app: App) {
            app.mixin({
                computed: {
                    [optionsCallName]() {
                        return use(() => RootMapper.get(this.$root))
                    }
                }
            })
        },
    })
}

/**
 * 创建一个不需要应用上下文的service
 * @author  韦胜健
 * @date    2021/3/17 19:17
 */
export function createServiceWithoutContext<UseService extends (getRoot: () => PlRootInstance | Promise<PlRootInstance>) => any>(useService: UseService): ReturnType<UseService> {
    const getRoot = (() => {
        let root: PlRootInstance;
        return () => {
            if (!root) {
                const el = document.createElement('div')
                addClass(el, 'plain-design-root-without-context')
                document.body.appendChild(el)
                createApp({render: () => <PlRoot ref={(refer: any) => root = refer!}/>}).mount(el)
            }
            return root!
        }
    })();
    return useService(getRoot)
}
