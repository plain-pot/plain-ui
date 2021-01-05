import {createNavigatorManager, NavRouteMode, PageConfig} from "../src/packages/nav/NavigatorManager";
import {ProHomeMenuData} from "./pro.menu";

export const proNav = createNavigatorManager({
    routerMode: NavRouteMode.hash,
    getPage: async (pageConfig) => {
        let {path} = pageConfig
        if (path.endsWith('.vue')) {
            path = path.slice(0, path.length - 4)
        }
        return (await import('pro/pages/' + path)).default
    },
    defaultPage: {
        title: '页面一',
        path: 'nav/nav-first-page',
        icon: 'el-icon-s-shop',
    },
})

proNav.init()

export interface PageConfigData {
    menu: ProHomeMenuData
}

export async function openMenu(menu: ProHomeMenuData) {
    const opened = proNav.utils.findStack<PageConfigData>(stack => {
        const {title, path} = stack.pageConfig.data ? stack.pageConfig.data.menu : stack.pageConfig
        return title === menu.title && path === menu.path
    })
    if (!!opened) {
        await proNav.showTab(opened.id)
    } else {
        if (!menu.path) {
            return
        }
        const pageConfig: PageConfig<PageConfigData> = {
            title: menu.title,
            path: menu.path!,
            icon: menu.icon,
            data: {menu},
        }
        await proNav.openTab(pageConfig)
    }
}