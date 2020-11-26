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

export enum RootServiceScope {
    root = 'root',
    ins = 'ins',
}

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
        if (!!service) {
            return service
        }
        service = createService(async () => {
            const root = RootController.getRoot(mapKey)
            /*获取一个 Controller 实例，没有就给我创建一个*/
            return await root.getManagerInstance(name, managerComponent)
        }, ins)
        map.set(mapKey, service!)
        return service!
    }
}