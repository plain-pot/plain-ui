import {ComponentPlugin} from "../shims";
import {App} from 'vue';

const installMap = new WeakMap<App, ComponentPlugin[]>()

export function installPlugin(app: App, plugins: ComponentPlugin | ComponentPlugin[]) {
    /*已经安装过的插件*/
    let installedPlugins = installMap.get(app)
    if (!installedPlugins) {
        /*这个app第一次注册*/
        installedPlugins = []
        installMap.set(app, installedPlugins)
    }
    (Array.isArray(plugins) ? plugins : [plugins]).forEach(plugin => {
        if (installedPlugins!.indexOf(plugin) === -1) {
            installedPlugins!.push(plugin)// 这句代码一定要在app.use面前
            app.use(plugin)
        }
    });
}