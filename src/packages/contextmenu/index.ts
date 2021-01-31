import {App} from "vue";
import {getContextmenuService} from "./contextmenu-service";

export default {
    install(app: App) {
        app.mixin({
            beforeCreate() {
                Object.defineProperty(this, '$contextmenu', {
                    get() {
                        return getContextmenuService(this)
                    },
                })
            },
        })
    },
}