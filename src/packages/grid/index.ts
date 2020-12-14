import Row from "./row";
import Col from './col'
import {createComponentPlugin} from "../../utils/createComponentPlugin";

export default createComponentPlugin(Row, {exposeComponents: {Col}})