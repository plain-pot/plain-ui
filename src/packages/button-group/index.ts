import Button from '../button'
import ButtonGroup from '../button-group/button-group'
import {createComponentPlugin} from "../../utils/createComponentPlugin";

export default createComponentPlugin(ButtonGroup, {plugins: [Button]})