import {App} from "vue"
import {ComponentPlugin} from "./shims";
import {installPlugin} from "./utils/installPlugin";

import Root from './packages/root'
import Button from "./packages/button";
import ButtonGroup from './packages/button-group'
import Input from "./packages/input";
import Icon from './packages/icon';
import Loading from './packages/loading'
import LoadingMask from './packages/loading-mask'
import Checkbox from './packages/checkbox'
import CheckboxGroup from './packages/checkbox-group'

function install(app: App) {
    installPlugin(app, plugins)
}

const plugins: ComponentPlugin[] = [
    Root,

    Button,
    ButtonGroup,
    Input,
    Icon,
    Loading,
    LoadingMask,
    Checkbox,
    CheckboxGroup,
]

export {
    install,

    Root,
    Button,
    ButtonGroup,
    Input,
    Icon,
    Loading,
    LoadingMask,
    Checkbox,
    CheckboxGroup,
}

export default {
    install,
}