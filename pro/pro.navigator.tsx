import {createNavigatorManager, NavRouteMode, PageConfig} from "../src/packages/nav/NavigatorManager";
import {ProHomeMenuData} from "./pro.menu";

enum MicroAppStatus {
    notLoad = 'notLoad',
    loaded = 'loaded',
}

interface MicroAppConfig {
    pattern: RegExp,
    url?: string,
    getPage?: (pageConfig: PageConfig) => Promise<any>,
}

interface MicroApp {
    config: MicroAppConfig,
    status: MicroAppStatus,
}

const loadScript = async (url: string) => {
    await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script)
    });
}

const MicroAppManager = (() => {
    const apps: MicroApp[] = []
    const registryApplication = (appConfig: MicroAppConfig) => {
        apps.push({
            config: appConfig,
            status: MicroAppStatus.notLoad,
        })
    }
    const getPage = async (pageConfig: PageConfig) => {
        const app = apps.filter(a => a.config.pattern.test(pageConfig.path)).shift()
        if (!!app) {
            console.log('app', app)
            if (!!app.config.getPage) {
                return await app.config.getPage(pageConfig)
            } else {
                console.log('加载子应用')
                if (app.status === MicroAppStatus.notLoad) {
                    await loadScript(app.config.url!)
                }

                throw new Error('stop')
            }
        } else {
            console.error('找不到页面：', pageConfig)
        }
    }
    return {
        registryApplication,
        getPage,
    }
})();

MicroAppManager.registryApplication({
    url: 'http://localhost:3335/plain-sub-prod/js/micro.js',
    pattern: /^\/?prod/,
})
MicroAppManager.registryApplication({
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