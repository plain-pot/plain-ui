import {App} from 'vue'
import {ComponentPlugin} from "../shims";
import {installPlugin} from "./installPlugin";
import Root from '../packages/root'

interface InstallComponent {
    name: string
}

export function createComponentPlugin<Component extends InstallComponent,
    Expose extends Record<string, any>,
    ExposeComponents extends { [k: string]: InstallComponent },
    >(
    component: Component,                               // 导出的主组件
    option?: {
        exposeComponents?: ExposeComponents,            // 额外需要安装的组件（一并导出挂载的component组件上）
        plugins?: ComponentPlugin[],                    // 依赖的其他插件
        expose?: Expose                                 // 需要导出的额外内容
    },
) {
    const {exposeComponents, plugins, expose} = option || {}
    const wrapExposeComponents: { [k in keyof ExposeComponents]: ExposeComponents[k] & ComponentPlugin } = !exposeComponents ?
        {} :
        Object.keys(exposeComponents || {})
            .reduce((prev, next) => {
                prev[next] = createComponentPlugin(exposeComponents[next])
                return prev
            }, {} as any)

    return Object.assign(component, {
        install(app: App) {
            installPlugin(app, Root)
            const componentList = [component] as InstallComponent[]
            if (!!exposeComponents) {componentList.push(...Object.values(exposeComponents))}
            componentList.forEach(comp => app.component(comp.name, comp))
            !!plugins && (installPlugin(app, plugins))
        },
        ...wrapExposeComponents,
        ...expose,
    })
}