import Container from './pl-notice-container.vue'
import Notice from './pl-notice-service.vue'
import {NoticeService} from './NoticeService'
import {installPlugin} from "@/util/install";

export default installPlugin([
    Container,
    Notice,
], [
    NoticeService,
])