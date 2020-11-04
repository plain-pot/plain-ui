import root from './root'
import {App} from 'vue';

export default {
    ...root,
    install(app: App) {
        app.component(root.name, root)
        app.mixin({
            methods: {
                $message(...args: any[]) {
                    console.log('message', ...args)
                },
            }
        })
    },
}