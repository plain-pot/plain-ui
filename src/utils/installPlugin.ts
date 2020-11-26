import {ComponentPlugin} from "../shims";
import {App} from 'vue';

const installMap = new WeakMap<App, ComponentPlugin[]>()

export function installPlugin(app: App, plugin: ComponentPlugin | ComponentPlugin[]) {
    let installedPlugins = installMap.get(app)
    if (!installedPlugins) {
        /*这个app第一次注册*/
        installedPlugins = []
        installMap.set(app, installedPlugins)
    }
    const plugins = Array.isArray(plugin) ? plugin : [plugin]
    plugins.forEach(plugin => {
        if (installedPlugins!.indexOf(plugin) === -1) {
            app.use(plugin)
            installedPlugins!.push(plugin)
        }
    })
}