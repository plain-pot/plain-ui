import DayJs from 'dayjs';
import Format from 'dayjs/plugin/customParseFormat'
import WeekYear from 'dayjs/plugin/weekYear'
import WeekOfYear from 'dayjs/plugin/weekOfYear'
import AdvanceFormat from 'dayjs/plugin/advancedFormat'
import 'dayjs/locale/de'
import {prefix} from "./prefix";

DayJs.locale('de')
DayJs.extend(Format)
DayJs.extend(WeekYear)
DayJs.extend(WeekOfYear)
DayJs.extend(AdvanceFormat)

type InitialValue = string | DayJs.Dayjs | Date | undefined;

/**
 * 所有use开头的函数，都会返回一个新的PDate实例，不会修改原有基础的对象
 * @author  韦胜健
 * @date    2021/1/18 10:26
 */
export interface PDate {
    year: number                            // 年
    month: number                           // 月
    date: number                            // 日
    hour: number                            // 时
    minute: number                          // 分
    second: number                          // 秒
    time: number                            // 时间戳
    day: number                             // 周？
    timeString: string                      // 时分秒字符串
    dateString: string                      // 日期字符串
    displayFormat: string                   // 显示格式化字符串
    valueFormat: string                     // 值格式化字符串
    Y: number                               // 年数字
    YM: number                              // 年月数字(补零)
    YMD: number                             // 年月日数字(补零)
    YMDHms: number                          // 年月日时分秒数字(补零)
    Hms: number                             // 时分秒(补零)

    getDayJs: () => DayJs.Dayjs,            // 获取dayjs对象
    getDate: () => Date,                    // 获取date对象
    getDisplay: () => string                // 获取显示值
    getValue: () => string                  // 获取值

    /*所有use开头的函数，返回值都是一个新的plainDate对象*/
    useValue: (value: string) => PDate      // 应用值
    useDisplay: (display: string) => PDate  // 应用显示值
    useYear: (year: number) => PDate        // 应用年
    useMonthDate: (month: number, date: number) => PDate // 应用月日
    useHour: (hour: number) => PDate        // 应用时
    useMinute: (minute: number) => PDate    // 应用分钟
    useSecond: (second: number) => PDate    // 应用时
    useTime: (time: number) => PDate        // 应用时间戳
    useHms: (data: PDate | [number, number, number]) => PDate,  // 应用时分秒
    useYMD: (data: PDate | [number, number, number]) => PDate,  // 应用年月日

    format: (value: InitialValue) => string // 将对象转化为显示字符串格式的值
    parseDisplay: (display: string) => PDate// 解析显示值
    parseValue: (value: string) => PDate    // 解析值
    clone: () => PDate,                     // 复制一个plainDate对象
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
        timeString,
        dateString,
        Y: Y,
        YM: Number(YM),
        YMD: Number(YMD),
        YMDHms: Number(YMDHms),
        Hms: Number(timeString),
        displayFormat: config.displayFormat!,
        valueFormat: config.valueFormat!,

        getDate: () => dateObj,
        getDayJs: () => dj,
        getDisplay: () => dj.format(config.displayFormat),
        getValue: () => dj.format(config.valueFormat),

        /*根据值修改*/
        useValue: (value: InitialValue) => wrapDate(value, config),
        /*根据显示值修改*/
        useDisplay: (display: string) => wrapDate(DayJs(display, config!.displayFormat), config),
        /*根据年份修改*/
        useYear: (year: number) => wrapDate(dj.year(year), config),
        /*根据月份日期修改*/
        useMonthDate: (month: number, date: number) => {
            const d = new Date(dj.toDate())
            d.setMonth(month, date)
            return wrapDate(d, config)
        },
        /*根据时间修改*/
        useHour: (hour: number) => wrapDate(dj.hour(hour), config),
        /*根据分钟修改*/
        useMinute: (minute: number) => wrapDate(dj.minute(minute), config),
        /*根据秒钟修改*/
        useSecond: (second: number) => wrapDate(dj.second(second), config),
        /*根据时间戳修改*/
        useTime: (time: number) => wrapDate(new Date(time), config),
        /*根据时分秒修改*/
        useHms: (val) => {
            const obj = new Date(dateObj)
            if (Array.isArray(val)) {
                obj.setHours(val[0], val[1], val[2])
            } else {
                obj.setHours(val.hour, val.minute, val.second)
            }
            return wrapDate(obj, config)
        },
        /*根据年月日修改*/
        useYMD: (val) => {
            const obj = new Date(dateObj)
            if (Array.isArray(val)) {
                obj.setFullYear(val[0], val[1], val[2])
            } else {
                obj.setFullYear(val.year, val.month, val.date)
            }
            return wrapDate(obj, config)
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

/**
 * 获取一个默认日期
 * @author  韦胜健
 * @date    2021/1/18 10:29
 */
const defaultDate = () => {
    const date = new Date()
    date.setMonth(0, 1)
    date.setHours(0, 0, 0)
    return date
}
/**
 * 格式化日期为字符串
 * @author  韦胜健
 * @date    2021/1/18 10:29
 */
const format = (date: Date | undefined | null, format: string) => {
    if (!date) return ''
    return DayJs(date).format(format)
}
/**
 * 解析字符串为日期对象
 * @author  韦胜健
 * @date    2021/1/18 10:30
 */
const parse = (str: string | undefined | null, format: string) => {
    if (!str) return null
    return DayJs(str, format)
}

/**
 * 获取当天的日期信息
 * @author  韦胜健
 * @date    2021/1/18 10:30
 */
const today = (displayFormat: string, valueFormat: string) => {
    return wrapDate(new Date(), {displayFormat, valueFormat})
}

export const plainDate = Object.assign(wrapDate, {defaultDate, format, parse, today, DayJs})
