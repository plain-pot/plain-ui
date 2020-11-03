import Button from './button'
import ButtonGroup from './button-group'
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import {App} from 'vue';

export default createComponentPlugin(Button, [{
    install(app: App) {
        app.component(ButtonGroup.name, ButtonGroup)
    },
}])