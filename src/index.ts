import {App} from "vue"
import Button from "./packages/button";
import Input from "./packages/input";
import Icon from './packages/icon';

function install(app: App) {
    plugins.forEach(app.use)
}

const plugins = [
    Button,
    Input,
    Icon,
]

export {
    install,

    Button,
    Input,
    Icon,
}

export default {
    install,
}