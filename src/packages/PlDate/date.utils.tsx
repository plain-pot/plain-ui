/**
 * 当前面板的视图
 * @author  韦胜健
 * @date    2021/1/18 10:43
 */
import {ExtractPropTypes, PropType, VueNode} from "plain-ui-composition";
import {PDate, plainDate} from "../../utils/plainDate";
import {classnames} from "plain-utils/dom/classnames";

export enum DateView {
    year = 'year',
    month = 'month',
    date = 'date',
    time = 'time',
}

export enum DatePanel {
    year = 'year',
    month = 'month',
    date = 'date',
    week = 'week',
    quarter = 'quarter',
}

/**
 * 跟节点切换动画的方向
 * @author  韦胜健
 * @date    2021/1/18 10:43
 */
export enum SlideTransitionDirection {
    next = 'next',
    prev = 'prev'
}

/**
 * 在派发modelValue时，派发的start还是end事件
 * @author  韦胜健
 * @date    2021/1/18 10:44
 */
export enum DateEmitRangeType {
    start = 'start',
    end = 'end',
}

/**
 * 面板的默认格式化字符串
 * @author  韦胜健
 * @date    2021/1/18 10:46
 */
export const DefaultDateFormatString = {
    year: 'YYYY',
    month: 'YYYY-MM',
    date: 'YYYY-MM-DD',
    datetime: 'YYYY-MM-DD HH:mm:ss',
    week: 'YYYY-MM-DD',
    Hms: 'HH:mm:ss',
    quarter: 'YYYY年第ww季度',
}

export const getDefaultDateFormatter = (() => {
    function getDefaultDateValueFormat(panel: keyof typeof DatePanel, datetime?: boolean) {
        switch (panel) {
            case DatePanel.year:
                return DefaultDateFormatString.year
            case DatePanel.month:
                return DefaultDateFormatString.month
            case DatePanel.date:
                return datetime ? DefaultDateFormatString.datetime : DefaultDateFormatString.date
            case DatePanel.week:
                return DefaultDateFormatString.date
            case DatePanel.quarter:
                return DefaultDateFormatString.month
        }
        throw new Error(`can't recognise date panel:` + panel)
    }

    function getDefaultDateDisplayFormat(panel: keyof typeof DatePanel, datetime?: boolean) {
        switch (panel) {
            case DatePanel.year:
                return DefaultDateFormatString.year
            case DatePanel.month:
                return DefaultDateFormatString.month
            case DatePanel.date:
                return datetime ? DefaultDateFormatString.datetime : DefaultDateFormatString.date
            case DatePanel.week:
                return 'gggg年第ww周'
            case DatePanel.quarter:
                return 'YYYY年第Q季度'
        }
        throw new Error(`can't recognise date panel:` + panel)
    }

    return (panel: keyof typeof DatePanel, datetime?: boolean) => ({
        displayFormat: getDefaultDateDisplayFormat(panel, datetime),
        valueFormat: getDefaultDateValueFormat(panel, datetime),
    })
})();

export const DateViewSeq = {
    year: 1,
    month: 2,
    date: 3,
    time: 4,
}

export const DatePublicProps = {
    modelValue: {type: [String, Array] as PropType<string | string[]>},         // 双向绑定值，单选时为单个字符串，多选时为字符串数组
    start: {type: String},                                                      // 范围选择，起始值绑定值
    end: {type: String},                                                        // 范围选择，截止值绑定值
    displayFormat: {type: String},                                              // 显示值格式化字符串
    valueFormat: {type: String},                                                // 值格式化字符串
    max: {type: String},                                                        // 最大值
    min: {type: String},                                                        // 最小值
    range: {type: Boolean, default: false},                                     // 是否为范围选择，与multiple多选只能二选一
    multiple: {type: Boolean},                                                  // 是否为 多选，与range多选只能二选一

    firstWeekDay: {type: Number, default: 1},                                   // 一周的第一个是星期几，0是星期天，1是星期一
    defaultTime: {type: String},                                                // 默认时间，如果没有初始值，选择日期的时候时间会取这里的默认时间
    defaultStartTime: {type: String},                                           // 日期范围选择起始选择框日期面板，默认时间，如果没有初始值，选择日期的时候时间会取这里的默认时间
    defaultEndTime: {type: String},                                             // 日期范围选择截止选择框日期面板，默认时间，如果没有初始值，选择日期的时候时间会取这里的默认时间

    showQuarter: {type: Boolean},                                               // 月份面板是否显示季度
    isQuarterActive: {type: Function as PropType<(did: DateItemData) => boolean>},// 季度是否高亮判断函数

    /*inner props*/
    direction: {type: String, default: 'horizontal'},                           // 根节点在 pl-transition-slide 动画下的动画方向，是horizontal还是vertical
    view: {type: String as PropType<DateView>, default: DateView.month},        // 当前视图
    selectDate: {type: Object as PropType<PDate>},                              // 当前面板的年月日期对象
    datetime: {type: Boolean},                                                  // 是否为日期时间视图
}

/**
 * 所有面板的公共属性对象类型
 * @author  韦胜健
 * @date    2021/1/18 10:45
 */
export type DatePublicPropsType = ExtractPropTypes<typeof DatePublicProps>

/**
 * 所有面板的公共派发事件配置对象
 * @author  韦胜健
 * @date    2021/1/18 10:45
 */
export const DatePublicEmits = {
    onUpdateModelValue: (val?: string | string[], rangeType?: DateEmitRangeType) => true,
    onUpdateStart: (val?: string) => true,
    onUpdateEnd: (val?: string) => true,
    onUpdateView: (view: DateView) => true,
}

/**
 * 单个日期选项的数据类型
 * @author  韦胜健
 * @date    2021/1/18 16:04
 */
export interface DateItemData {
    label: string | number,
    active: boolean,
    now: boolean,
    disabled: boolean,
    start: boolean,
    hover: boolean,
    end: boolean,
    clickable: boolean,
    pd: PDate,
    range: boolean,
    externals?: any,
}

export function DatePanelWrapper(slots: {
    left?: VueNode,
    center: VueNode,
    right?: VueNode,
    content: VueNode,
    bodyAttrs?: any,
}) {
    return (
        <div class="pl-date-base-panel">
            <div class="pl-date-base-panel-header">
                <div>{slots.left}</div>
                <div>{slots.center}</div>
                <div>{slots.right}</div>
            </div>
            <div class="pl-date-base-panel-body" {...(slots.bodyAttrs || {})}>
                {slots.content}
            </div>
        </div>
    ) as any
}

export function DatePanelItemWrapper(
    {
        Node,
        item,
        onClick,
        onMouseenter,
    }: {
        Node: any,                                      // 容器节点
        item: DateItemData,                             // item 数据
        onClick: (item: DateItemData) => void,          // 点击item事件处理句柄
        onMouseenter: (item: DateItemData) => void,     // 进入item事件处理句柄
    }) {

    let listener = {} as any;
    item.clickable && (listener.onClick = () => onClick(item));
    !item.disabled && (listener.onMouseEnter = () => onMouseenter(item));

    return {
        ...Node,
        props: {
            ...Node.props,
            class: `${Node.props.class} ${classnames([
                'pl-date-base-panel-item',
                {
                    'pl-date-base-panel-item-active': item.active,
                    'pl-date-base-panel-item-now': item.now,
                    'pl-date-base-panel-item-disabled': item.disabled,
                    'pl-date-base-panel-item-hover-start': item.start,
                    'pl-date-base-panel-item-hover': item.hover,
                    'pl-date-base-panel-item-hover-end': item.end,
                }
            ])}`,
            ...listener,
            children: (
                <div>
                    <span>{item.label}</span>
                </div>
            )
        },
    }
}

export const DateCommonUtils = {
    /*今天*/
    today: (displayFormat = 'YYYY-MM-DD', valueFormat = 'YYYY-MM-DD') => plainDate(new Date(), {displayFormat, valueFormat}).getDayJs(),
    /*昨天*/
    yesterday: (displayFormat = 'YYYY-MM-DD', valueFormat = 'YYYY-MM-DD') => {
        const today = DateCommonUtils.today(displayFormat, valueFormat)
        return today.day(-1)
    },
    /*明天*/
    tomorrow: (displayFormat = 'YYYY-MM-DD', valueFormat = 'YYYY-MM-DD') => {
        const today = DateCommonUtils.today(displayFormat, valueFormat)
        return today.day(+1)
    },
    week: {
        start: (displayFormat = 'YYYY-MM-DD', valueFormat = 'YYYY-MM-DD') => {
            const today = DateCommonUtils.today(displayFormat, valueFormat)
            return today.startOf('week')
        },
        end: (displayFormat = 'YYYY-MM-DD', valueFormat = 'YYYY-MM-DD') => {
            const today = DateCommonUtils.today(displayFormat, valueFormat)
            return today.endOf('week')
        },
    },
    month: {
        start: (displayFormat = 'YYYY-MM-DD', valueFormat = 'YYYY-MM-DD') => {
            const today = DateCommonUtils.today(displayFormat, valueFormat)
            return today.startOf('month')
        },
        end: (displayFormat = 'YYYY-MM-DD', valueFormat = 'YYYY-MM-DD') => {
            const today = DateCommonUtils.today(displayFormat, valueFormat)
            return today.endOf('month')
        },
    },
    year: {
        start: (displayFormat = 'YYYY-MM-DD', valueFormat = 'YYYY-MM-DD') => {
            const today = DateCommonUtils.today(displayFormat, valueFormat)
            return today.startOf('year')
        },
        end: (displayFormat = 'YYYY-MM-DD', valueFormat = 'YYYY-MM-DD') => {
            const today = DateCommonUtils.today(displayFormat, valueFormat)
            return today.endOf('year')
        },
    },
}

/*
console.log('今天', DateCommonUtils.today().format('YYYY-MM-DD'))
console.log('明天', DateCommonUtils.tomorrow().format('YYYY-MM-DD'))
console.log('昨天', DateCommonUtils.yesterday().format('YYYY-MM-DD'))
console.log('本周第一天', DateCommonUtils.week.start().format('YYYY-MM-DD'))
console.log('本周最后一天', DateCommonUtils.week.end().format('YYYY-MM-DD'))
console.log('本月第一天', DateCommonUtils.month.start().format('YYYY-MM-DD'))
console.log('本月最后一天', DateCommonUtils.month.end().format('YYYY-MM-DD'))
console.log('本年第一天', DateCommonUtils.year.start().format('YYYY-MM-DD'))
console.log('本年最后一天', DateCommonUtils.year.end().format('YYYY-MM-DD'))*/
