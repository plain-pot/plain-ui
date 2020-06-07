import './input.scss'
import input from "@/packages/input/input";
import inputInnerTags from './input-inner-tags'
import {installPlugin} from "@/util/install";

export default installPlugin([
    input,
    inputInnerTags,
])