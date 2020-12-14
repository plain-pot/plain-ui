import {StepGroup} from "./step/step-group";
import {Step} from "./step/step";
import {ArrowStepGroup} from "./arrow-step/arrow-step-group";
import {ArrowStep} from "./arrow-step/arrow-step";
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import Triangle from '../triangle'

export default createComponentPlugin(StepGroup, {
    exposeComponents: {
        StepGroup,
        Step,
        ArrowStepGroup,
        ArrowStep,
    },
    plugins: [Triangle]
})