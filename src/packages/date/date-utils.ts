import {PlainDate} from "@/util/PlainDate";

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

export const enum DateEmitInputType {
    start = 'start',
    end = 'end',
}

export interface PanelItemParam {
    max?: PlainDate,
    min?: PlainDate,
    value?: PlainDate | PlainDate[],
    hoverRange?: [PlainDate, PlainDate] | null,
    valueRange: [PlainDate, PlainDate],
    range?: boolean,
}

export type PanelItemParamType = {
    range: boolean,
    value?: PlainDate | PlainDate[],
    hoverRange?: [PlainDate, PlainDate] | null,
    valueRange: [PlainDate, PlainDate]
}

export interface PanelParentProvider {
    year?: PanelItemParam,
    month?: PanelItemParam,
    date?: PanelItemParam,
}

export const DefaultFormatString = {
    year: 'YYYY',
    month: 'YYYY-MM',
    date: 'YYYY-MM-DD',
    datetime: 'YYYY-MM-DD HH:mm:ss',
    week: 'YYYY-MM-DD',
    dates: 'YYYY-MM-DD',
}

export const DateViewSeq = {
    year: 1,
    month: 2,
    date: 3,
    time: 4,
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

    direction: {type: String, default: 'horizontal'},                                   // 根节点在 pl-transition-slide 动画下的动画方向，是horizontal还是vertical
    view: {type: String, default: DateView.month},                                      //

    /* base panel date 专用*/
    datetime: {type: Boolean},                                                          // 是否为选择日期时间
    firstWeekDay: {type: Number, default: 1},                                           // 一周的第一个是星期几，0是星期天，1是星期一
    defaultTime: {type: String},                                                        // 默认时间，如果没有初始值，选择日期的时候时间会取这里的默认时间
    selectDate: {type: PlainDate},                                                      // 当前面板的年月日期对象
}

export class DateBasePanelItemData {
    label: string | number = ''
    active: boolean = false
    now: boolean = false
    disabled: boolean = false
    hoverStart: boolean = false
    hover: boolean = false
    hoverEnd: boolean = false
    ipd?: PlainDate = PlainDate.today(DefaultFormatString.date, DefaultFormatString.date)

    range: boolean = false;

    [key: string]: any
}

export const DATE_PANEL_PROVIDER = '@@DATE_PANEL_PROVIDER'