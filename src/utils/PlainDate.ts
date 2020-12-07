import fecha from 'fecha'
import {zeroize} from "plain-utils/string/zeroize";

enum CompareMode {
    time = 'time',
    date = 'date',
    datetime = 'datetime',
    yearmonth = 'yearmonth',
}

type Pub = {
    displayFormat: string
    valueFormat: string

    setValue(value: string | undefined): void,
    setDisplayValue(value: string): void,
    setYear(year: number): void,
    setMonthDate(month: number, date: number): void,
    setHour(hour: number): void,
    setMinute(minute: number): void,
    setSecond(second: number): void,
    setTime(time: number): void,
    setHms(hour: number | PlainDateType, minute?: number, second?: number): void,
    setYMD(year: number | PlainDateType, month?: number, date?: number): void,

    format(dateObject: Date | null): string | null,
    parseDisplayString(displayString: string | null): Date | null,
    parseValueString(valueString: string | null): Date | null,
    copy(): PlainDateType,
}

type Diff =
    {
        dateObject: Date
        isNull: false
        year: number
        month: number
        date: number
        hour: number
        minute: number
        second: number
        day: number
        time: number
        displayString: string
        valueString: string
        timeString: string
        dateString: string
        Y: number
        YM: number
        YMD: number
        YMDHms: number
        Hms: number
    } |
    {
        dateObject: null
        isNull: true
        year: null
        month: null
        date: null
        hour: null
        minute: null
        second: null
        day: null
        time: null
        displayString: null
        valueString: null
        timeString: null
        dateString: null
        Y: null
        YM: null
        YMD: null
        YMDHms: null
        Hms: null
    };

export type PlainDateType = Diff & Pub

class WrapDate {

    displayFormat: string                                                       // 显示值格式字符串
    valueFormat: string                                                         // 实际值格式字符串
    dateObject: Date | null = null                                              // 日期对象

    constructor(value: string | undefined | null, displayFormat: string, valueFormat: string) {
        this.displayFormat = displayFormat
        this.valueFormat = valueFormat

        if (value != null) {
            this.setValue(value)
        }
    }

    /*---------------------------------------attrs-------------------------------------------*/

    get isNull(): boolean {return !this.dateObject}

    get year() {return this.isNull ? null : this.dateObject!.getFullYear()}

    get month() {return this.isNull ? null : this.dateObject!.getMonth()}

    get date() {return this.isNull ? null : this.dateObject!.getDate()}

    get hour() {return this.isNull ? null : this.dateObject!.getHours()}

    get minute() {return this.isNull ? null : this.dateObject!.getMinutes()}

    get second() {return this.isNull ? null : this.dateObject!.getSeconds()}

    get day() {return this.isNull ? null : this.dateObject!.getDay()}

    get time() {return this.isNull ? null : this.dateObject!.getTime()}

    get displayString() {return this.isNull ? null : fecha.format(this.dateObject!, this.displayFormat)}

    get valueString() {return this.isNull ? null : fecha.format(this.dateObject!, this.valueFormat)}

    get timeString() {return this.isNull ? null : `${zeroize(this.hour!)}${zeroize(this.minute!)}${zeroize(this.second!)}`}

    get dateString() {return this.isNull ? null : `${zeroize(this.year!)}${zeroize(this.month! + 1)}${zeroize(this.date!)}`}

    get Y() {return this.isNull ? null : this.year}

    get YM() {return this.isNull ? null : Number(`${this.year}${zeroize(this.month! + 1)}`)}

    get YMD() {return this.isNull ? null : Number(this.dateString)}

    get YMDHms() {return this.isNull ? null : Number(this.dateString! + this.timeString!)}

    get Hms() {return this.isNull ? null : Number(this.timeString)}

    /*---------------------------------------methods-------------------------------------------*/

    setValue(value: string | undefined) {this.dateObject = !value ? null : WrapDate.parse(String(value), this.valueFormat)}

    setDisplayValue(value: string) {this.dateObject = !value ? null : this.dateObject = WrapDate.parse(String(value), this.displayFormat)}

    setYear(year: number): void {
        if (this.isNull) this.dateObject = WrapDate.defaultDate()
        this.dateObject!.setFullYear(year)
    }

    setMonthDate(month: number, date: number): void {
        if (this.isNull) this.dateObject = WrapDate.defaultDate()
        this.dateObject!.setMonth(month, date)
    }

    setHour(hour: number): void {
        if (this.isNull) this.dateObject = WrapDate.defaultDate()
        this.dateObject!.setHours(hour)
    }

    setMinute(minute: number): void {
        if (this.isNull) this.dateObject = WrapDate.defaultDate()
        this.dateObject!.setMinutes(minute)
    }

    setSecond(second: number): void {
        if (this.isNull) this.dateObject = WrapDate.defaultDate()
        this.dateObject!.setSeconds(second)
    }

    setTime(time: number): void {
        if (this.isNull) this.dateObject = WrapDate.defaultDate()
        this.dateObject!.setTime(time)
    }

    setHms(hour: number | WrapDate, minute?: number, second?: number): void {
        if (typeof hour === "number") {
            this.setHour(hour)
            if (minute != null) this.setMinute(minute)
            if (second != null) this.setSecond(second)
        } else {
            const pd = hour as WrapDate
            this.setHour(pd.hour!)
            this.setMinute(pd.minute!)
            this.setSecond(pd.second!)
        }
    }

    setYMD(year: number | WrapDate, month?: number, date?: number) {
        if (typeof year === 'string') {
            this.setYear(year)
            if (month != null && date != null) this.setMonthDate(month, date)
        } else {
            const pd = year as WrapDate
            this.setYear(pd.year!)
            this.setMonthDate(pd.month!, pd.date!)
        }
    }

    format(dateObject: Date | null): string | null {
        if (!dateObject) return null
        return WrapDate.format(dateObject, this.displayFormat)
    }

    parseDisplayString(displayString: string | null): Date | null {
        if (!displayString) return null
        return WrapDate.parse(displayString, this.displayFormat)
    }

    parseValueString(valueString: string | null): Date | null {
        if (!valueString) return null
        return WrapDate.parse(valueString, this.valueFormat)
    }

    copy(): WrapDate {
        return new WrapDate(this.valueString, this.displayFormat, this.valueFormat)
    }

    /*---------------------------------------static-------------------------------------------*/

    static defaultDate(): Date {
        const date = new Date()
        date.setMonth(0, 1)
        date.setHours(0, 0, 0)
        return date
    }

    static format(dateObject: Date, formatString: string) {
        if (!dateObject) return null
        return fecha.format(dateObject, formatString)
    }

    static parse(dateString: string, formatString: string) {
        if (!dateString) return null
        return fecha.parse(dateString, formatString)
    }

    static today(displayFormat: string, valueFormat: string): PlainDateType {
        let today = new WrapDate(null, displayFormat, valueFormat)
        today.setTime(new Date().getTime())
        return today as PlainDateType
    }

    static CompareMode = CompareMode
}

export const PlainDate = WrapDate as any as (new(...args: ConstructorParameters<typeof WrapDate>) => PlainDateType) & {
    defaultDate(): Date,
    format(dateObject: Date, formatString: string): string,
    parse(dateString: string, formatString: string): Date | null,
    today(displayFormat: string, valueFormat: string): PlainDateType,
    CompareMode: typeof CompareMode,
}
