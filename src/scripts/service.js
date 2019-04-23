import $utils from './utils'
import $dom from './dom'
import $storage from './storage'
import $valid from '../components/form/validate'

import {PopperService} from "../components/popper";

export default function ($plain) {

    const $popper = new PopperService($plain)

    return {
        $utils,
        $dom,
        $storage,
        $popper,
        $valid,
    }
}