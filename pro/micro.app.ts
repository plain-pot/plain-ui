import {GetPage, PageConfig} from "../src/packages/nav/NavigatorManager";
import importHTML from 'import-html-entry';
import {$$notice} from "../src/packages/notice-service";

interface MicroAppConfig {
    name: string,                                               // 子应用名称
    pattern: RegExp,                                            // 子应用匹配页面的路径
    url?: string,                                               // 子应用入口html文件资源地址
    getPage?: (pageConfig: PageConfig) => Promise<any>,         // 子应用获取页面的方式
}

interface MicroAppEntry {
    bootstrap: (app: MicroApp) => Promise<void>,
    getPage: GetPage,
}

interface MicroApp {
    config: MicroAppConfig,
    entry?: MicroAppEntry,
    assetPublicPath?: string,
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
                console.log('加载子应用')
                if (!app.entry) {
                    try {
                        const html = await importHTML(app.config.url!)
                        app.assetPublicPath = html.assetPublicPath
                        app.entry = (await html.execScripts())
                    } catch (e) {
                        $$notice.error(`加载子应用【${app.config.name}】失败！`)
                        throw  e
                    }
                }
                await app.entry!.bootstrap(app)
                return await app.entry!.getPage(pageConfig)
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