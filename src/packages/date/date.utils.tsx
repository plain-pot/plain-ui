/**
 * 基础视图类型
 * @author  韦胜健
 * @date    2020/12/7 20:34
 */
import {PlainDate, PlainDateType} from "../../utils/PlainDate";
import {ExtractPropTypes} from 'vue';
import {VNodeChild} from "../../shims";

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

    /* base panel date 专用*/
    datetime: {type: Boolean},                                                          // 是否为日期时间视图
    firstWeekDay: {type: Number, default: 1},                                           // 一周的第一个是星期几，0是星期天，1是星期一
    defaultTime: {type: String},                                                        // 默认时间，如果没有初始值，选择日期的时候时间会取这里的默认时间
    /* date range 专用*/
    defaultStartTime: {type: String},                                                   // 日期范围选择起始选择框日期面板，默认时间，如果没有初始值，选择日期的时候时间会取这里的默认时间
    defaultEndTime: {type: String},                                                     // 日期范围选择截止选择框日期面板，默认时间，如果没有初始值，选择日期的时候时间会取这里的默认时间
}

/**
 * 日期公共属性解析后的类型
 * @author  韦胜健
 * @date    2020/12/7 20:37
 */
export type DatePublicPropsType = ExtractPropTypes<typeof DatePublicProps>;

export const DefaultDateFormatString = {
    year: 'YYYY',
    month: 'YYYY-MM',
    date: 'YYYY-MM-DD',
    datetime: 'YYYY-MM-DD HH:mm:ss',
    week: 'YYYY-MM-DD',
    dates: 'YYYY-MM-DD',
}

export const DatePublicEmits = {
    updateModelValue: (val?: string, rangeType?: DateEmitRangeType) => true,
    updateStart: (val?: string) => true,
    updateEnd: (val?: string) => true,
    updateView: (view: DateView) => true,
}

/*DateBasePanelItemData*/
export interface Dbpid {
    label: string | number
    active: boolean
    now: boolean
    disabled: boolean
    hoverStart: boolean
    hover: boolean
    hoverEnd: boolean
    clickable: boolean
    ipd: PlainDateType

    range: boolean

    [key: string]: any
}

export const enum DateEmitRangeType {
    start = 'start',
    end = 'end',
}

export function DatePanelWrapper(slots: {
    left?: VNodeChild,
    center: VNodeChild,
    right?: VNodeChild,
    content: VNodeChild,
}) {
    return (
        <div class="pl-date-base-panel">
            <div class="pl-date-base-panel-header">
                <div>{slots.left}</div>
                <div>{slots.center}</div>
                <div>{slots.right}</div>
            </div>
            <div class="pl-date-base-panel-body">
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
        Node: any,                              // 容器节点
        item: Dbpid,                            // item 数据
        onClick: (item: Dbpid) => void,         // 点击item事件处理句柄
        onMouseenter: (item: Dbpid) => void,    // 进入item事件处理句柄
    }) {

    let listener = {} as any;
    item.clickable && (listener.onClick = () => onClick(item));
    !item.disabled && (listener.onMouseenter = () => onMouseenter(item));

    return (
        <Node
            {...listener}
            class={[
                'pl-date-base-panel-item',
                {
                    'pl-date-base-panel-item-active': item.active,
                    'pl-date-base-panel-item-now': item.now,
                    'pl-date-base-panel-item-disabled': item.disabled,
                    'pl-date-base-panel-item-hover-start': item.hoverStart,
                    'pl-date-base-panel-item-hover': item.hover,
                    'pl-date-base-panel-item-hover-end': item.hoverEnd,
                }
            ]}>
            <div>
                <span>{item.label}</span>
            </div>
        </Node>
    )

}

export const DateViewSeq = {
    year: 1,
    month: 2,
    date: 3,
    time: 4,
}

export const WeekUtils = {
    /**
     * 获取特定日期，在一周中的最后一天
     * @author  韦胜健
     * @date    2020/12/10 9:42
     */
    getLastPdOfWeek: (pd: PlainDateType, firstWeekDay?: number) => {
        if (pd.isNull) {
            return null
        }
        pd = pd.copy()
        firstWeekDay = firstWeekDay == null ? 1 : firstWeekDay
        const weekDayDuration = pd.day! - firstWeekDay
        let offsetDay = weekDayDuration === 0 ? 0 : weekDayDuration > 0 ? weekDayDuration : 7 + weekDayDuration
        pd.setMonthDate(pd.month!, pd.date! - offsetDay + 6)
        return pd
    },
    /**
     * 获取日期在第几周
     * @author  韦胜健
     * @date    2020/12/10 10:19
     */
    getWeekNumber: (value?: string, config?: { valueFormat?: string, firstWeekDay?: number }) => {
        let ret = {
            year: null as null | number,
            week: null as null | number,
        }
        if (!value) {return ret}

        config = config || {}
        const valueFormat = config.valueFormat || DefaultDateFormatString.date
        const firstWeekDay = config.firstWeekDay == null ? 1 : config.firstWeekDay
        let vpd = new PlainDate(value, valueFormat, valueFormat)
        if (vpd.isNull) {return ret}

        const valueLastWeekPd = WeekUtils.getLastPdOfWeek(vpd, firstWeekDay)!
        vpd = valueLastWeekPd.copy()
        vpd.setYMD(valueLastWeekPd.Y!, 0, 1)
        const yearFirstDayLastWeekPd = WeekUtils.getLastPdOfWeek(vpd, firstWeekDay)

        if (!!yearFirstDayLastWeekPd && !yearFirstDayLastWeekPd.isNull && !!valueLastWeekPd && !valueLastWeekPd.isNull) {
            const num = (valueLastWeekPd.time - yearFirstDayLastWeekPd.time) / (24 * 60 * 60 * 1000 * 7)
            ret.year = yearFirstDayLastWeekPd.year
            ret.week = num + 1
        }

        return ret
    },
    /**
     * 获取周字符串
     * @author  韦胜健
     * @date    2020/12/10 17:03
     */
    getWeekZhcnString: (value?: string, config?: { valueFormat?: string, firstWeekDay?: number }) => {
        const {year, week} = WeekUtils.getWeekNumber(value, config)
        if (!!year) {
            return `${year}年 第${week}周`
        } else {
            return null
        }
    },
}