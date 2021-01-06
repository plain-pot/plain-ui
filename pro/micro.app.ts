import {PageConfig} from "../src/packages/nav/NavigatorManager";
import importHTML from 'import-html-entry';
import {$$notice} from "../src/packages/notice-service";

interface MicroAppConfig {
    name: string,                                               // 子应用名称
    pattern: RegExp,                                            // 子应用匹配页面的路径
    url?: string,                                               // 子应用入口html文件资源地址
    getPage?: (pageConfig: PageConfig) => Promise<any>,         // 子应用获取页面的方式
}

type MicroAppEntry = { getPage: (pageConfig: PageConfig) => Promise<any> }
    | {
    mount: (el: HTMLDivElement, pageConfig: PageConfig) => Promise<any>,
    unmount: (data: any) => Promise<void>
}

interface MicroApp {
    config: MicroAppConfig,
    assetPublicPath?: string,
    entry?: MicroAppEntry,
}


export const MicroAppManager = (() => {
    const apps: MicroApp[] = []
    const registryApplication = (appConfig: MicroAppConfig) => {
        apps.push({
            config: appConfig,
        })
    }
    const getPage = async (pageConfig: PageConfig) => {
        const app = apps.filter(a => a.config.pattern.test(pageConfig.path)).shift()
        if (!!app) {
            console.log('app', app)
            if (!!app.config.getPage) {
                return await app.config.getPage(pageConfig)
            } else {
                console.log('匹配子应用', app.config.name)
                if (!app.entry) {
                    try {
                        console.log('加载子应用', app.config.name)
                        const html = await importHTML(app.config.url!)
                        app.assetPublicPath = html.assetPublicPath
                        const bootstrap = ((await html.execScripts()) as any).default
                        console.log(bootstrap)
                        app.entry = await bootstrap(app)
                    } catch (e) {
                        $$notice.error(`加载子应用【${app.config.name}】失败！`)
                        throw  e
                    }
                }
                const entry = app.entry!
                if ('getPage' in entry) {
                    return {page: await entry.getPage(pageConfig)}
                } else {
                    const {mount, unmount} = entry
                    return {mount, unmount}
                }
            }
        } else {
            console.error('无子应用可以处理该页面！', pageConfig)
        }
    }
    return {
        registryApplication,
        getPage,
    }
})();