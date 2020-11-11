import Root from "./root";
import {ComponentPublicInstance} from 'vue';

export const RootController = (() => {
    const map = new WeakMap<ComponentPublicInstance, typeof Root.use.class>()
    return {
        initRoot: (root: typeof Root.use.class) => {
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


export function registryRootService<ManagerComponent extends { use: { class: any } },
    CreateService extends (getController: () => Promise<ManagerComponent["use"]["class"]>) => any>
(
    name: string,
    managerComponent: ManagerComponent,
    createService: CreateService
) {
    const map = new WeakMap<ComponentPublicInstance, ReturnType<CreateService>>()

    return (ins: ComponentPublicInstance): ReturnType<CreateService> => {
        const $root = ins.$root!
        let service = map.get($root)
        if (!!service) {
            return service
        }
        service = createService(async () => {
            const root = RootController.getRoot($root)
            /*获取一个 Controller 实例，没有就给我创建一个*/
            return await root.getManagerInstance(name, managerComponent)
        })
        map.set($root, service!)
        return service!
    }
}