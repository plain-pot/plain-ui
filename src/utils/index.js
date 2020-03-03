import base from "../components/base";

export function plugin(defaultPlugin, externalPlugins) {
    return {
        install: Vue => {
            Vue.use(base)

            if (!defaultPlugin.install && !!defaultPlugin.name) {
                defaultPlugin.install = Vue => Vue.component(defaultPlugin.name, defaultPlugin)
            }
            Vue.use(defaultPlugin)

            if (!!externalPlugins) {
                if (Array.isArray(externalPlugins)) {
                    externalPlugins.forEach(plugin => Vue.use(plugin))
                } else {
                    Vue.use(externalPlugins)
                }
            }
        }
    }
}