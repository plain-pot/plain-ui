import demoRow from '../aide/demo-row'
import demoRowItem from '../aide/demo-row-item'
import demoChild from '../pages/other/demo-child'

import PlainTable from './plain-table/plain-table'
import PlainOption from './plain-table/plain-option'

import PlObject from './plain-table/object/pl-object'
import object from './plain-table/object/object-tc'
import PlOv from './ov/pl-ov'
import ov from './ov/ov-tc'
import PlAddress from './address/pl-address'
import address from './address/addres-tc'

export function InstallComponent(Vue) {
    const components = {
        PlainTable,
        ImDemoChild: demoChild,
        ImDemoRow: demoRow,
        imDemoRowItem: demoRowItem,
        PlObject,
        PlOv,
        PlAddress,
    }
    Object.keys(components).forEach(key => Vue.component(key, components[key]))
    window.PlainOption = PlainOption
}

export const CustomColumns = {
    object,
    ov,
    address,
}
