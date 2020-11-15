import {StepGroup as stepGroup} from "./step/step-group";
import {Step as step} from "./step/step";
import {ArrowStepGroup as arrowStepGroup} from "./arrow-step/arrow-step-group";
import {ArrowStep as arrowStep} from "./arrow-step/arrow-step";
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import {App} from 'vue';
import {installPlugin} from "../../utils/installPlugin";

const StepGroup = createComponentPlugin(stepGroup)
const Step = createComponentPlugin(step)
const ArrowStepGroup = createComponentPlugin(arrowStepGroup)
const ArrowStep = createComponentPlugin(arrowStep)

export default {
    StepGroup,
    Step,
    ArrowStepGroup,
    ArrowStep,
    install(app: App) {
        installPlugin(app, StepGroup)
        installPlugin(app, Step)
        installPlugin(app, ArrowStepGroup)
        installPlugin(app, ArrowStep)
    },
}