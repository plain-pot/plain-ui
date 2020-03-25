import component from './pl-dialog.vue'
import {plugin} from "../../utils";

import Service from './DialogService'

export default plugin(component, [Service])