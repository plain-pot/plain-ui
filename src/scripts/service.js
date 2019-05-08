import $utils from './utils'
import $dom from './dom'
import $storage from './storage'
import $valid from '../components/form/validate'
import {MessageService} from "../components/message";
import {SelectService} from "../components/select";
import $keyboard from './keyboard'
import {DialogService} from "../components/dialog";
import {NoticeService} from "../components/notice";

export default function ($plain) {
    const $message = new MessageService($plain)
    const $select = new SelectService($plain)
    const $dialog = new DialogService($plain)
    const $notice = new NoticeService($plain)

    const service = {
        inner: {
            $utils,
            $dom,
            $storage,
            $valid,
            $select,
            $keyboard,
        },
        outer: {
            $message,
            $dialog,
            $notice,
        },
    }
    Object.assign($plain, service.inner)
    Object.assign($plain.Vue.prototype, service.outer)
}