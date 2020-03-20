export const SelectKey = [
    "labelKey",
    "valueKey",
    "groupKey",
    "disabledKey",
    "iconKey",
]

export function decodeSelectData(data, opts = {}) {

    if (typeof data === 'string' || typeof data === 'number') {
        return {
            label: data,
            value: data,
            group: null,
            disabled: null,
            icon: null,
        }
    }

    return SelectKey.reduce((ret, key) => {
        if (!!opts[key]) {
            ret[key.replace('Key', '')] = data[opts[key]]
        }
        return ret
    }, {})
}