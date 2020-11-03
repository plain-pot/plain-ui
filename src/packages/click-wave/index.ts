import {App} from 'vue';
import {ClickWave} from "./click-wave-directive";

export default {
    install(app: App) {
        app.directive('click-wave', ClickWave)
    },
}