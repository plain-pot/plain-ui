import {App} from 'vue'
import {$$file} from "./file-service";

export default {
    install: (app: App) => {
        app.config.globalProperties.$$file = $$file
    }
}