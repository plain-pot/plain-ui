import $utils from '../../../scripts/utils'
import column from './column'
import input from './input'
import BaseColumn from './pl-base-table-base-column'

const StandardColumns = {
    column,
    input,
}


function formatColumnComponent(columns) {
    return Object.keys(columns).reduce((ret, key) => {
        const component = $utils.deepmerge(BaseColumn, columns[key])
        component.name = `tc-${columns[key].name}`
        ret[component.name] = component
        return ret
    }, {})
}

export {
    StandardColumns,
    formatColumnComponent,
}