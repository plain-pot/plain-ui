export const BaseTimePanelProps = {
    value: {type: String},
    displayFormat: {type: String, default: 'HH:mm:ss'},
    valueFormat: {type: String, default: 'HH:mm:ss'},

    customSelectOption: {type: Function},
    layout: {type: Array, default: () => (['h', 'm', 's'])},

    buttonBar: {type: [Function, Boolean]},
    max: {type: String},
    min: {type: String},
}