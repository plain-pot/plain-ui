import {PlainDate} from "../../../utils/PlainDate";

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

    direction: {type: String},                                                          // 根节点在 pl-transition-slide 动画下的动画方向，是horizontal还是vertical
    view: {type: String, default: DateView.month},                                      //

    /* base panel date 专用*/
    datetime: {type: Boolean},                                                          // 是否为选择日期时间
    firstWeekDay: {type: Number, default: 1},                                           // 一周的第一个是星期几，0是星期天，1是星期一
    defaultTime: {type: String},                                                        // 默认时间，如果没有初始值，选择日期的时候时间会取这里的默认时间
    selectDate: {type: PlainDate},                                                      // 当前面板的年月日期对象
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