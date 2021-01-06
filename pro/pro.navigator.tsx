import {createNavigatorManager, NavRouteMode, PageConfig} from "../src/packages/nav/NavigatorManager";
import {ProHomeMenuData} from "./pro.menu";
import {MicroAppManager} from "./micro.app";

/*主应用子模块*/
MicroAppManager.registryApplication({
    name: '产品',
    url: 'http://localhost:3330/plain-sub-prod/micro.html',
    pattern: /^\/?prod/,
})
/*主应用子模块*/
MicroAppManager.registryApplication({
    name: '订单',
    url: 'http://localhost:3331/plain-sub-order/micro.html',
    pattern: /^\/?order/,
})
/*子应用*/
MicroAppManager.registryApplication({
    name: 'Vue子应用',
    url: 'http://localhost:3328/plain-sub-vue/micro.html',
    pattern: /^\/?sub-vue/,
})

MicroAppManager.registryApplication({
    name: '主应用',
    pattern: /^\/?pro/,
    getPage: async (pageConfig) => {
        let {path} = pageConfig
        path = path.replace(/\/?pro\//, '')
        if (path.endsWith('.vue')) {
            path = path.slice(0, path.length - 4)
        }
        return (await import('pro/pages/' + path)).default
    }
})

export const proNav = createNavigatorManager({
    routerMode: NavRouteMode.hash,
    getPage: async (pageConfig) => {
        return await MicroAppManager.getPage(pageConfig)
    },
    defaultPage: {
        title: '页面一',
        path: 'pro/nav/nav-first-page',
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