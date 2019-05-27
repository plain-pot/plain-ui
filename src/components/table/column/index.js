import $utils from '../../../scripts/utils'
import column from './column'
import index from './edit/index'
import pick from './edit/pick'

import input from './edit/input'
import select from './edit/select'

import BaseColumn from './pl-base-table-base-column'

const StandardColumns = {
    pick,
    index,
    column,

    input,
    select,
}


function formatColumnComponent(columns) {
    return Object.keys(columns).reduce((ret, key) => {
        const component = $utils.deepmerge(BaseColumn, columns[key])
        component.name = `tc-${columns[key].name}`
        const dataFunc = component.data
        component.data = function () {
            return Object.assign({edit: null, normal: null, head: null}, dataFunc.apply(this))
        }
        ret[component.name] = component
        return ret
    }, {})
}

export {
    StandardColumns,
    formatColumnComponent,
}