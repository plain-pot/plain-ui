export const enum DateView {
    year = 'year',
    month = 'month',
    date = 'date',
    time = 'time',
}

export const DatePublicProps = {
    value: {type: String},
    displayFormat: {type: String},
    valueFormat: {type: String},
    max: {type: String},
    min: {type: String},
    range: {type: Boolean},
    start: {type: String},
    end: {type: String},

    direction: {type: String},
    view: {type: String, default: DateView.month},
}

export const DatePublicMixin = {
    props: DatePublicProps,
    provide() {
        return {
            plDatePanel: this,
        }
    },
    inject: {
        plDatePanel: {default: null},
    },
    computed: {
        firstDatePanel() {
            let parent = this.plDatePanel
            while (!!parent && !!parent.plDatePanel) {
                parent = parent.plDatePanel
            }
            return parent
        },
    },
}

export const DateViewSeq = {
    year: 1,
    month: 2,
    date: 3,
    time: 4,
}