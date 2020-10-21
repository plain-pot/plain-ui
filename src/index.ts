import {Button} from "@/packages/button/button";
import {Input} from "@/packages/input/input";

import {App} from "vue"

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