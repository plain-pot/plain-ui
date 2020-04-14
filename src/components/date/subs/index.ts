export const DatePublicProps = {
    value: {type: String},
    displayFormat: {type: String},
    valueFormat: {type: String},
    max: {type: String},
    min: {type: String},
    range: {type: Boolean},
    start: {type: String},
    end: {type: String},
    checkDisabled: {type: Function},
}

export enum DateView {
    year = 'year',
    month = 'month',
    date = 'date',
    time = 'time',
}

export const DateViewSeq = {
    year: 1,
    month: 2,
    date: 3,
    time: 4,
}