/**
 * 基础视图类型
 * @author  韦胜健
 * @date    2020/12/7 20:34
 */
import {PlainDate} from "../../utils/PlainDate";
import {ExtractPropTypes} from 'vue';

export const enum DateView {
    year = 'year',
    month = 'month',
    date = 'date',
    time = 'time',
}

export const enum SlideTransitionDirection {
    next = 'next',
    prev = 'prev'
}

export const DatePublicProps = {
    modelValue: {type: String},
    start: {type: String},
    end: {type: String},

    displayFormat: {type: String},
    valueFormat: {type: String},
    max: {type: String},
    min: {type: String},
    range: {type: Boolean},

    direction: {type: String, default: 'horizontal'},                                   // 根节点在 pl-transition-slide 动画下的动画方向，是horizontal还是vertical
    view: {type: String, default: DateView.month},                                      // 当前视图
    selectDate: {type: PlainDate},                                                      // 当前面板的年月日期对象

    /* base panel date 专用属性*/
    datetime: {type: Boolean},                                                          // 是否为日期时间视图
    firstWeekDay: {type: Number, default: 1},                                           // 一周的第一个是星期几，0是星期天，1是星期一
    defaultTime: {type: String},                                                        // 默认时间，如果没有初始值，选择日期的时候时间会取这里的默认时间
}

/**
 * 日期公共属性解析后的类型
 * @author  韦胜健
 * @date    2020/12/7 20:37
 */
export type DatePublicPropsType = ExtractPropTypes<typeof DatePublicProps>;
