import Input from '../input'
import Number from './number'
import {createComponentPlugin} from "../../utils/createComponentPlugin";

export default createComponentPlugin(Number, [
    Input,
])