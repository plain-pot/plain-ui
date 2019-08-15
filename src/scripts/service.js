import PlainUtils from 'plain-utils'

import $valid from '../components/form/validate'
import {MessageService} from "../components/message";
import {SelectService} from "../components/select";
import $keyboard from './keyboard'
import {DialogService} from "../components/dialog";
import {NoticeService} from "../components/notice";
import {ImageService} from "../../src/components/img";

export default function ($plain) {
    const StorageService = PlainUtils.StorageService

    const $utils = PlainUtils.$utils
    const $dom = PlainUtils.$dom
    const $message = new MessageService($plain)
    const $select = new SelectService($plain)
    const $dialog = new DialogService($plain)
    const $notice = new NoticeService($plain)
    const $storage = new StorageService($plain)
    const $img = new ImageService($plain)

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
            $img,
        },
    }
    Object.assign($plain, service.inner)
    Object.assign($plain.Vue.prototype, service.outer)
}
