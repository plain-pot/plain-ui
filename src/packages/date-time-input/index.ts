import input from './date-time-input'
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import {useDateTime} from "./useDateTime";

export default createComponentPlugin(input, {
    expose: {
        useDateTime,
    }
})