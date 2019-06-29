import demoRow from '../aide/demo-row'
import demoRowItem from '../aide/demo-row-item'
import demoChild from '../pages/other/demo-child'

import PlainTable from './plain-table/plain-table'
import PlainOption from './plain-table/plain-option'

import PlObject from './plain-table/object/pl-object'

export function InstallComponent(Vue) {
    const components = {
        PlainTable,
        ImDemoChild: demoChild,
        ImDemoRow: demoRow,
        imDemoRowItem: demoRowItem,
        PlObject,
    }
    Object.keys(components).forEach(key => Vue.component(key, components[key]))
    window.PlainOption = PlainOption
}
