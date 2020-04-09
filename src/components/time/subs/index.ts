export const BaseTimePanelProps = {
    value: {type: String},
    displayFormat: {type: String},
    valueFormat: {type: String},

    customSelectOption: {type: Function},
    layout: {type: Array, default: () => (['h', 'm', 's'])},

    buttonBar: {type: [Function, Boolean]},
}