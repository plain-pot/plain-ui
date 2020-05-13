import './button.scss'
import button from "@/packages/button/button";
import buttonGroup from './button-group'
import {installPlugin} from "@/util/install";

export default installPlugin([
    button,
    buttonGroup,
])