import $utils from './utils'
import $dom from './dom'
import $storage from './storage'

import {PopperService} from "../components/popper";

export default function ($plain) {

    const $popper = new PopperService($plain)

    return {
        $utils,
        $dom,
        $storage,
        $popper,
    }
}