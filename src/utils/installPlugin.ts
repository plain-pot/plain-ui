import {ComponentPlugin} from "../shims";
import {App} from 'vue';

const installedPlugins: ComponentPlugin[] = []

export function installPlugin(app: App, plugin: ComponentPlugin | ComponentPlugin[]) {
    const plugins = Array.isArray(plugin) ? plugin : [plugin]
    plugins.forEach(plugin => {
        if (installedPlugins.indexOf(plugin) === -1) {
            app.use(plugin)
            installedPlugins.push(plugin)
        }
    })
}