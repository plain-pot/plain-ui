import $utils from '../../../scripts/utils'
import column from './column'
import input from './input'

const columns = {
    column,
    input,
}

const TableColumns = Object.keys(columns).reduce((ret, key) => {
    const component = columns[key]
    if (component.name !== 'column') {
        component.name = `column-${key}`
    }
    ret[key === 'column' ? key : `column${$utils.getKebabCase(key)}`] = component
    return ret
}, {})

// console.log(TableColumns)

export {
    TableColumns,
}