import Input from "./input";
import Icon from '../icon'
import InputInnerTags from './input-inner-tags'
import {createComponentPlugin} from "../../utils/createComponentPlugin";

export default createComponentPlugin(
    Input,
    {
        plugins: [Icon],
        exposeComponents: {InputInnerTags}
    },
)