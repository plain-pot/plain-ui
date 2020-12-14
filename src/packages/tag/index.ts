import Tag from './tag'
import Icon from '../icon'
import {createComponentPlugin} from "../../utils/createComponentPlugin";

export default createComponentPlugin(Tag, {plugins: [Icon]})