import Input from "./input";
import Icon from '../icon'
import InnerTags from './input-inner-tags'
import {createComponentPlugin} from "../../utils/createComponentPlugin";

const InputInnerTags = createComponentPlugin(InnerTags)

export default {
    InputInnerTags,
    ...createComponentPlugin(Input, [Icon, InputInnerTags]),
}