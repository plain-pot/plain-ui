import checkbox from '../checkbox'
import group from './checkbox-group'
import {createComponentPlugin} from "../../utils/createComponentPlugin";

export default createComponentPlugin(group, {plugins: [checkbox]})