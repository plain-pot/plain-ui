import Loading from '../loading'
import LoadingMask from './loading-mask'
import {createComponentPlugin} from "../../utils/createComponentPlugin";

export default createComponentPlugin(LoadingMask, {
    plugins: [
        Loading,
    ]
})