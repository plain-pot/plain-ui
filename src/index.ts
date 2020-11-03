import {App} from "vue"
import {ComponentPlugin} from "./shims";
import {installPlugin} from "./utils/installPlugin";

import Button from "./packages/button";
import Input from "./packages/input";
import Icon from './packages/icon';
import Loading from './packages/loading'
import LoadingMask from './packages/loading-mask'
import Checkbox from './packages/checkbox'

function install(app: App) {
    installPlugin(app, plugins)
}

const plugins: ComponentPlugin[] = [
    Button,
    Input,
    Icon,
    Loading,
    LoadingMask,
    Checkbox,
]

export {
    install,

    Button,
    Input,
    Icon,
    Loading,
    LoadingMask,
    Checkbox,
}

export default {
    install,
}