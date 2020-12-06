import input from './date-time-input'
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import {useDateTime} from "./useDateTime";

export default {
    useDateTime,
    ...createComponentPlugin(input),
}