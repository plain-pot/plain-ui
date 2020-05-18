import './dialog.scss'
import dialog from './dialog'
import controller from './pl-dialog-service-controller.vue'
import serviceItem from './dialog-service-item'
import Service from './DialogService'
import {installPlugin} from "@/util/install";

export default installPlugin([
    dialog,
    controller,
    serviceItem,
], [Service])