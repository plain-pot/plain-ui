export const SELECT_PANEL_COLLECTOR = '@@SELECT_PANEL_PROVIDER'

function iterateChildren(array: any, fn: Function) {
    (array || []).forEach((item, index) => {
        if (!item.group) {
            fn({item, index})
        } else {
            if (!!item.items.value && item.items.value.length > 0) {
                iterateChildren(item.items.value, fn)
            }
        }
    })
}

function formatItems(items) {
    const array: any[] = []
    SelectUtils.iterateChildren(items, ({item}) => array.push(item))
    return array
}

export const SelectUtils = {
    iterateChildren,
    formatItems,
}