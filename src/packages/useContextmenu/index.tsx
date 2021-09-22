import {createServiceWithoutContext, createUseService} from "../PlRoot/registryRootService";
import {createDefaultManager} from "../PlRoot/createDefaultManager";
import {ContextContent, ContextmenuReference, ContextmenuServiceOption, getReferencePosition, PlContextMenuService, PlContextMenuServiceComponent} from "./PlContextMenuService";
import './contextmenu-service.scss'

export const useContextmenu = createUseService({
        name: 'contextmenu',
        managerComponent: createDefaultManager('pl-contextmenu-service-manager', PlContextMenuService, ((items: PlContextMenuServiceComponent[], option: ContextmenuServiceOption) => {

            let exist: PlContextMenuServiceComponent | null = null
            let available: PlContextMenuServiceComponent | null = null
            items.forEach(item => {
                if (!!exist) {
                    return
                }
                if (item.state.option === option) {
                    exist = item
                    return;
                }
                if (item.state.option.reference === option.reference) {
                    exist = item
                    return;
                }
                if (!item.isShow.value && !item.isOpen.value) {
                    available = item
                }
            })
            return exist || available
        }) as any),
        createService: (getManager) => {
            return async (reference: ContextmenuReference, content: ContextContent, opt?: ContextmenuServiceOption) => {
                let option = {reference, content}
                if (!!opt) {
                    option = Object.assign(opt, option)
                }
                const manager = await getManager()
                return manager.service(option)
            }
        }
    },
)

export default useContextmenu

export const $$contextmenu = createServiceWithoutContext(useContextmenu)
