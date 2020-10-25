import {App} from 'vue'

import {designComponent} from "../use/designComponent";
import {ComponentPlugin} from "../shims";

export function installPlugin(
    component: Partial<ReturnType<typeof designComponent>> & { name: string },
    plugins?: ComponentPlugin[]
) {
    return {
        ...component,
        install(app: App) {
            app.component(component.name, component);
            !!plugins && plugins.forEach(app.use)
        },
    }
}