import Root from './root'
import {App, ComponentPublicInstance} from 'vue';

export const RootController = (() => {
    const map = new WeakMap<ComponentPublicInstance, typeof Root.use.class>()
    return {
        initRoot: (root: typeof Root.use.class) => {
            const $root = root.rootRef()
            map.set($root, root)
        },
        getRoot: (ins: ComponentPublicInstance) => {
            return map.get(ins.$root!)
        }
    }
})()


function getMessageService(ins: ComponentPublicInstance) {
    console.log(ins)
    const root = RootController.getRoot(ins)
    if (!root) {
        throw new Error(`pl-root is not found, you have to wrap the entire application with <pl-root/>!`)
    }
    console.log(root)
}

export default {
    ...Root,
    install(app: App) {
        app.component(Root.name, Root)
        app.mixin({
            methods: {
                $message(...args: any[]) {
                    getMessageService(this.$root)
                },
            }
        })
    },
}