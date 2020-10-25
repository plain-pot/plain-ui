import {App} from "vue"
import Button from "./packages/button";
import Input from "./packages/input";
import Icon from './packages/icon'

const plugins = [
    Button,
    Input,
    Icon,
]

function install(app: App) {
    plugins.forEach(app.use)
}

export default {
    install,
}

export {
    install,

    Button,
    Input,
    Icon,
}