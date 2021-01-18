import DayJs from 'dayjs';
import Format from 'dayjs/plugin/customParseFormat'
import {prefix} from "../../utils/prefix";

DayJs.extend(Format)

type InitialValue = string | DayJs.Dayjs | Date | undefined;

interface PDate {
    year: number
    month: number
    date: number
    hour: number
    minute: number
    second: number
    time: number
    day: number
    display: string
    value: string
    timeString: string
    dateString: string
    displayFormat: string
    valueFormat: string
    Y: number
    YM: number
    YMD: number
    YMDHms: number
    Hms: number
    useValue: (value: string) => PDate
    useDisplay: (display: string) => PDate
    useYear: (year: number) => PDate
    useMonthDate: (month: number, date: number) => PDate
    useHour: (hour: number) => PDate
    useMinute: (minute: number) => PDate
    useSecond: (second: number) => PDate
    useTime: (time: number) => PDate
    useHms: ((pd: PDate) => PDate) | ((hour: number, minute: number, second: number) => PDate)
    useYMD: ((pd: PDate) => PDate) | ((year: number, month: number, date: number) => PDate)
    format: (value: InitialValue) => string
    parseDisplay: (display: string) => PDate
    parseValue: (value: string) => PDate
    clone: () => PDate,
}

function wrapDate(initialValue: InitialValue, config: { displayFormat: string, valueFormat: string }): PDate {

    const dj = DayJs(initialValue, typeof initialValue === "string" ? config.valueFormat : undefined)
    const dateObj = dj.toDate()
    const year = dj.year();
    const month = dj.month();
    const date = dj.date();
    const hour = dj.hour();
    const minute = dj.minute()
    const second = dj.second()
    const time = dateObj.getTime()
    const day = dateObj.getDay()

    const display = dj.format(config.displayFormat)
    const value = dj.format(config.valueFormat)

    const timeString = prefix(hour) + prefix(minute) + prefix(second)
    const dateString = prefix(year) + prefix(month + 1) + prefix(date)

    const Y = year
    const YM = `${Y}${prefix(month + 1)}`
    const YMD = `${YM}${prefix(date)}`
    const YMDHms = `${YMD}${timeString}`
    // const Hms = timeString
    return {
        year,
        month,
        date,
        hour,
        minute,
        second,
        day,
        time,
        display,
        value,
        timeString,
        dateString,
        Y: Y,
        YM: Number(YM),
        YMD: Number(YMD),
        YMDHms: Number(YMDHms),
        Hms: Number(timeString),
        displayFormat: config.displayFormat!,                       // 显示值格式化字符串
        valueFormat: config.valueFormat!,                           // 值格式化字符串
        /*根据值修改*/
        useValue: (value: InitialValue) => wrapDate(value, config),
        /*根据显示值修改*/
        useDisplay: (display?: string | undefined) => wrapDate(DayJs(display, config!.displayFormat), config),
        /*根据年份修改*/
        useYear: (year: number) => wrapDate(dj.year(year), config),
        /*根据月份日期修改*/
        useMonthDate: (month: number, date: number) => wrapDate(dj.month(month).date(date), config),
        /*根据时间修改*/
        useHour: (hour: number) => wrapDate(dj.hour(hour), config),
        /*根据分钟修改*/
        useMinute: (minute: number) => wrapDate(dj.minute(minute), config),
        /*根据秒钟修改*/
        useSecond: (second: number) => wrapDate(dj.second(second), config),
        /*根据时间戳修改*/
        useTime: (time: number) => wrapDate(new Date(time), config),
        /*根据时分秒修改*/
        useHms: (val: PDate | number, minute: number, second: number) => {
            if (typeof val === "number") {
                return wrapDate(dj.hour(val).minute(minute).second(second), config)
            } else {
                return wrapDate(dj.hour(val.hour).minute(val.minute).second(val.second), config)
            }
        },
        /*根据年月日修改*/
        useYMD: (val: number | PDate, month: number, date: number) => {
            if (typeof val === "number") {
                return wrapDate(dj.year(val).month(month).date(date), config)
            } else {
                return wrapDate(dj.year(val.year).month(val.month).date(val.date), config)
            }
        },
        /*格式化值*/
        format: (value) => DayJs(value, config.valueFormat).format(config.displayFormat),
        /*根据格式化字符串解析字符串*/
        parseDisplay: (display: string) => wrapDate(DayJs(display, config.displayFormat), config),
        /*根据值格式化字符串解析字符串*/
        parseValue: (value: string) => wrapDate(DayJs(value, config.valueFormat), config),
        /*克隆一个新的对象*/
        clone: () => wrapDate(initialValue, config)
    }
}

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
    return wrapDate(new Date(), {displayFormat, valueFormat})
}

export const plainDate = Object.assign(wrapDate, {defaultDate, format, parse, today,})