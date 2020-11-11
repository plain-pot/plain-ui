import Root from './root'
import {App} from 'vue';

export default {
    ...Root,
    install(app: App) {
        app.component(Root.name, Root)
    },
}