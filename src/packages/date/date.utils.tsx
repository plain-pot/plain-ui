import {PropType, ExtractPropTypes} from 'vue';
import {PDate} from "./plainDate";
import {VNodeChild} from "../../shims";

/**
 * 当前面板的视图
 * @author  韦胜健
 * @date    2021/1/18 10:43
 */
export enum DateView {
    year = 'year',
    month = 'month',
    date = 'date',
    time = 'time',
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
 * 用户使用的面板，所有面板都有单选、范围选择功能。除了datetime面板之外，其他所有面板都有多选功能；
 * @author  韦胜健
 * @date    2021/1/18 10:43
 */
export enum DatePanel {
    year = 'year',
    month = 'month',
    date = 'date',
    datetime = 'datetime',
    week = 'week',
}

/**
 * 在派发modelValue时，派发的start还是end事件
 * @author  韦胜健
 * @date    2021/1/18 10:44
 */
export const enum DateEmitRangeType {
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
}

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
    range: {type: Boolean},                                                     // 是否为范围选择，与multiple多选只能二选一
    multiple: {type: Boolean},                                                  // 是否为 多选，与range多选只能二选一

    firstWeekDay: {type: Number, default: 1},                                   // 一周的第一个是星期几，0是星期天，1是星期一
    defaultTime: {type: String},                                                // 默认时间，如果没有初始值，选择日期的时候时间会取这里的默认时间
    defaultStartTime: {type: String},                                           // 日期范围选择起始选择框日期面板，默认时间，如果没有初始值，选择日期的时候时间会取这里的默认时间
    defaultEndTime: {type: String},                                             // 日期范围选择截止选择框日期面板，默认时间，如果没有初始值，选择日期的时候时间会取这里的默认时间

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
        Node: any,                                      // 容器节点
        item: DateItemData,                             // item 数据
        onClick: (item: DateItemData) => void,          // 点击item事件处理句柄
        onMouseenter: (item: DateItemData) => void,     // 进入item事件处理句柄
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
                    'pl-date-base-panel-item-hover-start': item.start,
                    'pl-date-base-panel-item-hover': item.hover,
                    'pl-date-base-panel-item-hover-end': item.end,
                }
            ]}>
            <div>
                <span>{item.label}</span>
            </div>
        </Node>
    )
}