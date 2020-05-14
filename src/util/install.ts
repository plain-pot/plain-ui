import {toArray} from "@/util/util";
import {VueConstructor} from "vue/types/umd";
import PLAIN from "@/packages/base";

interface VueType {
    use: (plugin: PluginType) => void
    component: (name: string, component: object) => void
}

export interface PluginType {
    name?: string
    install?: (Vue: VueType) => void
}

export function installPlugin(defaultPlugins: VueConstructor | VueConstructor[] | PluginType | PluginType[], externalsPlugins?: VueConstructor | PluginType | PluginType[]): PluginType {

    const install: PluginType['install'] = Vue => {

        Vue.use(PLAIN)

        defaultPlugins = toArray(defaultPlugins) as PluginType[]
        defaultPlugins.forEach(plugin => {
            if (!plugin.install && !!plugin.name) {
                plugin.install = Vue => Vue.component(plugin.name!, plugin)
            }
            Vue.use(plugin)
        })

        if (!!externalsPlugins) {
            externalsPlugins = toArray(externalsPlugins) as PluginType[]
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