import {ComponentPublicInstance, getCurrentInstance} from 'vue';
import {PlRoot} from "./root";

/**
 * 用来注册root组件，建立 root 与 app中的 $root根实例的唯一对应关系
 * @author  韦胜健
 * @date    2020/11/26 9:32
 */
export const RootController = (() => {
    const map = new WeakMap<ComponentPublicInstance, typeof PlRoot.use.class>()
    return {
        initRoot: (root: typeof PlRoot.use.class) => {
            const $root = root.rootRef()
            map.set($root, root)
        },
        getRoot: (ins: ComponentPublicInstance) => {
            const root = map.get(ins.$root!)
            if (!root) {
                throw new Error(`pl-root is not found, you have to wrap the entire application with <pl-root/>!`)
            }
            return root
        }
    }
})()

export enum RootServiceScope {
    root = 'root',
    ins = 'ins',
}

/**
 * 注册一个应用服务
 * @author  韦胜健
 * @date    2020/11/26 9:34
 * @param   name                        服务名称
 * @param   managerComponent            Manager组件，由root实例创建，Manager负责创建Service组件实例
 * @param   createService               负责通过得到的manager实例，获取service实例，调用service实例的service方法提供服务
 * @param   scope                       应用服务的作用范围，root表示整个应用只有一个服务，ins表示每个组件都有自己的服务。
 */
export function registryRootService<ManagerComponent extends { use: { class: any } },
    CreateService extends (getManager: () => Promise<ManagerComponent["use"]["class"]>, ins: ComponentPublicInstance) => any>
(
    name: string,
    managerComponent: ManagerComponent,
    createService: CreateService,
    scope = RootServiceScope.root
) {
    let map = new WeakMap<ComponentPublicInstance, ReturnType<CreateService>>()

    return (ins: ComponentPublicInstance): ReturnType<CreateService> => {
        const mapKey = scope === RootServiceScope.root ? ins.$root! : ins
        let service = map.get(mapKey)
        /*如果在作用域范围内存在已经创建的服务，则直接返回这个服务函数*/
        if (!!service) {
            return service
        }
        /*否则调用创建服务函数，创建一个新的服务函数提供服务*/
        service = createService(async () => {
            const root = RootController.getRoot(mapKey)
            /*获取一个 Controller 实例，没有就给我创建一个*/
            return await root.getManagerInstance(name, managerComponent)
        }, ins)
        map.set(mapKey, service!)
        return service!
    }
}

export function createRootService<Service>(context: ComponentPublicInstance, serviceGetter: (ins: ComponentPublicInstance) => Service): Service {
    return serviceGetter(context)
}

export function useRootService<Service>(serviceGetter: (ins: ComponentPublicInstance) => Service) {
    const ctx = getCurrentInstance()!
    return serviceGetter(ctx.proxy!)
}