import $utils from '../../../scripts/utils'
import column from './base/column'
import index from './base'
import pick from './base/pick'

import input from './edit/input'
import select from './edit/select'
import date from './edit/date'
import number from './edit/number'
import color from './edit/color'
import time from './edit/time'
import radio from './edit/radio'
import toggle from './edit/toggle'

import BaseColumn from './base/pl-base-table-base-column'

const StandardColumns = {
    pick,
    index,
    column,

    input,
    select,
    date,
    number,
    color,
    time,
    radio,
    toggle,
}


function formatColumnComponent(columns) {
    return Object.keys(columns).reduce((ret, key) => {
        const component = $utils.deepmerge(BaseColumn, columns[key])
        component.name = `tc-${columns[key].name}`
        const dataFunc = component.data
        component.data = function () {
            return Object.assign(BaseColumn.data.apply(this), dataFunc.apply(this))
        }
        ret[component.name] = component
        return ret
    }, {})
}

export {
    StandardColumns,
    formatColumnComponent,
}
