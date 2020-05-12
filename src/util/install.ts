import {toArray} from "@/util/util";

interface VueType {
    use: (plugin: PluginType) => void
    component: (name: string, component: object) => void
}

export interface PluginType {
    name?: string
    install?: (Vue: VueType) => void
}

export function installPlugin(defaultPlugins: PluginType | PluginType[], externalsPlugins?: PluginType | PluginType[]): PluginType {

    const install: PluginType['install'] = Vue => {
        defaultPlugins = toArray(defaultPlugins)
        defaultPlugins.forEach(plugin => {
            if (!plugin.install && !!plugin.name) {
                plugin.install = Vue => Vue.component(plugin.name!, plugin)
            }
            Vue.use(plugin)
        })

        if (!!externalsPlugins) {
            externalsPlugins = toArray(externalsPlugins)
            externalsPlugins.forEach(plugin => Vue.use(plugin))
        }
    }

    if (typeof window !== 'undefined' && window.Vue) {
        install(window.Vue as any);
    }

    return {
        install
    }
}