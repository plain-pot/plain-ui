import {createNavigatorManager, NavRouteMode, PageConfig} from "../src/packages/nav/NavigatorManager";
import {ProHomeMenuData} from "./pro.menu";
import {createLocalModule, createSubApplication} from "./micro.app";

export const proNav = createNavigatorManager({
    routerMode: NavRouteMode.hash,
    microAppConfig: [
        createLocalModule({
            name: '主应用',
            pattern: /^\/?pro\//,
            loader: {
                getPage: async (pageConfig) => {
                    let {path} = pageConfig
                    path = path.replace(/\/?pro\//, '')
                    if (path.endsWith('.vue')) {
                        path = path.slice(0, path.length - 4)
                    }
                    return (await import('pro/pages/' + path)).default
                }
            }
        }),
        createSubApplication({
            name: '产品',
            pattern: /^\/?prod\//,
            url: 'http://localhost:3330/plain-sub-prod/micro.html',
        }),
        createSubApplication({
            name: '订单',
            url: 'http://localhost:3331/plain-sub-order/micro.html',
            pattern: /^\/?order\//,
        }),
        createSubApplication({
            name: 'Vue子应用',
            url: 'http://localhost:3328/plain-sub-vue/micro.html',
            pattern: /^\/?sub-vue\//,
        }),
        createSubApplication({
            name: 'React子应用',
            url: 'http://localhost:3327/plain-sub-react/index.html',
            pattern: /^\/?sub-react\//,
        }),
    ],
    defaultPage: {
        title: '页面一',
        path: 'pro/nav/nav-first-page',
        icon: 'el-icon-s-shop',
    },
})

proNav.init()

export interface PageConfigData {menu: ProHomeMenuData}

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