import {StepGroup as stepGroup} from "./step/step-group";
import {Step as step} from "./step/step";
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import {App} from 'vue';
import {installPlugin} from "../../utils/installPlugin";

const StepGroup = createComponentPlugin(stepGroup)
const Step = createComponentPlugin(step)

export default {
    StepGroup,
    Step,
    install(app: App) {
        installPlugin(app, StepGroup)
        installPlugin(app, Step)
    },
}