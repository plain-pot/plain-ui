import {PageConfig} from "../src/packages/nav/NavigatorManager";
import importHTML from 'import-html-entry';

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

export const MicroAppManager = (() => {
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
                    const html = await importHTML(app.config.url!)
                    console.log('html', html)
                    const {bootstrap, getPage} = (await html.execScripts()) as any
                    await bootstrap(html)
                    return await getPage(pageConfig)
                }
                throw new Error('加载子应用失败！')
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