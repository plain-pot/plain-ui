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


export function registryRootService<
    Controller extends { use: { class: any } },
    CreateServiceByController extends (getController: () => Promise<Controller["use"]["class"]>) => any>
(
    name: string,
    controller: Controller,
    createServiceByController: CreateServiceByController
) {
    const map = new WeakMap<ComponentPublicInstance, ReturnType<CreateServiceByController>>()

    return (ins: ComponentPublicInstance): ReturnType<CreateServiceByController> => {
        const $root = ins.$root!
        let service = map.get($root)
        if (!!service) {
            return service
        }
        service = createServiceByController(async () => {
            const root = RootController.getRoot($root)
            /*获取一个 Controller 实例，没有就给我创建一个*/
            return await root.getController(name, controller)
        })
        map.set($root, service!)
        return service!
    }
}