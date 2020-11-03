import Loading from '../loading'
import LoadingMask from './loading-mask'
import {installPlugin} from "../../utils/installPlugin";

export default installPlugin(LoadingMask, [
    Loading,
])