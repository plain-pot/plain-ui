import $utils from './utils'
import $dom from './dom'
import $storage from './storage'
import $valid from '../components/form/validate'
import {MessageService} from "../components/message";

import {PopperService} from "../components/popper";

export default function ($plain) {
    const $popper = new PopperService($plain)
    const $message = new MessageService($plain)

    const service = {
        inner: {
            $utils,
            $dom,
            $storage,
            $popper,
            $valid,
        },
        outer: {
            $message,
        },
    }
    Object.assign($plain, service.inner)
    Object.assign($plain.Vue.prototype, service.outer)
}