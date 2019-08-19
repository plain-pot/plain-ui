import demoRow from '../aide/demo-row'
import demoRowItem from '../aide/demo-row-item'
import demoChild from '../pages/other/demo-child'

import PlainTable from './plain-table/plain-table'
import {getPlainOptionClass} from "./plain-table/plain-option";

import PlObject from './plain-table/object/pl-object'
import object from './plain-table/object/object-tc'
import PlOv from './ov/pl-ov'
import ov from './ov/ov-tc'
import PlAddress from './address/pl-address'
import address from './address/addres-tc'
import PmImg from './img/pm-img'
import img from './img/img'

export function InstallComponent(Vue) {
    const components = {
        PlainTable,
        ImDemoChild: demoChild,
        ImDemoRow: demoRow,
        imDemoRowItem: demoRowItem,
        PlObject,
        PlOv,
        PlAddress,
        PmImg,
    }
    Object.keys(components).forEach(key => Vue.component(key, components[key]))
    window.PlainOption = getPlainOptionClass(Vue)
}

export const CustomColumns = {
    object,
    ov,
    address,
    img,
}
