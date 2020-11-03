import {App} from "vue"
import {ComponentPlugin} from "./shims";

import Button from "./packages/button";
import Input from "./packages/input";
import Icon from './packages/icon';
import Loading from './packages/loading'
import LoadingMask from './packages/loading-mask'

function install(app: App) {
    plugins.forEach(app.use)
}

const plugins: ComponentPlugin[] = [
    Button,
    Input,
    Icon,
    Loading,
    LoadingMask,
]

export {
    install,

    Button,
    Input,
    Icon,
    Loading,
    LoadingMask,
}

export default {
    install,
}