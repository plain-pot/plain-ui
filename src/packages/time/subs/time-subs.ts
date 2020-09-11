export const TimePublicProps = {
    displayFormat: {type: String, default: 'HH:mm:ss'},
    valueFormat: {type: String, default: 'HH:mm:ss'},
    max: {type: String},
    min: {type: String},
    layout: {type: Array, default: () => (['h', 'm', 's'])},
    custom: Function,
    checkDisabled: Function,
}