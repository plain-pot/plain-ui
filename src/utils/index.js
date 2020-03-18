import base from "../components/base";

export function plugin(defaultPlugin, externalPlugins) {
    return {
        install: Vue => {
            Vue.use(base)

            defaultPlugin = Array.isArray(defaultPlugin)?defaultPlugin:[defaultPlugin]

            defaultPlugin.forEach(item=>{
                if (!item.install && !!item.name) {
                    item.install = Vue => Vue.component(item.name, item)
                }
                Vue.use(item)
            })

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