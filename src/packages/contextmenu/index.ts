import {App} from "vue";
import {getContextmenuService} from "./contextmenu-service";

export default {
    install(app: App) {
        app.mixin({
            computed: {
                $contextmenu() {return getContextmenuService(this)},
            },
        })
    },
}