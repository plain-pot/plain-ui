/**
 * 基础视图类型
 * @author  韦胜健
 * @date    2020/12/7 20:34
 */
import {PlainDate, PlainDateType} from "../../utils/PlainDate";
import {ExtractPropTypes} from 'vue';
import {VNodeChild} from "../../shims";
import {UseDateType} from './useDate';

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
        parent,
    }: {
        Node: any,                              // 容器节点
        item: Dbpid,                            // item 数据
        onClick: (item: Dbpid) => void,         // 点击item事件处理句柄
        onMouseenter: (item: Dbpid) => void,    // 进入item事件处理句柄
        parent: UseDateType | null,             // 用于判断当前组件是否存在父组件，如果存在父组件，则只显示禁用样式（如果禁用的话），仍然可以触发点击事件
    }) {

    let listener = {} as any;
    (!!parent || !item.disabled) && (listener.onClick = () => onClick(item));
    (!item.disabled) && (listener.onMouseenter = () => onMouseenter(item));

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