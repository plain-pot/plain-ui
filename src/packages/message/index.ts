import './message.scss'
import container from './pl-message-container.vue'
import message from './pl-message-item.vue'
import service from './MessageService'
import {installPlugin} from "@/util/install";

export default installPlugin([
    container,
    message,
], [
    service
])