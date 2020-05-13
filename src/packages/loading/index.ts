import loading from './pl-loading.vue'
import loadingMask from './pl-loading-mask.vue'
import {PlLoadingDirective} from "./LoadingDirective";
import {LoadingService} from "./LoadingService";
import {installPlugin} from "@/util/install";

export default installPlugin([loading, loadingMask], [PlLoadingDirective, LoadingService])