import loading from './pl-loading.vue'
import loadingMask from './pl-loading-mask'
import {plugin} from "../../utils";
import {PlLoadingDirective} from "./LoadingDirective";
import {LoadingService} from "./LoadingService";

export default plugin([loading, loadingMask], [PlLoadingDirective, LoadingService])