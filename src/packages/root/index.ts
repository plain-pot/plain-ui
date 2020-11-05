import Root from './root'
import {App, ComponentPublicInstance} from 'vue';

export const RootController = (() => {
    const map = new WeakMap<ComponentPublicInstance, typeof Root.use.class>()
    return {
        initRoot: (root: typeof Root.use.class) => {
            const $root = root.rootRef()
            setTimeout(()=>{
                console.log($root.$el)
            })
            map.set($root, root)
        },
        getRoot: (ins: ComponentPublicInstance) => {
            const root = map.get(ins.$root!)
            if (!root) {
                throw new Error(`pl-root is not found, you have to wrap the entire application with <pl-root/>!`)
            }
            return root
        }
    }
})()

export default {
    ...Root,
    install(app: App) {
        app.component(Root.name, Root)
    },
}