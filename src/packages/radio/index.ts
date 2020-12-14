import inner from '../radio-inner'
import radio from './radio'
import {createComponentPlugin} from "../../utils/createComponentPlugin";

export default createComponentPlugin(radio, {plugins: [inner]})