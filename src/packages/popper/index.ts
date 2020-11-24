import Popper from './popper'
import PopperService from './service'
import {createComponentPlugin} from "../../utils/createComponentPlugin";

export default createComponentPlugin(Popper, [
    PopperService
])