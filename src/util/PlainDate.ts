import fecha from 'fecha'

const zeroize = (value, length = 2) => {
    if (value == null) {
        value = '';
    }
    value = String(value);
    const zeroLen = length - value.length;
    if (zeroLen <= 0)
        return value;
    return new Array(zeroLen).fill('0').join('') + value;
};


enum CompareMode {
    time = 'time',
    date = 'date',
    datetime = 'datetime',
    yearmonth = 'yearmonth',
}

export class PlainDate {

    displayFormat: string                                                       // 显示值格式字符串
    valueFormat: string                                                         // 实际值格式字符串
    dateObject: Date | null = null                                              // 日期对象

    constructor(value, displayFormat: string, valueFormat: string) {
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

    get timeString() {return this.isNull ? null : `${zeroize(this.hour)}${zeroize(this.minute)}${zeroize(this.second)}`}

    get dateString() {return this.isNull ? null : `${zeroize(this.year)}${zeroize(this.month! + 1)}${zeroize(this.date)}`}

    get Y() {return this.isNull ? null : this.year}

    get YM() {return this.isNull ? null : Number(`${this.year}${zeroize(this.month! + 1)}`)}

    get YMD() {return this.isNull ? null : Number(this.dateString)}

    get YMDHms() {return this.isNull ? null : Number(this.dateString! + this.timeString!)}

    get Hms() {return this.isNull ? null : Number(this.timeString)}

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

    static today(displayFormat: string, valueFormat: string): PlainDate {
        let today = new PlainDate(null, displayFormat, valueFormat)
        today.setTime(new Date().getTime())
        return today
    }

    static CompareMode = CompareMode

    /*---------------------------------------methods-------------------------------------------*/

    setValue(value: string) {this.dateObject = !value ? null : PlainDate.parse(String(value), this.valueFormat)}

    setDisplayValue(value: string) {this.dateObject = !value ? null : this.dateObject = PlainDate.parse(String(value), this.displayFormat)}

    setYear(year: number): void {
        if (this.isNull) this.dateObject = PlainDate.defaultDate()
        this.dateObject!.setFullYear(year)
    }

    setMonthDate(month: number, date: number): void {
        if (this.isNull) this.dateObject = PlainDate.defaultDate()
        this.dateObject!.setMonth(month, date)
    }

    setHour(hour: number): void {
        if (this.isNull) this.dateObject = PlainDate.defaultDate()
        this.dateObject!.setHours(hour)
    }

    setMinute(minute: number): void {
        if (this.isNull) this.dateObject = PlainDate.defaultDate()
        this.dateObject!.setMinutes(minute)
    }

    setSecond(second: number): void {
        if (this.isNull) this.dateObject = PlainDate.defaultDate()
        this.dateObject!.setSeconds(second)
    }

    setTime(time: number): void {
        if (this.isNull) this.dateObject = PlainDate.defaultDate()
        this.dateObject!.setTime(time)
    }

    setHms(hour: number | PlainDate, minute?: number, second?: number): void {
        if (typeof hour === "number") {
            this.setHour(hour)
            if (minute != null) this.setMinute(minute)
            if (second != null) this.setSecond(second)
        } else {
            const pd = hour as PlainDate
            this.setHour(pd.hour!)
            this.setMinute(pd.minute!)
            this.setSecond(pd.second!)
        }
    }

    setYMD(year: number | PlainDate, month?: number, date?: number) {
        if (typeof year === 'string') {
            this.setYear(year)
            if (month != null && date != null) this.setMonthDate(month, date)
        } else {
            const pd = year as PlainDate
            this.setYear(pd.year!)
            this.setMonthDate(pd.month!, pd.date!)
        }
    }

    format(dateObject: Date | null): string | null {
        if (!dateObject) return null
        return PlainDate.format(dateObject, this.displayFormat)
    }

    parseDisplayString(displayString: string | null): Date | null {
        if (!displayString) return null
        return PlainDate.parse(displayString, this.displayFormat)
    }

    parseValueString(valueString: string | null): Date | null {
        if (!valueString) return null
        return PlainDate.parse(valueString, this.valueFormat)
    }

    copy(): PlainDate {
        return new PlainDate(this.valueString, this.displayFormat, this.valueFormat)
    }
}