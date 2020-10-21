import {App} from "vue"
import {Button} from "./packages/button/button";
import {Input} from "./packages/input/input";

const components = [
    Button,
    Input,
]

function install(app: App) {
    components.forEach(component => {
        app.component(component.name, component)
    })
}

export default {
    install,
}

export {
    install,

    Button,
    Input,
}