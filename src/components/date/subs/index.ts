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
        /**
         * 根据datetime自动计算 displayFormat以及valueFormat格式化字符串
         * @author  韦胜健
         * @date    2020/4/14 23:19
         */
        formatString() {
            return this.getFormatString()
        },
    },
    methods: {
        /*---------------------------------------utils-------------------------------------------*/
        /**
         * 根据datetime自动计算displayFormat以及valueFormat
         * @author  韦胜健
         * @date    2020/4/15 10:57
         */
        getFormatString() {
            let ret = {
                displayFormat: this.displayFormat,
                valueFormat: this.valueFormat,
            }
            if (!ret.displayFormat) {
                if (!this.datetime) {
                    ret.displayFormat = 'YYYY-MM-DD'
                } else {
                    ret.displayFormat = 'YYYY-MM-DD HH:mm:ss'
                }
            }
            if (!ret.valueFormat) {
                if (!this.datetime) {
                    ret.valueFormat = 'YYYY-MM-DD'
                } else {
                    ret.valueFormat = 'YYYY-MM-DD HH:mm:ss'
                }
            }
            return ret
        },
    },
}

export const DateViewSeq = {
    year: 1,
    month: 2,
    date: 3,
    time: 4,
}