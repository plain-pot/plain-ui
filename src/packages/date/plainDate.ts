import DayJs from 'dayjs';
import Format from 'dayjs/plugin/customParseFormat'
import {prefix} from "../../utils/prefix";

DayJs.extend(Format)

function wrapDate(config?: { value?: string | undefined | DayJs.Dayjs | Date, displayFormat?: string, valueFormat?: string }) {
    if (!config) config = {}
    if (!config.displayFormat) config.displayFormat = 'YYYY-MM-DD'
    if (!config.valueFormat) config.valueFormat = 'YYYY-MM-DD'
    const publicAttrs = {
        displayFormat: config.displayFormat!,                       // 显示值格式化字符串
        valueFormat: config.valueFormat!,                           // 值格式化字符串
        /*根据值修改*/
        useValue: (value?: string | undefined) => wrapDate({...config!, value}),
        /*根据显示值修改*/
        useDisplay: (display?: string | undefined) => {
            const value = DayJs(display, config!.displayFormat)
            return wrapDate({value, ...config})
        },
        /*根据年份修改*/
        useYear: () => {

        },
        /*根据月份日期修改*/
        useMonthDate: () => {},
        /*根据时间修改*/
        useHour: () => {},
        /*根据分钟修改*/
        useMinute: () => {},
        /*根据秒钟修改*/
        useSecond: () => {},
        useTime: () => {},
        /*根据时分秒修改*/
        useHms: () => {},
        /*根据年月日修改*/
        useYMD: () => {},
        /*格式化显示值*/
        format: () => {},
        /*根据格式化字符串解析字符串*/
        parseDisplay: () => {},
        /*根据值格式化字符串解析字符串*/
        parseValue: () => {},
        /*克隆一个新的对象*/
        clone: () => {},
    }
    if (!config.value) {
        return {
            ...publicAttrs,
            null: true as true
        }
    }
    const dj = DayJs(config.value, publicAttrs.valueFormat)
    const dateObj = dj.toDate()

    const year = dj.year();
    const month = dj.month();
    const date = dj.date();
    const hour = dj.hour();
    const minute = dj.minute()
    const second = dj.second()
    const time = dateObj.getTime()

    const display = dj.format(publicAttrs.displayFormat)
    const value = dj.format(publicAttrs.valueFormat)

    const timeString = prefix(hour) + prefix(minute) + prefix(second)
    const dateString = prefix(year) + prefix(month + 1) + prefix(date)

    const Y = year
    const YM = `${Y}${prefix(month)}`
    const YMD = `${YM}${prefix(date)}`
    const YMDHms = `${YMD}${timeString}`
    const Hms = timeString

    return {
        ...publicAttrs,
        null: false as false,                                   // 当前是否有值
        year,
        month,
        date,
        hour,
        minute,
        second,
        time,
        display,
        value,
        timeString,
        dateString,
        Y: Y,
        YM: Number(YM),
        YMD: Number(YMD),
        YMDHms: Number(YMDHms),
        Hms: Number(Hms),
    }
}

export type PlainDate = ReturnType<typeof wrapDate>

const defaultDate = () => {
    const date = new Date()
    date.setMonth(0, 1)
    date.setHours(0, 0, 0)
    return date
}
const format = (date: Date | undefined | null, format: string) => {
    if (!date) return ''
    return DayJs(date).format(format)
}

const parse = (str: string | undefined | null, format: string) => {
    if (!str) return null
    return DayJs(str, format)
}

const today = (displayFormat: string, valueFormat: string) => {
    return wrapDate({value: new Date(), displayFormat, valueFormat})
}

export const plainDate = Object.assign(wrapDate, {defaultDate, format, parse, today,})