import {App} from "vue"
import Button from "./packages/button";
import Input from "./packages/input";
import Icon from './packages/icon';
import Loading from './packages/loading'
import {ComponentPlugin} from "./shims";

function install(app: App) {
    plugins.forEach(app.use)
}

const plugins: ComponentPlugin[] = [
    Button,
    Input,
    Icon,
    Loading,
]

export {
    install,

    Button,
    Input,
    Icon,
    Loading,
}

export default {
    install,
}