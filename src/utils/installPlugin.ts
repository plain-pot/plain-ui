import {ComponentPlugin} from "../shims";
import {App} from 'vue';

const installMap = new WeakMap<App, ComponentPlugin[]>()

export function installPlugin(app: App, plugin: ComponentPlugin | ComponentPlugin[]) {
    let installedPlugins = installMap.get(app)
    if (!installedPlugins) {
        /*这个app第一次注册*/
        installedPlugins = []
        installMap.set(app, installedPlugins)

        app.config.warnHandler = function (msg, vm, trace) {
            // `trace` 是组件的继承关系追踪
            // console.log('warn handler', {msg, vm, trace})
            // todo, 监听驼峰命名的事件会有警告，这里忽略
            if (msg.startsWith('Extraneous non-emits event listeners')) {
                return
            }
            console.warn(msg, {vm, trace})
        }
    }
    const plugins = Array.isArray(plugin) ? plugin : [plugin]
    plugins.forEach(plugin => {
        if (installedPlugins!.indexOf(plugin) === -1) {
            app.use(plugin)
            installedPlugins!.push(plugin)
        }
    })
}