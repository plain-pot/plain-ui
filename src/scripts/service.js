import $utils from './utils'
import $dom from './dom'
import $storage from './storage'
import $valid from '../components/form/validate'
import {MessageService} from "../components/message";
import {SelectService} from "../components/select";
import $keyboard from './keyboard'
import {DialogService} from "../components/dialog";

import {PopperService} from "../components/popper";

export default function ($plain) {
    const $popper = new PopperService($plain)
    const $message = new MessageService($plain)
    const $select = new SelectService($plain)
    const $dialog = new DialogService($plain)

    const service = {
        inner: {
            $utils,
            $dom,
            $storage,
            $popper,
            $valid,
            $select,
            $keyboard,
        },
        outer: {
            $message,
            $dialog,
        },
    }
    Object.assign($plain, service.inner)
    Object.assign($plain.Vue.prototype, service.outer)
}