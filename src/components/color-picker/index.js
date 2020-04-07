import picker from './pl-color-picker.vue'
import panel from './pl-color-panel'
import service from './color-service/index'

import {plugin} from "../../utils";

export default plugin([picker, panel], [service])