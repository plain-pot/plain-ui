import component from './pl-input.vue'
import innerTags from './pl-input-inner-tags'

import icon from '../icon'
import loading from '../loading'
import utils from '../utils'

import {plugin} from "../../utils";

export default plugin([
    component,
    innerTags
], [
    icon,
    loading,
    utils,
])